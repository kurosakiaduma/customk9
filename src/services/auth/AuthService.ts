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
      const response = await this.odooClientService.authenticate(email, password, config.odoo.database);
      const user: AuthUser = {
        id: response.uid,
        name: response.name,
        email: email,
        token: response.session_id
      };
      
      this.setAuthData(user);
      return user;
    } catch (error) {
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
  }

  logout(): void {
    localStorage.removeItem(AuthService.TOKEN_KEY);
    localStorage.removeItem(AuthService.USER_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
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