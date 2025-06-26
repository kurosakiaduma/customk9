import { OdooClientService } from '../odoo/OdooClientService';
import { config } from '@/config/config';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  token: string;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'customk9_auth_token';
  private static readonly USER_KEY = 'customk9_user';
  private odooClientService: OdooClientService;

  constructor(odooClientService: OdooClientService) {
    this.odooClientService = odooClientService;
  }
  async login(email: string, password: string): Promise<AuthUser> {
    try {
      // Use the OdooClientService's authenticateUser method which creates the proper session
      const sessionInfo = await this.odooClientService.authenticateUser(email, password);
      
      const user: AuthUser = {
        id: sessionInfo.uid,
        name: sessionInfo.username,
        email: email,
        token: sessionInfo.session_id
      };
      
      this.setAuthData(user);
      return user;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error('Authentication failed');
    }
  }

  async register(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<AuthUser> {
    try {
      console.log('Starting registration process for:', userData.email);
      const response = await this.odooClientService.registerUser(userData);
      console.log('Registration successful:', response);
      
      const user: AuthUser = {
        id: response.userId,
        name: userData.name,
        email: userData.email,
        token: response.token
      };
      
      // Don't set auth data - user needs to log in first
      return user;
    } catch (error) {
      console.error('Registration failed:', error);
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`);
      } else {
        throw new Error('Registration failed: An unexpected error occurred');
      }
    }
  }  async logout(): Promise<void> {
    try {
      // Clear Odoo session
      await this.odooClientService.logoutUser();
      console.log('✅ Odoo session cleared');
    } catch (error) {
      console.error('❌ Error during Odoo logout:', error);
    }
    
    // Always clear local storage - be thorough
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AuthService.TOKEN_KEY);
      localStorage.removeItem(AuthService.USER_KEY);
      localStorage.removeItem('customk9_user_session');
      localStorage.removeItem('customk9_user_name');
      
      // Clear any other potential auth-related storage
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('customk9_') || key.includes('auth') || key.includes('session')
      );
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log('✅ All local storage cleared');
    }
  }
  isAuthenticated(): boolean {
    // Check both the old token-based auth and the new Odoo session
    const hasToken = !!this.getToken();
    const hasOdooSession = !!this.odooClientService.getCurrentUser();
    
    return hasToken || hasOdooSession;
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem(AuthService.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private setAuthData(user: AuthUser): void {
    localStorage.setItem(AuthService.TOKEN_KEY, user.token);
    localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
  }
} 