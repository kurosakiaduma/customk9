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
    id: number;
    [key: string]: unknown;
  };
  groupsId?: number[];
}

export class AuthService {
  private static readonly SESSION_KEY = 'odoo_session';
  private static readonly REMEMBER_ME_KEY = 'customk9_remember_me';
  
  /**
   * Gets a cookie value by name
   */
  private static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
      }
    }
    return null;
  }
  
  /**
   * Sets a cookie with the given name, value, and options
   */
  private static setCookie(
    name: string,
    value: string,
    days: number = 7,
    path: string = '/',
    domain?: string,
    secure: boolean = false
  ): void {
    if (typeof document === 'undefined') return;

    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }

    let cookieString = 
      encodeURIComponent(name) + '=' + encodeURIComponent(value) + 
      expires + '; path=' + path;

    if (domain) {
      cookieString += '; domain=' + domain;
    }

    if (secure) {
      cookieString += '; secure';
    }

    // Set the cookie
    document.cookie = cookieString;
  }
  
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
      const userId = result?.id || result?.id;
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
          id: userId,
          ...rest
        };
      }

      const user: AuthUser = {
        id: userId,
        name: displayName,
        email: userInfo.email || email,
        isAdmin,
        isSystem: userInfo.is_system,
        token: String(odooClient.currentUser?.partner_id) || '',
        partnerId: typeof userInfo.partner_id === 'number' ? userInfo.partner_id : undefined,
        context,
        groupsId: Array.isArray(userInfo.groups_id) ? userInfo.groups_id : []
      };

      console.log('AuthService: User data loaded:', user);

      // Store user in memory
      this.currentUser = user;

      // Store session info in cookie for persistence
      try {
        const sessionData = {
          sessionInfo: odooClient.sessionInfo,
          currentUser: user, // Use the user object, not the getter function
          timestamp: Date.now(),
        };
        
        // Set cookie with 1 day expiration
        const domain = window.location.hostname;
        const isProduction = process.env.NODE_ENV === 'production';
        const expiresInDays = 1;
        
        // Set the cookie
        document.cookie = `${AuthService.SESSION_KEY}=${encodeURIComponent(JSON.stringify(sessionData))}; ` +
          `max-age=${expiresInDays * 24 * 60 * 60}; ` +
          `path=/; ` +
          `domain=${domain}; ` +
          `${isProduction ? 'Secure; ' : ''}` +
          'SameSite=Lax';
          
        console.log('AuthService: Session data stored in cookie');
      } catch (storageError) {
        console.error('AuthService: Error storing session data in cookie:', storageError);
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
      console.error('Error during Odoo logout:', error);
    }

    // Clear cookies and localStorage
    if (typeof document !== 'undefined') {
      const domain = window.location.hostname;
      
      // Clear session cookie
      document.cookie = `${AuthService.SESSION_KEY}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=${domain};`;
      
      // Clear remember me cookie
      document.cookie = `${AuthService.REMEMBER_ME_KEY}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=${domain};`;
      
      // Clear localStorage for backward compatibility
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(AuthService.SESSION_KEY);
        localStorage.removeItem(AuthService.REMEMBER_ME_KEY);
      }
      
      console.log('Session cookies and localStorage cleared');
    }
    
    // Clear in-memory user
    this.currentUser = null;
  }

  isAuthenticated(): boolean {
    // Check in-memory user first
    if (this.currentUser) {
      return true;
    }
    
    // Check cookie
    if (typeof document === 'undefined') return false;
    
    try {
      // Get the session cookie
      const cookieValue = AuthService.getCookie(AuthService.SESSION_KEY);
      if (!cookieValue) {
        return false;
      }
      
      // Parse the cookie value
      const sessionData = JSON.parse(cookieValue);
      if (sessionData?.currentUser) {
        // Restore user from cookie
        this.currentUser = sessionData.currentUser;
        return true;
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
    }
    
    return false;
  }

  getToken(): string | null {
    if (typeof document === 'undefined') return null;
    
    try {
      const cookieValue = AuthService.getCookie(AuthService.SESSION_KEY);
      if (!cookieValue) return null;
      
      const sessionData = JSON.parse(cookieValue);
      return sessionData?.sessionInfo?.session_id || null;
    } catch (error) {
      console.error('Error getting token from cookie:', error);
      return null;
    }
  }

  public getCurrentUser(): AuthUser | null {
    // Return from memory if available
    if (this.currentUser) {
      return this.currentUser;
    }
    
    // Try to load from cookie
    try {
      if (typeof document === 'undefined') return null;
      
      const cookieValue = AuthService.getCookie(AuthService.SESSION_KEY);
      if (!cookieValue) return null;
      
      const sessionData = JSON.parse(cookieValue);
      if (sessionData?.currentUser) {
        this.currentUser = sessionData.currentUser;
        return this.currentUser;
      }
    } catch (error) {
      console.error('Error loading user from cookie:', error);
    }
    
    return null;
  }
  
  setRememberMe(remember: boolean): void {
    if (typeof document === 'undefined') return;
    
    const domain = window.location.hostname;
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (remember) {
      // Set remember me cookie for 30 days
      AuthService.setCookie(
        AuthService.REMEMBER_ME_KEY, 
        'true', 
        30, // days
        '/', // path
        domain, // domain
        isProduction // secure in production
      );
    } else {
      // Clear remember me cookie
      document.cookie = `${AuthService.REMEMBER_ME_KEY}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=${domain};`;
    }
  }

  private setAuthData(user: AuthUser): void {
    // Get session info from Odoo client
    const sessionInfo = this.odooClientService.getSessionInfo();

    // Store user and session in cookie
    const sessionData = {
      sessionInfo: sessionInfo,
      currentUser: user,
      timestamp: Date.now(),
    };
    
    const domain = typeof window !== 'undefined' ? window.location.hostname : '';
    const isProduction = process.env.NODE_ENV === 'production';
    
    AuthService.setCookie(
      AuthService.SESSION_KEY,
      JSON.stringify(sessionData),
      1, // 1 day
      '/', // path
      domain, // domain
      isProduction // secure in production
    );
  }
}