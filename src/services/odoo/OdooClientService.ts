import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  OdooSessionInfo,
  OdooUser,
  OdooError,
  ProjectTask,
  CalendarEvent
} from './odoo.types';

import { Dog } from '@/types/dog';

// Constants for session management
// Note: Retry logic constants are defined but not yet implemented
const SESSION_TIMEOUT_MS = 1000 * 60 * 30; // 30 minutes

// Logger utility
const logger = {
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[OdooClient] ${message}`, data || '');
    }
  },
  info: (message: string, data?: unknown) => {
    console.info(`[OdooClient] ${message}`, data || '');
  },
  warn: (message: string, error?: unknown) => {
    console.warn(`[OdooClient] ${message}`, error || '');
  },
  error: (message: string, error?: unknown) => {
    console.error(`[OdooClient] ${message}`, error || '');
  },
};

type OdooDomainItem = [string, string, unknown];
type OdooDomain = OdooDomainItem[];

// Re-export types for convenience
export type {
  OdooUser,
  OdooError,
  OdooDomain
};

interface OdooClientConfig {
  baseUrl: string;
  db: string; // Required database name
  debug?: boolean;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  database?: string;
}

// Event handler types for Odoo client events
// These are defined for potential future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type OdooClientEvents = {
  onSessionExpired?: () => void;
  onError?: (error: unknown) => void;
  onLogin?: (user: OdooUser) => void;
  onLogout?: () => void;
  onUnauthorized?: () => void;
  onForbidden?: () => void;
  onNotFound?: () => void;
  onBadRequest?: (error: unknown) => void;
  onServerError?: (error: unknown) => void;
  onNetworkError?: (error: unknown) => void;
  onRequest?: (config: AxiosRequestConfig) => void;
  onResponse?: (response: AxiosResponse) => void;
  onResponseError?: (error: AxiosError) => void;
  onRequestError?: (error: unknown) => void;
};

interface CurrentUser {
  id: number;
  username: string;
  displayName?: string;
  partnerId?: number | [number, string] | null;
  isAdmin: boolean;
  is_system: boolean;
  session_id: string;
  context: Record<string, unknown>;
  groups_id?: number[];
  expires_at?: number;
}

  export default class OdooClientService {

    /**
     * Saves the current session and user info to cookies
     */
    private async saveSessionToStorage(): Promise<void> {
      if (typeof document === 'undefined') return;
      
      try {
        const sessionData = {
          sessionInfo: this._sessionInfo,
          currentUser: this._currentUser,
          timestamp: Date.now(),
        };
        
        // Store session data in a cookie that expires in 1 day
        const cookieValue = JSON.stringify(sessionData);
        const expiresInDays = 1; // 1 day
        
        // Set the cookie with HttpOnly and Secure flags in production
        const isProduction = process.env.NODE_ENV === 'production';
        const domain = window.location.hostname;
        
        // Set the cookie
        document.cookie = `odoo_session=${encodeURIComponent(cookieValue)}; ` +
          `max-age=${expiresInDays * 24 * 60 * 60}; ` +
          `path=/; ` +
          `domain=${domain}; ` +
          `${isProduction ? 'Secure; ' : ''}` +
          'SameSite=Lax';
        
        if (this._config.debug) {
          console.log('Session saved to odoo_session cookie');
        }
      } catch (error) {
        console.error('Error saving session to cookie:', error);
      }
    }
  /**
   * Clears the current session and authentication state
   */
  public async clearSession(): Promise<void> {
    this._sessionInfo = null;
    this._currentUser = null;
    this._isAuthenticated = false;
    this._authenticationPromise = null;
    
    // Clear any stored session data
    if (typeof document !== 'undefined') {
      try {
        const domain = window.location.hostname;
        
        // Clear session_id cookie
        document.cookie = 'session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        
        // Clear odoo_session cookie
        document.cookie = `odoo_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=${domain};`;
        
        // Session cleared from cookies
        
        logger.info('Session cleared');
      } catch (error) {
        logger.error('Error clearing session', { error });
      }
    }
    
    // Notify listeners
    this._onLogout?.();
  }
  private _client!: AxiosInstance;
  private _sessionInfo: OdooSessionInfo | null = null;
  private _adminSessionInfo: OdooSessionInfo | null = null;
  private _currentUser: CurrentUser | null = null;
  private _isAuthenticated = false;
  private _authenticationPromise: Promise<OdooSessionInfo> | null = null;
  private _config: OdooClientConfig;
  private _requestQueue: Array<() => Promise<unknown>> = [];
  private _isRefreshing = false; // Track if a refresh is in progress

  private _onSessionExpired: ((error?: Error | OdooError) => void) | null = null;
  private _onError: ((error: unknown) => void) | null = null;
  private _onLogin: ((user: OdooUser) => void) | null = null;
  private _onLogout: (() => void) | null = null;
  private _onUnauthorized: ((error?: unknown) => void) | null = null;
  private _onForbidden: ((error?: unknown) => void) | null = null;
  private _onNotFound: ((error?: unknown) => void) | null = null;
  private _onBadRequest: ((error: unknown) => void) | null = null;
  private _onServerError: ((error: unknown) => void) | null = null;
  private _onNetworkError: ((error: unknown) => void) | null = null;
  private _onRequest: ((config: AxiosRequestConfig) => void) | null = null;
  private _onResponse: ((response: AxiosResponse) => void) | null = null;
  private _onResponseError: ((error: AxiosError) => void) | null = null;
  private _onRequestError: ((error: unknown) => void) | null = null;

  constructor(config: OdooClientConfig) {
    // Ensure we have a database name
    const db = config.db || ('database' in config ? config.database : undefined);
    
    if (!db) {
      console.error('Database name is required in OdooClientConfig. Received config:', config);
      throw new Error('Database name (db) is required in OdooClientConfig');
    }
    
    this._config = {
      ...config,
      db, // Ensure db is set
      timeout: config.timeout || 30000, // 30 seconds default timeout
    };
    
    console.log('OdooClientService initialized with config:', {
      baseUrl: this._config.baseUrl,
      db: this._config.db,
      timeout: this._config.timeout,
      debug: this._config.debug
    });
    
    this.initializeAxios();
    // No custom session restoration logic; rely only on Odoo session cookie
  }

  /**
   * Extracts the session ID from the response headers or cookies
   * @param response The Axios response object
   * @returns The session ID if found, otherwise null
   */
  private extractSessionId(response: AxiosResponse): string | null {
    // First, try to get from response data
    if (response.data?.result?.session_id) {
      return response.data.result.session_id;
    }

    // Then try to get from response headers
    const setCookieHeader = response.headers?.['set-cookie'] || [];
    for (const cookie of setCookieHeader) {
      const match = cookie.match(/session_id=([^;]+)/);
      if (match && match[1]) {
        return match[1];
      }
    }

    // Finally, check the response data for a session ID
    if (response.data?.session_id) {
      return response.data.session_id;
    }

    logger.warn('No session ID found in response');
    return null;
  }

  /**
   * Initializes the Axios instance with interceptors for request/response handling
   */
  private initializeAxios(): void {
    this._client = axios.create({
      baseURL: this._config.baseUrl,
      timeout: this._config.timeout,
      withCredentials: this._config.withCredentials ?? true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(this._config.headers || {})
      },
    });

    // Request interceptor for logging and authentication
    this._client.interceptors.request.use(
      (config) => {
        const requestId = Math.random().toString(36).substring(2, 9);
        const requestData = {
          id: requestId,
          method: config.method?.toUpperCase(),
          url: config.url,
          params: config.params,
          data: config.data,
        };
        
        logger.debug('Outgoing request', requestData);
        
        // Add session info to request if available
        if (this._sessionInfo?.session_id) {
          config.headers = config.headers || {};
          config.headers['X-Openerp-Session-Id'] = this._sessionInfo.session_id;
        }

        if (this._onRequest) {
          this._onRequest(config);
        }
        
        return config;
      },
      (error) => {
        logger.error('Request interceptor error', error);
        if (this._onRequestError) {
          this._onRequestError(error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling and logging
    this._client.interceptors.response.use(
      (response) => {
        logger.debug('Response received', {
          status: response.status,
          statusText: response.statusText,
          url: response.config.url,
          data: response.data,
        });

        if (this._onResponse) {
          this._onResponse(response);
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // Log the error
        if (axios.isAxiosError(error)) {
          const response = error.response;
          const errorData = response?.data as OdooError | undefined;
          
          logger.error('API Error', {
            url: originalRequest.url,
            status: response?.status,
            statusText: response?.statusText,
            error: errorData || error.message,
          });

          // Handle session expiration (401 Unauthorized)
          if (response?.status === 401 && !originalRequest._retry) {
            if (this._isRefreshing) {
              // If already refreshing, add the request to the queue
              return new Promise((resolve, reject) => {
                this._requestQueue.push(() => {
                  return this._client(originalRequest).then(resolve).catch(reject);
                });
              });
            }

            originalRequest._retry = true;
            this._isRefreshing = true;

            try {
              // Try to refresh the session
              await this.refreshSession();
              
              // Replay queued requests
              while (this._requestQueue.length) {
                const request = this._requestQueue.shift();
                await request?.();
              }
              
              // Retry the original request
              return this._client(originalRequest);
            } catch (error) {
              // If refresh fails, clear session and reject
              logger.error('Session refresh failed', { error });
              await this.clearSession();
              this._requestQueue = [];
              throw error;
            } finally {
              this._isRefreshing = false;
            }
          }

          // Handle other error statuses
          switch (response?.status) {
            case 400:
              this._onBadRequest?.(error);
              break;
            case 403:
              this._onForbidden?.();
              break;
            case 404:
              this._onNotFound?.();
              break;
            case 500:
              this._onServerError?.(error);
              break;
            default:
              this._onNetworkError?.(error);
          }
        } else {
          logger.error('Network Error', error);
          this._onNetworkError?.(error);
        }

        if (this._onResponseError) {
          this._onResponseError(error);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Authenticates a user with the Odoo server
   * @param login User's login/email
   * @param password User's password
   * @returns Promise that resolves with the authenticated user data
   * @throws {Error} If authentication fails
   */
  public async login(login: string, password: string): Promise<OdooUser> {
    if (this._authenticationPromise) {
      return this._authenticationPromise.then(() => {
        if (this._isAuthenticated && this._currentUser) {
          return this.mapCurrentUserToOdooUser(this._currentUser);
        }
        throw new Error('Authentication in progress but failed to retrieve user after completion.');
      });
    }

    logger.info('Attempting login', { login });
    
    const apiPath = '/web/session/authenticate';
    const dbName = this._config.db || 'customk9';
    
    this._authenticationPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await this._client.post(apiPath, {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            db: dbName,
            login: login,
            password: password,
            context: {}
          }
        });

        logger.debug('Raw authentication response', {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
          timestamp: new Date().toISOString(),
        });

        const result = response.data?.result;
        console.log(`[OdooClientService] RESULT ONE IS ${result}`)
        if (!result || (!result.uid && !result.id)) {
          const error = new Error('Invalid response format from Odoo server: Missing user ID in response');
          logger.error('Authentication failed: Invalid response format', {
            error: error.message,
            status: response.status,
            responseData: response.data,
            timestamp: new Date().toISOString(),
          });
          throw new Error('Authentication failed: Invalid response format');
        }
        // Extract the result object which contains user data
        const result_two = response.data.result?.result || response.data.result || {};
        console.log(`[OdooClientService] RESULT TWO IS ${result_two}`)
        // Extract session ID from response data or cookies
        let sessionId = result.session_id || '';
        if (!sessionId) {
          const cookies = response.headers?.['set-cookie'] || [];
          for (const cookie of cookies) {
            const match = cookie.match(/session_id=([^;]+)/);
            if (match) {
              sessionId = match[1];
              break;
            }
          }
        }

        // Check if login was successful by looking for a valid uid in the result
        const effectiveUid = result.uid || result.id;
        if (!effectiveUid) {
          const errorMessage = 'Authentication failed: No valid user ID received';
          logger.error('Login failed - missing uid', { 
            error: errorMessage,
            responseData: result 
          });
          throw new Error(errorMessage);
        }
        
        // Extract user data from the response
        const userData = {
          id: effectiveUid,
          name: result.name || login,
          username: result.username || result.login || login,
          partner_id: result.partner_id,
          isAdmin: Boolean(result.is_admin || result.is_system),
          is_system: Boolean(result.is_system),
          session_id: sessionId,
          context: result.user_context || result.context || {},
          groups_id: result.groups_id || [],
          email: result.email || result.login || ''
        };

        // Create session info with the user data
        this._sessionInfo = {
          uid: effectiveUid,
          username: userData.username || login,
          name: userData.name || login,
          is_admin: userData.isAdmin,
          is_system: userData.is_system,
          session_id: sessionId,
          partner_id: userData.partner_id,
          context: userData.context,
          groups_id: userData.groups_id,
          expires_at: Date.now() + SESSION_TIMEOUT_MS,
          db: dbName,
          company_id: 1, // Default company ID
          tz: 'UTC' // Default timezone
        };

        // Store the current user
        this._currentUser = {
          id: effectiveUid,
          username: userData.username || login,
          displayName: userData.name || login,
          partnerId: userData.partner_id,
          isAdmin: userData.isAdmin,
          is_system: userData.is_system,
          session_id: sessionId,
          context: userData.context,
          groups_id: userData.groups_id,
          expires_at: Date.now() + SESSION_TIMEOUT_MS
        };
        
        this._isAuthenticated = true;

        if (!sessionId) {
          logger.warn('Login succeeded but session_id is missing. Proceeding with empty session_id.');
        }

        logger.info('Login successful', {
          userId: effectiveUid,
          sessionId: sessionId ? `${sessionId.substring(0, 5)}...` : 'none'
        });

        // Set session info with password
        this._sessionInfo = {
          id: effectiveUid,
          uid: effectiveUid,
          username: result?.username || login,  // Fallback to login if username not provided
          name: result?.name || login,          // Fallback to login if name not provided
          company_id: result?.company_id || 1,  // Default company ID
          partner_id: result?.partner_id || false,
          session_id: sessionId,
          password: password, // Store the password in the session
          is_admin: result?.is_admin || false,
          is_system: result?.is_system || false,
          user_context: result?.user_context || {},
          context: result?.user_context || {},
          db: dbName,
          expires: Date.now() + SESSION_TIMEOUT_MS,
        };

        console.log('🔑 Stored session info:', {
          id: this._sessionInfo.uid,
          username: this._sessionInfo?.username,
          hasPassword: false,
          sessionId: sessionId ? `${sessionId.substring(0, 5)}...` : 'none',
          expires: new Date(this._sessionInfo.expires as number).toISOString()
        });

        this._isAuthenticated = true;

        try {
          // Save session to storage
          await this.saveSessionToStorage();
          
          // Log successful login
          logger.info('Login successful', { 
            username: login,
            userId: effectiveUid,
            sessionId: sessionId ? `${sessionId.substring(0, 5)}...` : 'none'
          });
        } catch (error) {
          logger.error('Error saving session to storage', { error });
          // Don't reject the login promise for storage errors
          // The user is still logged in, just the session might not persist across page refreshes
        }

        // Ensure session info is not null before resolving
        if (!this._sessionInfo) {
          const error = new Error('Failed to create session info');
          logger.error('Session info is null after creation', { error });
          reject(error);
          return;
        }
        
        // Resolve the authentication promise
        resolve(this._sessionInfo);
      } catch (error) {
        logger.error('Login error', { error });
        await this.clearSession();
        reject(error);
      } finally {
        this._authenticationPromise = null;
      }
    });

    try {
      await this._authenticationPromise;
      if (!this._currentUser) {
        throw new Error('Authentication completed but user data is missing');
      }
      return this.mapCurrentUserToOdooUser(this._currentUser);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ensures the user is authenticated
   * @throws {Error} If the user is not authenticated
   */
  private async ensureAuthenticated(): Promise<void> {
    // If already authenticated and session is valid, return
    if (this._isAuthenticated && this._currentUser && this._sessionInfo) {
      // Check if session is about to expire (within 5 minutes)
      if (this._sessionInfo.expires && (Number(this._sessionInfo.expires) - Date.now() < 5 * 60 * 1000)) {
        try {
          await this.refreshSession();
        } catch (error) {
          logger.warn('Failed to refresh session, requiring re-authentication', { error });
          await this.clearSession();
          throw new Error('Session expired. Please log in again.');
        }
      }
      return;
    }
    
    // Try to restore session from storage if not authenticated
    if (typeof window !== 'undefined') {
      const restored = await this.tryRestoreSessionFromStorage();
      if (restored) {
        return;
      }
    }
    
    throw new Error('Authentication required');
  }

  /**
   * Handles errors from Odoo API calls
   * @param error The error object
   * @param context Additional context for the error
   * @returns A new Error with a user-friendly message
   */
  private handleError(error: unknown, context: string = ''): Error {
    let errorMessage = 'An unknown error occurred';
    
    // Handle OdooError format
    if (error && typeof error === 'object' && 'error' in error) {
      const odooError = (error as { error: { code: number; message: string; data?: { message?: string } } }).error;
      errorMessage = odooError.data?.message || odooError.message || 'An unknown error occurred';
    }

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    const errorWithContext = context ? `${context}: ${errorMessage}` : errorMessage;

    try {
      if (this._onError) {
        this._onError(error);
      }

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data as OdooError | { error: OdooError } | undefined;

        // Handle both direct OdooError and wrapped { error: OdooError } responses
        const odooError = errorData && 'error' in errorData ? errorData.error : errorData as OdooError;
        
        if (odooError) {
          errorMessage = odooError.data?.message || odooError.message || 'Unknown Odoo error';
        }

        switch (status) {
          case 401:
            this.clearSession();
            this._onUnauthorized?.();
            return new Error(errorMessage || 'Unauthorized');

          case 403:
            this._onForbidden?.();
            return new Error(errorMessage || 'Forbidden');

          case 404:
            this._onNotFound?.();
            return new Error(errorMessage || 'Not found');

          case 400:
            this._onBadRequest?.(error);
            return new Error(errorMessage || 'Bad request');

          case 500:
            this._onServerError?.(error);
            return new Error(errorMessage || 'Server error');

          default:
            this._onNetworkError?.(error);
            return new Error(`Network error: ${errorMessage}`);
        }
      }

      return new Error(errorWithContext);
    } catch (innerError) {
      // Ensure we always return an Error object
      if (innerError instanceof Error) {
        return innerError;
      }
      return new Error(String(innerError));
    }
  }

  /**
   * Authenticates as admin user
   * @private
   */
  private async authenticateAsAdmin(): Promise<OdooSessionInfo> {
    try {
      const db = this._config.db;
      if (!db) {
        throw new Error('Database name is required for admin authentication');
      }

      // Use admin credentials from environment variables
      const adminUsername = process.env.NEXT_PUBLIC_ODOO_ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.NEXT_PUBLIC_ODOO_ADMIN_PASSWORD || 'admin';

      logger.debug('Authenticating as admin', { db, username: adminUsername });

      // Set up headers for the authentication request
      const authHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...this._config.headers,
      };

      // Prepare authentication payload in the format Odoo expects
      const authPayload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: db,
          login: adminUsername,
          password: adminPassword,
        },
      };

      // Log the authentication attempt (without password)
      logger.debug('Attempting admin authentication', {
        db,
        username: adminUsername,
        hasPassword: !!adminPassword,
        timestamp: new Date().toISOString()
      });

      // Make the authentication request with the prepared headers
      const response = await this._client.post('/web/session/authenticate', authPayload, {
        headers: authHeaders,
        withCredentials: true,
      });

      // Log the raw response for debugging
      const responseLog: Record<string, unknown> = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        timestamp: new Date().toISOString()
      };
      
      // Ensure we don't log sensitive data
      const responseData = response.data as Record<string, unknown>;
      const responseResult = (responseData?.result as Record<string, unknown>) || {};
      if ('password' in responseResult) {
        responseResult.password = '********';
      }
      
      logger.debug('Raw authentication response', responseLog);

      if (response.data?.error) {
        const errorData = response.data.error as { code: number; message: string; data?: { message?: string } };
        const errorMsg = errorData.data?.message || errorData.message || 'Admin authentication failed';
        const errorDetails = {
          message: errorMsg,
          code: errorData.code,
          data: errorData.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          request: {
            url: '/web/session/authenticate',
            method: 'POST',
            db: db,
            username: adminUsername,
            hasPassword: !!adminPassword
          }
        };

        logger.error('Admin authentication failed', errorDetails);
        
        // Provide a more helpful error message
        let errorMessage = `Authentication failed: ${errorMsg}`;
        if (errorMsg.includes('wrong login')) {
          errorMessage = 'Invalid username or password';
        } else if (errorMsg.includes('Access Denied')) {
          errorMessage = 'Access denied. Please check your permissions.';
        } else if (errorMsg.includes('database')) {
          errorMessage = `Database error: ${errorMsg}`;
        }
        
        const err = new Error(errorMessage) as Error & { details?: unknown };
        err.details = errorDetails;
        throw err;
      }

      const result = response.data?.result;
      const effectiveUid = result?.uid || result?.id;

      if (!effectiveUid) {
        const err = new Error('Invalid response format from Odoo server: Missing user ID in response') as Error & { response?: unknown; status?: number };
        err.response = response.data;
        err.status = response.status;

        logger.error('Authentication failed: Invalid response format', {
          error: err.message,
          status: response.status,
          responseData: response.data,
          timestamp: new Date().toISOString(),
        });

        throw err;
      }

      // Extract session ID from response headers or cookies
      let sessionId = '';
      if (response.headers['set-cookie']) {
        const sessionMatch = response.headers['set-cookie']
          .find(cookie => cookie.startsWith('session_id='))
          ?.match(/session_id=([^;]+)/);
        if (sessionMatch) {
          sessionId = sessionMatch[1];
        }
      }

      // Create and store admin session info
      const sessionInfo: OdooSessionInfo = {
        id: effectiveUid,
        uid: effectiveUid, // Add the required uid field
        username: result.name || adminUsername,
        name: result.name || adminUsername,
        session_id: sessionId,
        password: adminPassword, // Store password for future API calls
        expires: Date.now() + SESSION_TIMEOUT_MS,
        context: result.user_context || {},
        is_admin: true,
        is_system: result.is_system || false,
        company_id: result.company_id || 1,
        partner_id: result.partner_id || null,
        user_id: effectiveUid,
        tz: result.tz,
        lang: result.user_context?.lang || 'en_US',
      };

      // Debug logging for the created session info
      console.log('🔑 Created admin session info:', {
        id: sessionInfo.id,
        username: sessionInfo.username,
        hasPassword: !!sessionInfo.password,
        passwordLength: sessionInfo.password ? String(sessionInfo.password).length : 0,
        hasSessionId: !!sessionInfo.session_id,
        sessionIdLength: sessionInfo.session_id ? String(sessionInfo.session_id).length : 0,
        expires: sessionInfo.expires ? new Date(Number(sessionInfo.expires)).toISOString() : 'never',
        keys: Object.keys(sessionInfo)
      });

      this._adminSessionInfo = sessionInfo;
      logger.info(`Successfully authenticated as admin: ${sessionInfo.username} (id: ${sessionInfo.id})`);
      
      // Update the client with the new session ID and headers
      if (sessionId) {
        // Create a new headers object to avoid modifying the defaults directly
        const defaultHeaders = {
          ...this._client.defaults.headers.common,
          'X-Openerp-Session-Id': sessionId,
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': sessionId,
        };
        
        this._client.defaults.headers.common = defaultHeaders;
        this._client.defaults.withCredentials = true;
        
        logger.debug('Updated client with new session ID and headers', {
          hasSessionId: !!sessionId,
          sessionIdLength: sessionId ? sessionId.length : 0,
          headers: Object.keys(defaultHeaders)
        });
      }
      
      return sessionInfo;
    } catch (error) {
      logger.error('Admin authentication failed', { error });
      throw this.handleError(error, 'Admin authentication failed');
    }
  }

  /**
   * Refreshes the current session
   * @private
   */
  private async refreshSession(): Promise<void> {
    if (!this._sessionInfo?.session_id) {
      throw new Error('No active session to refresh');
    }
    
    if (this._isRefreshing) {
      // If already refreshing, wait for the current refresh to complete
      return new Promise((resolve) => {
        const checkRefresh = () => {
          if (!this._isRefreshing) {
            resolve();
          } else {
            setTimeout(checkRefresh, 100);
          }
        };
        checkRefresh();
      });
    }
    
    this._isRefreshing = true;
    
    try {
      logger.debug('Refreshing session');
      const response = await this._client.post('/web/session/refresh', {});
      
      if (response.data?.result?.id) {
        if (this._sessionInfo) {
          const expires = Date.now() + SESSION_TIMEOUT_MS;
          this._sessionInfo.expires = expires;
          if (this._currentUser) {
            this._currentUser.expires_at = Number(new Date(expires).toISOString());
          }
        }
        await this.saveSessionToStorage();
        logger.debug('Session refreshed successfully');
      } else {
        throw new Error('Failed to refresh session');
      }
    } catch (error) {
      logger.error('Error refreshing session', { error });
      await this.clearSession();
      throw error;
    } finally {
      this._isRefreshing = false;
    }
  }

  private mapCurrentUserToOdooUser(user: CurrentUser): OdooUser {
    return {
      id: user.id,
      name: user.displayName || user.username,
      email: user.username,
      partner_id: Array.isArray(user.partnerId) ? user.partnerId[0] : user.partnerId || null,
      is_admin: user.isAdmin,
      is_system: user.is_system,
      session_id: this._sessionInfo?.session_id || '',
      context: user.context || {},
      groups_id: user.groups_id || []
    };
  }

  /**
   * Tries to restore a session from cookies if available
   */
  private async tryRestoreSessionFromStorage(): Promise<boolean> {
    if (typeof document === 'undefined') return false;

    try {
      // Get the session cookie
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('odoo_session='))
        ?.split('=')[1];

      if (!cookieValue) {
        if (this._config.debug) {
          console.log('No odoo_session cookie found');
        }
        return false;
      }

      // Decode and parse the cookie value
      const decodedValue = decodeURIComponent(cookieValue);
      const parsedData = JSON.parse(decodedValue);
      const { sessionInfo, currentUser, timestamp } = parsedData;

      // Check if session is expired (1 day max age)
      const maxAge = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      const isExpired = timestamp && (Date.now() - timestamp) > maxAge;

      if (isExpired) {
        if (this._config.debug) {
          console.log('odoo_session cookie has expired');
        }
        await this.clearSession();
        return false;
      }

      // Validate required session data
      if (!sessionInfo?.id || !currentUser?.id) {
        if (this._config.debug) {
          console.log('Invalid odoo_session data in cookie');
        }
        await this.clearSession();
        return false;
      }

      // Restore the session
      this._sessionInfo = sessionInfo;
      this._currentUser = currentUser;
      this._isAuthenticated = true;

      if (this._config.debug) {
        console.log('Session restored from odoo_session cookie for user:', currentUser.username);
      }

      // Notify listeners
      if (this._onLogin) {
        this._onLogin(this.mapCurrentUserToOdooUser(currentUser));
      }

      return true;
    } catch (error) {
      console.error('Error restoring session from odoo_session cookie:', error);
      // Clear the invalid cookie
      if (typeof window !== 'undefined') {
        const domain = window.location.hostname;
        document.cookie = `odoo_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=${domain};`;
      }
      return false;
    }
  }
    
  public get sessionInfo(): OdooSessionInfo | null {
    return this._sessionInfo;
  }

  public get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  public get currentUser(): OdooUser | null {
    if (this._currentUser) {
      return this.mapCurrentUserToOdooUser(this._currentUser);
    }
    return null;
  }

  public get isUsingAdminCredentials(): boolean {
    return this._currentUser?.isAdmin || false;
  }

  public get dbName(): string {
    return this._config.db;
  }

  public getSessionInfo(): OdooSessionInfo | null {
    return this._sessionInfo;
  }

  /**
   * Gets the current authenticated user
   * @returns The current user or null if not authenticated
   */
  public getCurrentUser(): OdooUser | null {
    return this.currentUser;
  }

  /**
   * Creates a new dog profile as a child contact of the current user.
   * @param dogData Dog profile fields (name, breed, age, etc.)
   * @returns The new dog partner ID
   */
  public async createDogProfile(dogData: Partial<Dog>): Promise<number> {
    if (!this._currentUser?.partnerId) {
      throw new Error('No current user or partner ID available');
    }

    // Ensure the dog is a child of the current user's partner
    const partnerId = Array.isArray(this._currentUser.partnerId)
      ? this._currentUser.partnerId[0]
      : this._currentUser.partnerId;

    // Add parent_id and category_id for "Dog" category if needed
    const dogCategory = await this.call<Array<{id: number; name: string}>>(
      'res.partner.category',
      'search_read',
      [[['name', '=', 'Dog']], ['id', 'name']],
      {},
      { useAdminSession: true }
    );
    const dogCategoryId = dogCategory && dogCategory[0] ? dogCategory[0].id : false;

    const newDogData: Record<string, unknown> = {
      ...dogData,
      parent_id: partnerId,
      type: 'contact',
      category_id: dogCategoryId ? [[6, 0, [dogCategoryId]]] : [],
    };

    // Create the dog partner record
    const dogId = await this.create('res.partner', newDogData);
    return dogId;
  }
  
  /**
   * Fetches dogs associated with the current user
   * @returns Promise with array of dog records
   */
  /**
   * Fetches dog records which are child contacts of the current user
   * @returns Promise with array of dog records (as contacts)
   */
  public async getDogs(): Promise<Dog[]> {
    try {
      if (!this._currentUser?.partnerId) {
        console.log('No current user or partner ID available');
        return [];
      }

      // Use admin session but filter by the current user's partner ID
      const partner = await this.call<Array<{child_ids?: number[]; category_id?: number[]; name: string}>>(
        'res.partner', 
        'read', 
        [
          [this._currentUser.partnerId],
          ['child_ids', 'category_id', 'name']
        ],
        {
          // Pass the user's context to maintain their access rights
          context: this._currentUser.context || {}
        },
        { useAdminSession: true } // Use admin credentials for the call
      );

      if (!partner || !partner[0] || !partner[0].child_ids || partner[0].child_ids.length === 0) {
        console.log('No dog records found for user');
        return [];
      }

      // Now get the dog category (using admin session but with user context)
      const dogCategory = await this.call<Array<{id: number; name: string}>>(
        'res.partner.category', 
        'search_read', 
        [
          [['name', '=', 'Dog']],
          ['id', 'name']
        ],
        {
          context: this._currentUser.context || {}
        },
        { useAdminSession: true } // Use admin credentials for the call
      );

      const dogCategoryId = dogCategory && dogCategory[0] ? dogCategory[0].id : false;
      
      const domain: OdooDomain = [
        ['id', 'in', partner[0].child_ids],
        ...(dogCategoryId ? [ ['category_id', 'in', [dogCategoryId]] as OdooDomainItem ] : [])
      ];

      const fields = [
        'id', 'name', 'breed', 'age', 'gender', 'level', 'progress', 'image_1920',
        'sterilized', 'dog_source', 'time_with_dog', 'medications', 'current_deworming',
        'tick_flea_preventative', 'vet_clinic', 'vet_name', 'vet_phone', 'vet_address', 'medical_issues',
        'home_alone_location', 'sleep_location', 'has_crate', 'likes_crate', 'crate_location', 'chews_crate',
        'hours_alone', 'food_brand', 'feeding_schedule', 'food_left_out', 'allergies', 'toy_types', 'toy_play_time',
        'toy_storage', 'walk_frequency', 'walk_person', 'walk_duration', 'other_exercise', 'walk_equipment',
        'off_leash', 'forest_visits', 'pulling', 'pulling_prevention',
        'previous_training', 'growled', 'growl_details', 'bitten', 'bite_details', 'bite_injury', 'fearful',
        'fear_details', 'new_people_response', 'grooming_response', 'ignore_reaction', 'previous_services', 'tools_used',
        'training_goals', 'ideal_dog_behavior', 'behavior_checklist', 'behavior_details', 'undesirable_behavior',
        'fear_description', 'notes', 'likes_about_dog', 'dislikes_about_dog', 'why_training', 'owner_id',
        'category_id', 'parent_id', 'type'
      ];

      console.log('Fetching dogs with domain:', JSON.stringify(domain, null, 2));
      
      const dogs = await this.call<Dog[]>(
        'res.partner', 
        'search_read', 
        [domain, fields],
        {
          // Pass the user's context to maintain their access rights
          context: this._currentUser.context || {}
        },
        { useAdminSession: true } // Use admin credentials for the call
      );
      console.log(`Found ${dogs?.length || 0} dogs`);
      
      return dogs || [];
    } catch (error) {
      console.error('Error fetching dogs:', error);
      // Fallback to empty array to prevent UI breakage
      return [];
    }
  }

  /**
   * Fetches training plans for the current user
   * @returns Promise with array of training plan records
   */
  /**
   * Alias for call() method for backward compatibility
   */
  public async callOdooMethod<T>(
    model: string,
    method: string,
    args: unknown[] = [],
    kwargs: Record<string, unknown> = {},
    options: { skipAuthCheck?: boolean; useAdminSession?: boolean } = {}
  ): Promise<T> {
    return this.call<T>(model, method, args, kwargs, options);
  }
  
  /**
   * Creates a new record in the specified model
   * @param model The model to create a record in
   * @param data The data for the new record
   * @returns The ID of the created record
   */
  public async create(model: string, data: Record<string, unknown>): Promise<number> {
    try {
      logger.debug(`Creating ${model} record`, { data });
      
      // Ensure we're authenticated
      await this.ensureAuthenticated();
      
      // Call the create method on the model
      const result = await this.call<number | Record<string, unknown>>(
        model,
        'create',
        [data],
        { context: this._sessionInfo?.context || {} }
      );

      if (typeof result !== 'number' || !result) {
        logger.error(`Error creating ${model} record: Invalid result format`, { result });
        throw new Error(`Failed to create ${model} record: Odoo returned an invalid ID.`);
      }
      
      logger.info(`Successfully created ${model} record`, { id: result });
      return result;
    } catch (error) {
      logger.error(`Error creating ${model} record`, { error });
      throw this.handleError(error, `Failed to create ${model} record`);
    }
  }

  /**
   * Makes a generic RPC call to the Odoo server
   * @param model The model to call the method on
   * @param method The method to call
   * @param args Positional arguments for the method
   * @param kwargs Keyword arguments for the method
   * @param options Additional options
   * @returns Promise with the method result
   */
  public async call<T = unknown>(
    model: string,
    method: string,
    args: unknown[] = [],
    kwargs: Record<string, unknown> = {},
    options: { skipAuthCheck?: boolean; useAdminSession?: boolean } = {}
  ): Promise<T> {
    try {
      // These will be set based on the session info
      let currentUid: number = 0;
      let currentPassword: string = '';
      let currentSessionId: string | undefined;

      // Handle authentication and get credentials
      if (!options.skipAuthCheck) {
        if (options.useAdminSession) {
          // Ensure admin session exists and is valid
          if (!this._adminSessionInfo?.id) {
            await this.authenticateAsAdmin();
          }
          currentUid = typeof this._adminSessionInfo?.uid === 'number' ? this._adminSessionInfo.uid : 0;
          currentPassword = typeof this._adminSessionInfo?.password === 'string' 
            ? this._adminSessionInfo.password 
            : '';
          currentSessionId = this._adminSessionInfo?.session_id;
        } else {
          // Ensure user session is valid
          await this.ensureAuthenticated();
          currentUid = typeof this._sessionInfo?.uid === 'number' ? this._sessionInfo.uid : 0;
          currentPassword = typeof this._sessionInfo?.password === 'string' 
            ? this._sessionInfo.password 
            : '';
          currentSessionId = this._sessionInfo?.session_id;
        }
      }

      // Get database name from config
      const db = this._config.db;
      if (!db) {
        throw new Error('Database name is required but not configured');
      }

      // Generate a random message ID for the JSON-RPC call
      const messageId = Math.floor(Math.random() * 1000000000);
      
      // Prepare the JSON-RPC payload with the determined credentials
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db,
          service: 'object',
          method: 'execute_kw',
          args: [
            db,                    // 1. Database name
            currentUid,           // 2. User ID (0 for public, actual ID for users)
            currentPassword,      // 3. User password or session token
            model,                // 4. Model name (e.g., 'res.partner')
            method,               // 5. Method name (e.g., 'search_read', 'create')
            args,                 // 6. Positional arguments for the method
            kwargs                // 7. Keyword arguments for the method
          ]
        },
        id: messageId
      };

      // Set up headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...this._config.headers,
      };

      // Add session ID to headers if available
      if (currentSessionId) {
        headers['X-Openerp-Session-Id'] = currentSessionId;
        headers['X-CSRFToken'] = currentSessionId;
        headers['Cookie'] = `session_id=${currentSessionId}`;
      }

      // Log the request if in debug mode
      if (this._config.debug) {
        const safePayload = {
          ...payload,
          params: {
            ...payload.params,
            args: payload.params.args.map((arg: unknown, i: number) => 
              i === 2 ? (arg ? '********' : '') : arg // Mask password in logs
            )
          }
        };
        logger.debug(`Calling ${model}.${method}`, { payload: safePayload });
      }

      // Make the API call
      const response = await this._client.post('/jsonrpc', payload, { headers });

      // Check for JSON-RPC error in response
      if (response.data?.error) {
        const error = response.data.error;
        logger.error(`API error in ${model}.${method}`, {
          code: error.code,
          message: error.message,
          data: error.data
        });
        throw this.handleError(error);
      }

      // Return the result
      return response.data.result;
    } catch (error) {
      logger.error(`Error in ${model}.${method}`, { error });
      throw this.handleError(error, `Error in Odoo API call ${model}.${method}`);
    }
  }

  /**
   * Creates a new training plan (project task) for a dog
   * @param plan Training plan data
   * @returns Promise with new training plan ID
   */
  public async createTrainingPlan(plan: {
    name: string;
    dogId: number;
    startDate: string;
    endDate: string;
    description: string;
    tasks: Array<{ name: string; description: string }>;
  }): Promise<number> {
    // You may need to adjust model/fields to match your Odoo backend
    // Here, we create a project.task and link it to the dog (partner)
    const payload: Record<string, unknown> = {
      name: plan.name,
      partner_id: plan.dogId,
      create_date: plan.startDate,
      date_end: plan.endDate,
      description: plan.description,
      // Optionally serialize tasks as JSON or create subtasks separately
      x_tasks_json: JSON.stringify(plan.tasks),
    };
    // You may want to link to a specific project (e.g., training project)
    // If you have a training project, fetch its ID and add project_id
    // For now, this is omitted for simplicity
    return this.create('project.task', payload);
  }

  /**
   * Fetches training plans (project tasks) for the current user
   * @returns Promise with array of project task records
   */
  public async getTrainingPlans(): Promise<ProjectTask[]> {
    try {
      if (!this._currentUser) {
        console.log('No current user available');
        return [];
      }

      // First, get the project for training plans (if any)
      const trainingProject = await this.call<Array<{id: number; name: string}>>(
        'project.project', 
        'search_read', 
        [
          [['name', 'ilike', 'training']],
          ['id', 'name']
        ],
        {
          context: this._currentUser.context || {}
        },
        { useAdminSession: true } // Use admin credentials for the call
      );

      const projectId = trainingProject && trainingProject[0] ? trainingProject[0].id : false;
      
      // Build domain to find tasks
      // If user is authenticated, filter by their partner/user ID, otherwise get all tasks
      const domain: (string | (string | number | boolean | null)[])[] = [];
      
      if (this._isAuthenticated && this._currentUser) {
        const partnerId = this._currentUser.partnerId;
        domain.push(
          '|',
          ['partner_id', '=', partnerId ? (Array.isArray(partnerId) ? partnerId[0] : partnerId) : false],
          ['message_follower_ids.partner_id', '=', partnerId ? (Array.isArray(partnerId) ? partnerId[0] : partnerId) : false]
        );
      }
      
      if (projectId) {
        if (domain.length > 0) {
          domain.push('&');
        }
        domain.push(['project_id', '=', projectId]);
      }

      // Only include business-relevant fields for training plans
      const fields = [
        'id',
        'name',
        'description',
        'active',
        'date_assign',
        'date_deadline',
        'date_end',
        'project_id',
        'partner_id',
        'allocated_hours',
        'company_id',
        'create_date',
        'create_uid',
        'display_name',
        'x_trainer_id'
      ];

      console.log('Fetching training plans with domain:', JSON.stringify(domain, null, 2));
      
      const tasks = await this.call<ProjectTask[]>(
        'project.task', 
        'search_read', 
        [domain, fields],
        {
          context: this._currentUser.context || {}
        },
        { useAdminSession: true } // Use admin credentials for the call
      );
      console.log(`Found ${tasks?.length || 0} training plans`);
      
      return tasks || [];
    } catch (error) {
      console.error('Error fetching training plans:', error);
      return [];
    }
  }

  /**
   * Fetches calendar events for the current user
   * @param startDate Optional start date filter (ISO string)
   * @param endDate Optional end date filter (ISO string)
   * @returns Promise with array of calendar event records
   */
  public async getCalendarEvents(startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
    try {
      if (!this._currentUser) {
        console.log('No current user available');
        return [];
      }

      const domain: (string | OdooDomainItem)[] = [];
      
      // Filter by partner if available
      if (this._currentUser.partnerId) {
        const partnerId = Array.isArray(this._currentUser.partnerId) 
          ? this._currentUser.partnerId[0] 
          : this._currentUser.partnerId;
          
        if (typeof partnerId === 'number') {
          domain.push('|', ['partner_ids', 'in', [partnerId]] as [string, string, number[]]);
        }
      }

      // Add date range filter if provided
      if (startDate) {
        domain.push('&', ['stop', '>=', startDate]);
      }
      if (endDate) {
        domain.push('&', ['start', '<=', endDate]);
      }

      const fields = [
        'id', 'name', 'description', 'start', 'stop', 'allday', 'duration',
        'location', 'privacy', 'show_as', 'state', 'user_id', 'partner_ids',
        'create_date', 'write_date', 'display_name', 'active', 'categ_ids',
        'display_start', 'display_stop', 'display_time', 'duration',
        'interval', 'recurrency', 'rrule', 'rrule_type', 'start_date',
        'stop_date', 'month_by', 'day', 'week_list', 'end_type', 'count',
        'mo', 'tu', 'we', 'th', 'fr', 'sa', 'su', 'byday', 'until', 'count',
        'interval', 'rrule_type', 'final_date', 'recurrent_id', 'recurrent_id_date',
        'recurrent_id_datetime', 'recurrent_id_datetime_utc', 'recurrent_id_datetime_tz',
        'recurrent_id_date_tz', 'recurrent_id_datetime_utc', 'recurrent_id_datetime_tz',
        'recurrent_id_date_tz', 'recurrent_id_datetime_utc', 'recurrent_id_datetime_tz',
        'recurrent_id_date_tz', 'recurrent_id_datetime_utc', 'recurrent_id_datetime_tz'
      ];

      console.log('Fetching calendar events with domain:', JSON.stringify(domain, null, 2));
      
      const events = await this.call<CalendarEvent[]>(
        'calendar.event', 
        'search_read', 
        [domain, fields],
        {
          context: this._currentUser.context || {}
        },
        { useAdminSession: true } // Use admin credentials for the call
      );
      console.log(`Found ${events?.length || 0} calendar events`);
      
      return events || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }
}