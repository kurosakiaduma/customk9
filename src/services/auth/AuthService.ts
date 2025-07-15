import OdooClientService from '../odoo/OdooClientService';


export interface AuthUser {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  isSystem?: boolean;
  token: string;
  partnerId?: number;
  context?: {
    lang: string;
    tz: string;
    uid: number;
    [key: string]: unknown;
  };
  groupsId?: number[];
}

export class AuthService {
  private static readonly SESSION_KEY = 'odoo_session';
  private static readonly REMEMBER_ME_KEY = 'customk9_remember_me';
  
  private odooClientService: OdooClientService;
  private currentUser: AuthUser | null = null;

  constructor(odooClientService: OdooClientService) {
    this.odooClientService = odooClientService;
  }

  async login(email: string, password: string): Promise<AuthUser> {
    try {
      console.log('AuthService: Starting login for', email);

      // Get Odoo client service
      const odooClient = this.odooClientService;

      // Authenticate with Odoo using the login method
      const result = await odooClient.login(email, password);
      
      // Log the full Odoo response structure for debugging
      console.group('🔍 AuthService: Odoo Login Response');
      console.log('Raw response object:', JSON.stringify(result, null, 2));
      
      // Log the response structure with types
      console.log('Response structure:', {
        'result.uid (number)': result?.uid,
        'result.id (number)': result?.id,
        'result.name (string)': result?.name,
        'result.email (string)': result?.email,
        'result.partner_id (number | [number, string] | null)': result?.partner_id,
        'result.is_admin (boolean)': result?.is_admin,
        'result.is_system (boolean)': result?.is_system,
        'result.session_id (string)': result?.session_id,
        'result.groups_id (number[])': result?.groups_id,
        'result.context (object)': result?.context ? '(object - see below)' : 'undefined',
        'result.user_context (object)': result?.user_context ? '(object - see below)' : 'undefined'
      });
      
      if (result?.context) {
        console.log('result.context:', result.context);
      }
      if (result?.user_context) {
        console.log('result.user_context:', result.user_context);
      }
      console.groupEnd();

      // Check if the result contains a valid user ID
      const userId = result?.uid || result?.id;
      if (!userId) {
        console.error('❌ AuthService: Authentication failed - no user ID in response');
        throw new Error('Authentication failed: Invalid credentials or server error');
      }

      console.log('✅ AuthService: Authentication successful', {
        userId,
        username: result?.name || 'N/A',
        email: result?.email || 'N/A',
        isAdmin: result?.is_admin || false,
        hasSessionId: !!result?.session_id
      });

      // The Odoo login response already contains all the user info we need
      const userInfo = result;
      
      // Check if user is admin (use the is_admin flag from the login response)
      const isAdmin = Boolean(userInfo?.is_admin);
      
      // Get the user's name, defaulting to email if name is not available
      const displayName = userInfo?.name || email;

      // Safely extract context with proper types
      let context: AuthUser['context'] = undefined;
      if (userInfo.context) {
        const { lang, tz, ...rest } = userInfo.context;
        context = {
          lang: typeof lang === 'string' ? lang : 'en_US',
          tz: typeof tz === 'string' ? tz : 'UTC',
          uid: userId,
          ...rest
        };
      }

      const user: AuthUser = {
        id: userId,
        name: displayName,
        email: userInfo.email || email,
        isAdmin,
        isSystem: userInfo.is_system,
        token: String(odooClient.currentUser?.partner_id) || '', // 
        partnerId: typeof userInfo.partner_id === 'number' ? userInfo.partner_id : undefined,
        context,
        groupsId: Array.isArray(userInfo.groups_id) ? userInfo.groups_id : []
      };

      console.log('AuthService: User data loaded:', user);

      // Store user in memory
      this.currentUser = user;

      // Store session info in odoo_session for persistence
      try {
        // Calculate expiration timestamp: now + 40 minutes (in ms), UTC+3
        const now = new Date();
        now.setMinutes(now.getMinutes() + 40);
        const utc3Timestamp = now.getTime() + (3 * 60 * 60 * 1000);

        const sessionData = {
          sessionInfo: odooClient.sessionInfo,
          currentUser: odooClient.getCurrentUser,
          timestamp: utc3Timestamp,
        };
        localStorage.setItem(AuthService.SESSION_KEY, JSON.stringify(sessionData));
        console.log('AuthService: Session data stored in odoo_session');
      } catch (storageError) {
        console.error('AuthService: Error storing session data in odoo_session:', storageError);
      }

      return user;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error('Authentication failed');
    }
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<AuthUser> {
    try {
      console.log('Starting registration process for:', userData.email);

      // Create a new partner in Odoo
      const partnerData: Record<string, unknown> = {
        name: userData.name,
        email: userData.email,
        customer_rank: 1, // Mark as customer
        ...(userData.phone ? { phone: userData.phone } : {})
      };

      const partnerId = await this.odooClientService.create('res.partner', partnerData);

      if (!partnerId) {
        throw new Error('Failed to create user profile');
      }

      // Create user account
      const userId = await this.odooClientService.create('res.users', {
        name: userData.name,
        login: userData.email,
        password: userData.password,
        partner_id: partnerId,
        groups_id: [9] // Add to portal group (ID 9 is portal user in Odoo)
      });

      if (!userId) {
        throw new Error('Failed to create user account');
      }

      // Do NOT auto-login or set any custom session logic
      // Just return a minimal AuthUser object for confirmation
      return {
        id: userId,
        name: userData.name,
        email: userData.email,
        isAdmin: false,
        token: '',
        partnerId: partnerId,
        context: undefined,
        groupsId: [9]
      };
    } catch (error) {
      console.error('Registration failed:', error);
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`);
      } else {
        throw new Error('Registration failed: An unexpected error occurred');
      }
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear Odoo session
      if (typeof this.odooClientService.clearSession === 'function') {
        await this.odooClientService.clearSession();
        console.log('Odoo session cleared');
      }
    } catch (error) {
      console.error(' Error during Odoo logout:', error);
    }

    // Always clear odoo_session and remember me
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AuthService.SESSION_KEY);
      localStorage.removeItem(AuthService.REMEMBER_ME_KEY);
      console.log('odoo_session and remember me cleared');
    }
  }

  isAuthenticated(): boolean {
    // Treat user as authenticated if currentUser exists, regardless of session_id value
    if (this.currentUser) {
      return true;
    }
    if (typeof window === 'undefined') return false;
    const sessionData = localStorage.getItem(AuthService.SESSION_KEY);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      if (parsed?.currentUser) {
        this.currentUser = parsed.currentUser;
        return true;
      }
    }
    return false;
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const sessionData = localStorage.getItem(AuthService.SESSION_KEY);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      return parsed?.sessionInfo?.session_id || null;
    }
    return null;
  }

  public getCurrentUser(): AuthUser | null {
    // Return from memory if available
    if (this.currentUser) {
      return this.currentUser;
    }
    // Try to load from odoo_session
    try {
      if (typeof window === 'undefined') return null;
      const sessionData = localStorage.getItem(AuthService.SESSION_KEY);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed?.currentUser) {
          this.currentUser = parsed.currentUser;
          return parsed.currentUser;
        }
      }
    } catch (error) {
      console.error('Error loading user from odoo_session:', error);
    }
    return null;
  }
  
  setRememberMe(remember: boolean): void {
    if (typeof window === 'undefined') return;
    
    if (remember) {
      localStorage.setItem(AuthService.REMEMBER_ME_KEY, 'true');
    } else {
      localStorage.removeItem(AuthService.REMEMBER_ME_KEY);
    }
  }

  // getCurrentUser is already implemented above
  // Remove this duplicate method

  private setAuthData(user: AuthUser): void {
    // Store user in odoo_session
    const sessionData = {
      sessionInfo: null,
      currentUser: user,
      timestamp: Date.now(),
    };
    localStorage.setItem(AuthService.SESSION_KEY, JSON.stringify(sessionData));
  }
}