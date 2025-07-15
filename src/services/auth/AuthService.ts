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
  private static readonly TOKEN_KEY = 'customk9_auth_token';
  private static readonly USER_KEY = 'customk9_user';
  private static readonly SESSION_TOKEN_KEY = 'customk9_session_token';
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
        token: odooClient.sessionId || '',
        partnerId: typeof userInfo.partner_id === 'number' ? userInfo.partner_id : undefined,
        context,
        groupsId: Array.isArray(userInfo.groups_id) ? userInfo.groups_id : []
      };

      console.log('AuthService: User data loaded:', user);

      // Store user in memory
      this.currentUser = user;

      // Store user in localStorage for persistence
      try {
        localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
        if (result.session_id) {
          localStorage.setItem(AuthService.TOKEN_KEY, result.session_id);
          // Also store the session ID in sessionStorage for the current tab
          sessionStorage.setItem(AuthService.SESSION_TOKEN_KEY, result.session_id);
        }
        console.log('AuthService: User data stored in localStorage');
      } catch (storageError) {
        console.error('AuthService: Error storing user data in localStorage:', storageError);
        // Don't fail the login if storage fails, but log it
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

      // Log the user in after registration
      const user = await this.login(userData.email, userData.password);
      console.log('Registration and login successful for user ID:', userId);
      
      return user;
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
      await this.odooClientService.logout();
      console.log('Odoo session cleared');
    } catch (error) {
      console.error(' Error during Odoo logout:', error);
    }

    // Always clear local storage - be thorough
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AuthService.TOKEN_KEY);
      localStorage.removeItem(AuthService.USER_KEY);
      localStorage.removeItem(AuthService.REMEMBER_ME_KEY);
      localStorage.removeItem('customk9_user_session');
      localStorage.removeItem('customk9_user_name');

      // Clear any other potential auth-related storage
      const keysToRemove = Object.keys(localStorage).filter(key =>
        key.startsWith('customk9_') || key.includes('auth') || key.includes('session')
      );
      keysToRemove.forEach(key => localStorage.removeItem(key));

      console.log(' All local storage cleared');
    }
  }

  isAuthenticated(): boolean {
    // Check if we have a valid user in memory
    if (this.currentUser) {
      console.log('AuthService: User found in memory');
      return true;
    }

    // First check sessionStorage for the current tab's session
    const sessionToken = sessionStorage.getItem(AuthService.SESSION_TOKEN_KEY);
    if (sessionToken) {
      console.log('AuthService: Found session token in sessionStorage');
      // Try to load the user from localStorage
      const user = this.getCurrentUser();
      return user !== null;
    }

    // Then check localStorage for persistent sessions
    const rememberMe = localStorage.getItem(AuthService.REMEMBER_ME_KEY) === 'true';
    const token = localStorage.getItem(AuthService.TOKEN_KEY);

    if (token && rememberMe) {
      console.log('AuthService: Found remember me token in localStorage');
      // Try to load the user from localStorage
      const user = this.getCurrentUser();
      return user !== null;
    }

    console.log('AuthService: No valid session found');
    return false;
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  public getCurrentUser(): AuthUser | null {
    // Return from memory if available
    if (this.currentUser) {
      return this.currentUser;
    }
    
    // Try to load from localStorage
    try {
      if (typeof window === 'undefined') return null;
      
      const userData = localStorage.getItem(AuthService.USER_KEY);
      const token = localStorage.getItem(AuthService.TOKEN_KEY);
      
      if (userData && token) {
        const user = JSON.parse(userData);
        // Add the token to the user object
        user.token = token;
        this.currentUser = user;
        return user;
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
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
    localStorage.setItem(AuthService.TOKEN_KEY, user.token);
    localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
  }
} 