import { OdooUserContext } from '../odoo/odoo.types';
import OdooClientService, { OdooUser } from '../odoo/OdooClientService';

/**
 * Represents the user object within the application's auth context.
 * This is a sanitized version of the OdooUser, tailored for the frontend.
 */
export interface AuthUser {
  id: number;
  name?: string;
  email?: string;
  isAdmin: boolean;
  isSystem?: boolean;
  partnerId?: number;
  context?: OdooUserContext;
  groupsId?: number[];
}

/**
 * AuthService provides a high-level interface for user authentication and session management.
 * It orchestrates the stateless OdooClientService and manages the client-side session state,
 * including a custom readable cookie for synchronous UI updates.
 */
export class AuthService {
  private odooClientService: OdooClientService;
  private currentUser: AuthUser | null = null;

  constructor(odooClientService: OdooClientService) {
    this.odooClientService = odooClientService;
  }

  /**
   * Authenticates a user with Odoo, then creates a custom session cookie for the Next.js app.
   * @param email The user's email (login).
   * @param password The user's password.
   * @returns A promise that resolves to the authenticated user.
   */
  async login(email: string, password: string): Promise<AuthUser> {
    const db = process.env.NEXT_PUBLIC_ODOO_DATABASE;
    if (!db) {
      throw new Error('Odoo database name is not configured. Please set NEXT_PUBLIC_ODOO_DATABASE.');
    }

    try {
      console.log('AuthService: Starting Odoo login for', email);
      const odooUser = await this.odooClientService.login(db, email, password);
      console.log('AuthService: Odoo login successful. This is the odooUser object', odooUser);
      if (!odooUser?.uid) {
        throw new Error('Authentication failed: Invalid response from Odoo.');
      }

      const user = this._createAuthUser(odooUser);

      // Set the custom session cookie via our API route
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });

      this.currentUser = user;
      console.log('✅ AuthService: Login successful, user data loaded and session cookie set.');
      return user;
    } catch (error) {
      console.error('❌ AuthService: Login failed', error);
      this.currentUser = null;
      // Attempt to clear any lingering session state
      await this.logout();
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Registers a new user and partner in Odoo and then logs them in.
   * @param userData The data for the new user.
   * @returns A promise that resolves to the authenticated user.
   */
  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<AuthUser> {
    try {
      console.log('AuthService: Registering new user', userData.email);

      // Step 1: Create the partner record
      const partnerData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        company_type: 'person',
      };
      const partnerId = await this.odooClientService.callOdooMethod<number>('res.partner', 'create', [partnerData]);

      if (!partnerId) {
        throw new Error('Failed to create partner record in Odoo.');
      }

      // Step 2: Create the user record, linked to the partner
      const newUserData = {
        name: userData.name,
        login: userData.email,
        password: userData.password,
        partner_id: partnerId,
        groups_id: [[6, 0, [2]]], // Add to 'Internal User' group by default
      };
      await this.odooClientService.callOdooMethod('res.users', 'create', [newUserData]);

      // Step 3: Log the new user in to establish a session
      console.log('AuthService: Registration successful, logging in new user.');
      return this.login(userData.email, userData.password);
    } catch (error) {
      console.error('❌ AuthService: Registration failed', error);
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clears the user's session from Odoo and removes the custom session cookie.
   */
  async logout(): Promise<void> {
    // Clear the Odoo session on the server side (best effort)
    // This tells Odoo to invalidate its session_id
    try {
      await this.odooClientService.clearSession();
    } catch (error) {
      console.error('Error during Odoo server-side logout:', error);
    }

    // Clear our custom session cookie via our API route
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
    } catch (error) {
      console.error('Error clearing custom session cookie:', error);
    }

    // Clear the user from memory
    this.currentUser = null;
    console.log('AuthService: Logout complete, user data and session cookie cleared.');
  }

  /**
   * Checks if the user is authenticated by verifying the presence of the session_id cookie.
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Retrieves the user session data from the custom 'customk9_session' cookie.
   */
  getToken(): AuthUser | null {
    if (typeof document === 'undefined') return null;

    const match = document.cookie.match(/customk9_session=([^;]+)/);
    if (match && match[1]) {
      try {
        // Decode and parse the cookie value
        const decodedValue = decodeURIComponent(match[1]);
        return JSON.parse(decodedValue);
      } catch (error) {
        console.error('Failed to parse session cookie:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Gets the current user. It prioritizes in-memory data, then the custom session cookie,
   * and finally falls back to an async check with Odoo.
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    // 1. Check for user in memory
    if (this.currentUser) {
      return this.currentUser;
    }

    // 2. Check for the custom session cookie
    const userFromCookie = this.getToken();
    if (userFromCookie) {
      console.log('Restored user from session cookie.');
      this.currentUser = userFromCookie;
      return this.currentUser;
    }

    // 3. Fallback: If no cookie, check Odoo for a valid HttpOnly session_id.
    // This covers cases where the custom cookie expired or was cleared, but the Odoo session is still valid.
    try {
      console.log('No session cookie found, attempting to restore session from Odoo...');
      const sessionInfo = await this.odooClientService.getSessionInfo();
      if (sessionInfo && sessionInfo.uid) {
        const odooUser = await this.odooClientService.getUser(sessionInfo.uid);
        // Note: When restoring a session, we don't get a new session_id from getUser.
        // The valid HttpOnly cookie is our authentication. We use a placeholder for the token.
        if (odooUser) {
          const user = this._createAuthUser(odooUser);
          // Restore the session by re-creating the custom readable cookie
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user }),
          });
          this.currentUser = user;
          console.log('✅ AuthService: Session restored from Odoo and custom cookie recreated.');
          return this.currentUser;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to restore session from Odoo:', error);
      return null;
    }
  }

  /**
   * A private helper to transform an OdooUser into an AuthUser, handling type inconsistencies.
   */
  private _createAuthUser(odooUser: OdooUser): AuthUser {
    const partnerId = Array.isArray(odooUser.partner_id)
      ? Number(odooUser.partner_id[0])
      : Number(odooUser.partner_id);

    return {
      id: odooUser.id,
      name: odooUser.name,
      email: odooUser.email,
      isAdmin: odooUser.is_admin,
      isSystem: odooUser.is_system,
      partnerId: partnerId,
      context: odooUser.context as OdooUserContext,
    };
  }
}