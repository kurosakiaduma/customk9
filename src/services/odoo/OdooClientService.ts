import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  OdooSessionInfo,
  OdooUser,
  OdooError,
  OdooDomainItem,
  Dog,
  ProjectTask,
  CalendarEvent
} from './odoo.types';

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

type OdooDomain = Array<string | number | boolean | OdooDomainItem>;

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
  uid: number;
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
  private _client!: AxiosInstance;
  private _sessionInfo: OdooSessionInfo | null = null;
  private _adminSessionInfo: OdooSessionInfo | null = null;
  private _currentUser: CurrentUser | null = null;
  private _isAuthenticated = false;
  private _authenticationPromise: Promise<OdooSessionInfo> | null = null;
  private _config: OdooClientConfig;
  private _requestQueue: Array<() => Promise<unknown>> = [];
  private _isRefreshing = false;

  private _onSessionExpired: (() => void) | null = null;
  private _onError: ((error: unknown) => void) | null = null;
  private _onLogin: ((user: OdooUser) => void) | null = null;
  private _onLogout: (() => void) | null = null;
  private _onUnauthorized: (() => void) | null = null;
  private _onForbidden: (() => void) | null = null;
  private _onNotFound: (() => void) | null = null;
  private _onBadRequest: ((error: unknown) => void) | null = null;
  private _onServerError: ((error: unknown) => void) | null = null;
  private _onNetworkError: ((error: unknown) => void) | null = null;
  private _onRequest: ((config: AxiosRequestConfig) => void) | null = null;
  private _onResponse: ((response: AxiosResponse) => void) | null = null;
  private _onResponseError: ((error: AxiosError) => void) | null = null;
  private _onRequestError: ((error: unknown) => void) | null = null;

  constructor(config: OdooClientConfig) {
    // Ensure we have a database name
    const db = config.db || (config as any).database;
    
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

    if (typeof window !== 'undefined') {
      this.tryRestoreSessionFromStorage();
    }
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
        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            db: dbName,
            login: login,
            password: password,
            context: {}
          }
        };

        const response = await this._client.post(apiPath, payload);
        const result = response.data?.result;

        // Extract session ID from response data or cookies
        let sessionId = result?.session_id || '';
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

        // Debug log the full response for troubleshooting
        console.log('🔑 Login response:', {
          status: response.status,
          statusText: response.statusText,
          hasSessionCookie: !!sessionId,
          responseData: response.data,
          cookies: response.headers?.['set-cookie'] || []
        });

        // Check if login was successful by looking for a valid UID
        const effectiveUid = result?.uid;
        if (!effectiveUid) {
          const errorMessage = result?.error?.data?.message || 'Authentication failed: No valid UID received';
          logger.error('Login failed - missing UID', { error: errorMessage });
          throw new Error(errorMessage);
        }
        if (!sessionId) {
          logger.warn('Login succeeded but session_id is missing. Proceeding with empty session_id.');
        }

        logger.info('Login successful', {
          userId: effectiveUid,
          sessionId: sessionId ? `${sessionId.substring(0, 5)}...` : 'none'
        });

        // Set session info with password
        this._sessionInfo = {
          uid: effectiveUid,
          username: result?.username || login,  // Fallback to login if username not provided
          name: result?.name || login,          // Fallback to login if name not provided
          company_id: result?.company_id || 1,  // Default company ID
          partner_id: result?.partner_id || false,
          session_id: sessionId,
          password: password, // Store the password in the session
          is_admin: result?.is_admin || false,
          user_context: result?.user_context || {},
          db: dbName,
          expires: Date.now() + SESSION_TIMEOUT_MS,
        };

        console.log('🔑 Stored session info:', {
          uid: this._sessionInfo.uid,
          username: this._sessionInfo.username,
          hasPassword: !!this._sessionInfo.password,
          passwordLength: this._sessionInfo.password?.length || 0,
          sessionId: sessionId ? `${sessionId.substring(0, 5)}...` : 'none',
          expires: new Date(this._sessionInfo.expires).toISOString()
        });

        // Set current user
        this._currentUser = {
          uid: result.uid,
          username: result.username,
          displayName: result.name,
          partnerId: result.partner_id,
          isAdmin: result.is_admin || false,
          is_system: result.is_system || false,
          session_id: this._sessionInfo.session_id,
          context: result.user_context || {},
          groups_id: result.groups_id || [],
          expires_at: this._sessionInfo.expires,
        };

        this._isAuthenticated = true;

        // Save session to storage
        await this.saveSessionToStorage();

        // Notify listeners
        this._onLogin?.(this.mapCurrentUserToOdooUser(this._currentUser));

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

  private mapCurrentUserToOdooUser(user: CurrentUser): OdooUser {
    return {
      id: user.uid,
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

  public async create(model: string, data: Record<string, unknown>): Promise<number> {
    try {
      console.log(`🆕 OdooClientService: Creating ${model} record with data:`, data);
      
      const result = await this.call<number>(
        model,
        'create',
        [data],
        { context: this._sessionInfo?.context || {} }
      );
      
      console.log(`✅ OdooClientService: Created ${model} record with ID:`, result);
      return result;
    } catch (error) {
      console.error(`❌ OdooClientService: Failed to create ${model} record:`, error);
      throw error;
    }
  }

  /**
   * Makes a JSON-RPC call to the Odoo server
   * @param model The Odoo model to call
   * @param method The method to call on the model
   * @param args Positional arguments for the method
   * @param kwargs Keyword arguments for the method
   * @param options Additional options
   * @returns Promise that resolves with the method result
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
          if (!this._adminSessionInfo?.uid) {
            await this.authenticateAsAdmin();
          }
          currentUid = this._adminSessionInfo?.uid || 0;
          currentPassword = this._adminSessionInfo?.password || '';
          currentSessionId = this._adminSessionInfo?.session_id;
        } else {
          // Ensure user session is valid
          await this.ensureAuthenticated();
          currentUid = this._sessionInfo?.uid || 0;
          currentPassword = this._sessionInfo?.password || '';
          currentSessionId = this._sessionInfo?.session_id;
        }
      } else {
        // For unauthenticated calls
        currentUid = 0;
        currentPassword = '';
        currentSessionId = undefined;
      }

      // Get database name from config
      const db = this._config.db;
      if (!db) {
        const errorMsg = 'Database name is required but not configured. Please check your Odoo client configuration.';
        logger.error(errorMsg, { config: this._config });
        throw new Error(errorMsg);
      }

      // Apply user-specific filters for search and search_read methods
      let finalArgs = args;
      if (['search', 'search_read'].includes(method)) {
        const userFilter = await this.getUserDataFilter(model);
        if (userFilter.length > 0) {
          const existingDomain = Array.isArray(args[0]) ? args[0] : [];
          finalArgs = [
            existingDomain.length > 0 ? ['&', ...existingDomain, ...userFilter] : userFilter,
            ...args.slice(1)
          ];
        }
      }

      // Generate a random message ID for the JSON-RPC call
      const messageId = Math.floor(Math.random() * 1000000000);
      
      // Prepare the JSON-RPC payload with the determined credentials
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: db,
          service: 'object',
          method: 'execute_kw',
          args: [
            db,                    // 1. Database name
            currentUid,           // 2. User ID (0 for public, actual ID for users)
            currentPassword || '', // 3. User password or session token (ensure it's not undefined)
            model,                // 4. Model name (e.g., 'res.partner')
            method,               // 5. Method name (e.g., 'search_read', 'create')
            finalArgs,            // 6. Positional arguments for the method
            kwargs                // 7. Keyword arguments for the method
          ]
        },
        id: messageId
      };

      // Log the actual payload with password for debugging
      logger.debug('JSON-RPC Payload (with password):', {
        ...payload,
        params: {
          ...payload.params,
          args: payload.params.args.map((arg: unknown, i: number) => {
            // Log password in plain text for debugging
            if (i === 2) {
              console.log('🔑 Password in payload:', arg);
              return arg;
            }
            return arg;
          })
        }
      });

      // Also log the safe version (without password)
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
        logger.debug('JSON-RPC Payload (safe):', safePayload);
      }

      // Set up headers to match the authentication request
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...this._config.headers,
      };

      // Add session ID to headers and cookies if available
      if (currentSessionId) {
        headers['X-Openerp-Session-Id'] = currentSessionId;
        headers['X-CSRFToken'] = currentSessionId; // Some Odoo versions require CSRF token
        // Only set Cookie header if sessionId is non-empty
        if (currentSessionId !== '') {
          headers['Cookie'] = `session_id=${currentSessionId};`;
        }
      }

      // Log the request if in debug mode
      if (this._config.debug) {
        console.log(`📤 [${messageId}] Calling Odoo ${model}.${method}`, {
          url: '/jsonrpc',
          db,
          model,
          method,
          args: finalArgs,
          kwargs,
          headers
        });
      }

      // Make the API call to the JSON-RPC endpoint
      const requestConfig: AxiosRequestConfig = {
        headers,
        withCredentials: true,
      };

      // Get the appropriate session info based on whether we're using admin session
      const sessionInfo = options.useAdminSession ? this._adminSessionInfo : this._sessionInfo;
      
      // Debug logging for password/session info
      console.log('🔑 Current session info:', {
        useAdminSession: options.useAdminSession,
        hasSessionInfo: !!sessionInfo,
        uid: sessionInfo?.uid || 0,
        hasPassword: !!sessionInfo?.password,
        hasSessionId: !!sessionInfo?.session_id,
        passwordLength: sessionInfo?.password ? String(sessionInfo.password).length : 0,
        sessionIdLength: sessionInfo?.session_id?.length || 0,
        sessionInfoKeys: sessionInfo ? Object.keys(sessionInfo) : []
      });
      
      // Check if we have either password or session ID
      if ((!sessionInfo?.password || sessionInfo.password === '') && 
          (!sessionInfo?.session_id || sessionInfo.session_id === '')) {
        console.warn('⚠️ No password or session ID available for the API call');
        
        if (options.useAdminSession) {
          console.warn('⚠️ Attempting to re-authenticate as admin...');
          try {
            await this.authenticateAsAdmin();
            // Try to get the session info again after re-authentication
            const updatedSessionInfo = this._adminSessionInfo;
            if (updatedSessionInfo?.password || updatedSessionInfo?.session_id) {
              console.log('✅ Successfully re-authenticated as admin');
              // Update current credentials with the new session info
              currentUid = updatedSessionInfo.uid || 0;
              currentPassword = updatedSessionInfo.password || '';
              currentSessionId = updatedSessionInfo.session_id;
            } else {
              throw new Error('Failed to re-authenticate as admin: No session info returned');
            }
          } catch (error) {
            console.error('❌ Failed to re-authenticate as admin:', error);
            throw new Error(`Authentication failed: ${error instanceof Error ? error.message : String(error)}`);
          }
        } else {
          throw new Error('No valid session available and not using admin session');
        }
      } else {
        // Use the existing session info
        currentUid = sessionInfo?.uid || 0;
        currentPassword = sessionInfo?.password || '';
        currentSessionId = sessionInfo?.session_id;
      }

      // Ensure we have the latest session info
      if (sessionInfo?.session_id) {
        requestConfig.headers = {
          ...requestConfig.headers,
          'X-Openerp-Session-Id': sessionInfo.session_id,
          'X-CSRFToken': sessionInfo.session_id,
        };
        // Only set Cookie header if sessionId is non-empty
        if (sessionInfo.session_id !== '') {
          requestConfig.headers['Cookie'] = `session_id=${sessionInfo.session_id}`;
        }
      }

      // Log the request details before sending
      if (this._config.debug) {
        logger.debug(`📤 [${messageId}] Sending request to Odoo ${model}.${method}`, {
          url: '/jsonrpc',
          method: 'POST',
          headers: {
            ...requestConfig.headers,
            'X-Openerp-Session-Id': requestConfig.headers?.['X-Openerp-Session-Id'] ? '********' : 'not-set',
            'X-CSRFToken': requestConfig.headers?.['X-CSRFToken'] ? '********' : 'not-set',
            'Cookie': requestConfig.headers?.['Cookie'] ? '********' : 'not-set',
          },
          payload: {
            ...payload,
            params: {
              ...payload.params,
              args: payload.params.args.map((arg: unknown, i: number) => 
                i === 2 ? (arg ? '********' : '') : arg // Mask password in logs
              )
            }
          },
          sessionInfo: {
            uid: sessionInfo?.uid,
            username: sessionInfo?.username,
            isAdmin: options.useAdminSession,
            sessionId: sessionInfo?.session_id ? '********' : 'not-set',
            expires: sessionInfo?.expires ? new Date(sessionInfo.expires).toISOString() : 'not-set'
          }
        });
      }

      const response = await this._client.post('/jsonrpc', payload, requestConfig);

      // Log the response if in debug mode
      if (this._config.debug) {
        logger.info(`📥 [${messageId}] Response from Odoo ${model}.${method}`, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
          error: response.data?.error,
          request: {
            url: '/jsonrpc',
            model,
            method: method,
            useAdminSession: options.useAdminSession
          }
        });
      }

      // Check for JSON-RPC error in response
      if (response.data?.error) {
        const error = response.data.error;
        console.error(`❌ [${messageId}] Odoo API error:`, {
          code: error.code,
          message: error.message,
          data: error.data
        });
        throw this.handleError(error);
      }

      // Return the result
      return response.data.result;
    } catch (error) {
      console.error(`❌ Error in Odoo API call ${model}.${method}:`, error);
      throw this.handleError(error, `Error in Odoo API call ${model}.${method}`);
    }
  }

  /**
   * Ensures the user is authenticated
   * @throws {Error} If the user is not authenticated
   */
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

      // Use admin credentials from config
      const adminUsername = process.env.NEXT_PUBLIC_ODOO_ADMIN_USERNAME || 'admin@customk9.com';
      const adminPassword = process.env.NEXT_PUBLIC_ODOO_ADMIN_PASSWORD || 'Qwerty@254';

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
        const errorData = response.data.error;
        const errorMsg = errorData.data?.message || 'Admin authentication failed';
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
        
        interface ErrorWithDetails extends Error {
          details?: unknown;
        }
        
        const error = new Error(errorMessage) as ErrorWithDetails;
        error.details = errorDetails;
        throw error;
      }

      if (!response.data?.result?.uid) {
        interface ErrorWithResponse extends Error {
          response?: unknown;
          status?: number;
        }
        
        const error = new Error('Invalid response format from Odoo server: Missing user ID in response') as ErrorWithResponse;
        error.response = response.data;
        error.status = response.status;
        
        logger.error('Authentication failed: Invalid response format', {
          error: error.message,
          status: response.status,
          responseData: response.data,
          timestamp: new Date().toISOString()
        });
        
        throw error;
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
        uid: response.data.result.uid,
        username: response.data.result.name || adminUsername,
        name: response.data.result.name || adminUsername,
        session_id: sessionId,
        password: adminPassword, // Store password for future API calls
        expires: Date.now() + SESSION_TIMEOUT_MS,
        context: response.data.result.user_context || {},
        is_admin: true,
        is_system: response.data.result.is_system || false,
        company_id: response.data.result.company_id || 1,
        partner_id: response.data.result.partner_id || null,
        user_id: response.data.result.uid,
        tz: response.data.result.tz,
        lang: response.data.result.user_context?.lang || 'en_US',
      };

      // Debug logging for the created session info
      console.log('🔑 Created admin session info:', {
        uid: sessionInfo.uid,
        username: sessionInfo.username,
        hasPassword: !!sessionInfo.password,
        passwordLength: sessionInfo.password ? String(sessionInfo.password).length : 0,
        hasSessionId: !!sessionInfo.session_id,
        sessionIdLength: sessionInfo.session_id ? String(sessionInfo.session_id).length : 0,
        expires: sessionInfo.expires ? new Date(Number(sessionInfo.expires)).toISOString() : 'never',
        keys: Object.keys(sessionInfo)
      });

      this._adminSessionInfo = sessionInfo;
      logger.info(`Successfully authenticated as admin: ${sessionInfo.username} (UID: ${sessionInfo.uid})`);
      
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

  private async getSessionInfo(): Promise<OdooSessionInfo | null> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      if (this._sessionInfo?.session_id) {
        headers['X-Openerp-Session-Id'] = this._sessionInfo.session_id;
      }

      const response = await this._client.post<{ result: OdooSessionInfo }>(
        '/web/session/get_session_info', 
        { 
          jsonrpc: '2.0', 
          method: 'call', 
          params: {}
        }, 
        {
          withCredentials: true,
          headers
        }
      );
      
      const sessionInfo = response.data?.result || null;
      
      if (sessionInfo?.uid) {
        this._sessionInfo = sessionInfo;
        this._isAuthenticated = true;
        this._currentUser = {
          uid: sessionInfo.uid,
          username: sessionInfo.username || '',
          displayName: sessionInfo.name || '',
          partnerId: sessionInfo.partner_id,
          isAdmin: sessionInfo.is_admin || false,
          is_system: sessionInfo.is_system || false,
          session_id: sessionInfo.session_id || '',
          context: sessionInfo.context || {},
          groups_id: sessionInfo.groups_id || [],
        };
        await this.saveSessionToStorage();
      } else {
        await this.clearSession();
      }
      
      return sessionInfo;
    } catch (error) {
      console.error('Error getting session info:', error);
      await this.clearSession();
      return null;
    }
  }

  /**
   * Refreshes the current session
   * @private
   */
  private refreshSession = async (): Promise<void> => {
    if (!this._sessionInfo?.session_id) {
      throw new Error('No active session to refresh');
    }
    
    if (this._isRefreshing) {
      // If already refreshing, wait for the current refresh to complete
      return new Promise((resolve) => {
        const checkRefresh = () => {
          if (!this._isRefreshing) {
            resolve(undefined);
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
      
      if (response.data?.result?.uid) {
        this._sessionInfo.expires = Date.now() + SESSION_TIMEOUT_MS;
        if (this._currentUser) {
          this._currentUser.expires_at = this._sessionInfo.expires;
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
  };

  public async getUserDataFilter(model: string): Promise<(string | (string | number | boolean | null)[])[]> {
    // Model parameter is kept for future use when implementing model-specific filters
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const modelName = model;
    if (this.isUsingAdminCredentials) {
      return [];
    }
    
    return [['create_uid', '=', this._currentUser?.uid || 0]];
  }

  private handleError(error: unknown, context: string = ''): never {
    let errorMessage = 'An unknown error occurred';

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
        // Error data is not used but kept for future debugging
        // const errorData = error.response?.data as OdooError | undefined;

        if (error.response?.data?.error) {
          const odooError = error.response.data.error;
          errorMessage = odooError.data?.message || odooError.message || 'Unknown Odoo error';
        }

        switch (status) {
          case 401:
            this.clearSession();
            this._onUnauthorized?.();
            throw new Error(errorMessage || 'Unauthorized');

          case 403:
            this._onForbidden?.();
            throw new Error(errorMessage || 'Forbidden');

          case 404:
            this._onNotFound?.();
            throw new Error(errorMessage || 'Not found');

          case 400:
            this._onBadRequest?.(error);
            throw new Error(errorMessage || 'Bad request');

          case 500:
            this._onServerError?.(error);
            throw new Error(errorMessage || 'Server error');

          default:
            this._onNetworkError?.(error);
            throw new Error(`Network error: ${errorMessage}`);
        }
      } 
      
      // Handle Odoo specific errors
      if (error && typeof error === 'object' && 'data' in error) {
        const errorObj = error as { data?: { error?: { message?: string; data?: { message?: string } } } };
        const odooError = errorObj.data?.error;
        if (odooError) {
          const message = odooError.data?.message || odooError.message || 'Unknown Odoo error';
          throw new Error(message);
        }
      }

      throw new Error(errorWithContext);
    } catch (innerError) {
      // Ensure we always throw an Error object
      if (innerError instanceof Error) {
        throw innerError;
      }
      throw new Error(String(innerError));
    }
  }

  /**
   * Tries to restore a session from localStorage if available
   */
  /**
   * Tries to restore a session from localStorage if available
   */
  private async tryRestoreSessionFromStorage(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      const sessionData = localStorage.getItem('odoo_session');
      if (!sessionData) {
        if (this._config.debug) {
          console.log('No session data found in storage');
        }
        return false;
      }

      const parsedData = JSON.parse(sessionData);
      const { sessionInfo, currentUser, timestamp } = parsedData;
      
      // Check if session is expired (1 day max age)
      const maxAge = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      const isExpired = timestamp && (Date.now() - timestamp) > maxAge;
      
      if (isExpired) {
        if (this._config.debug) {
          console.log('Session has expired');
        }
        await this.clearSession();
        return false;
      }

      // Validate required session data
      if (!sessionInfo?.uid || !currentUser?.uid) {
        if (this._config.debug) {
          console.log('Invalid session data in storage');
        }
        await this.clearSession();
        return false;
      }

      // Restore session
      this._sessionInfo = sessionInfo;
      this._currentUser = currentUser;
      this._isAuthenticated = true;
      
      if (this._config.debug) {
        console.log('Session restored from storage for user:', currentUser.username);
      }
      
      // Notify listeners
      if (this._onLogin) {
        this._onLogin(this.mapCurrentUserToOdooUser(currentUser));
      }
      
      return true;
    } catch (error) {
      console.error('Error restoring session from storage:', error);
      await this.clearSession();
      return false;
    }
  }

  /**
   * Saves the current session information to localStorage.
   */
  private async saveSessionToStorage(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      if (!this._sessionInfo || !this._currentUser) {
        console.log('No session or user data to save to storage');
        return;
      }

      const sessionData = {
        sessionInfo: this._sessionInfo,
        currentUser: this._currentUser,
        isAuthenticated: this._isAuthenticated,
        timestamp: Date.now()
      };
      
      // Only save if we have valid session data
      if (sessionData.sessionInfo.uid) {
        localStorage.setItem('odoo_session', JSON.stringify(sessionData));
        if (this._config.debug) {
          console.log('Session saved to storage:', {
            uid: sessionData.sessionInfo.uid,
            username: sessionData.currentUser.username,
            expiresAt: sessionData.sessionInfo.expires_at
          });
        }
      } else {
        await this.clearSession();
      }
    } catch (error) {
      console.error('Error saving session to storage:', error);
    }
  }

  // --- Public Getters ---
    /**
   * Gets the current session ID
   */
  public get sessionId(): string | null {
    return this._sessionInfo?.session_id || null;
  }

  /**
   * Clears the current session and authentication state
   */
  public clearSession = async (): Promise<void> => {
    this._sessionInfo = null;
    this._currentUser = null;
    this._isAuthenticated = false;
    this._authenticationPromise = null;
    
    // Clear any stored session data
    if (typeof window !== 'undefined') {
      try {
        // Clear cookies
        document.cookie = 'session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        
        // Clear localStorage and sessionStorage
        localStorage.removeItem('odoo_session');
        sessionStorage.removeItem('odoo_session');
        
        logger.info('Session cleared');
      } catch (error) {
        logger.error('Error clearing session storage', { error });
      }
    }
    
    // Notify listeners
    this._onLogout?.();
  };

  /**
   * Helper method to get user ID from session
   * @private
   */
  private async getUserIdFromSession(sessionId: string): Promise<number | null> {
    try {
      const response = await this._client.post('/web/session/get_session_info', {
        jsonrpc: '2.0',
        method: 'call',
        params: {}
      }, {
        headers: {
          'X-Openerp-Session-Id': sessionId,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data?.result?.uid || null;
    } catch (error) {
      console.error('Error getting user ID from session:', error);
      return null;
    }
  }

  /**
   * Logs out the current user
   */
  public async logout(): Promise<void> {
    try {
      if (this._isAuthenticated) {
        await this.call('web.session', 'destroy', []);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Continue with cleanup even if logout fails
    } finally {
      await this.clearSession();
    }
  }

  /**
   * Alias for logout() for backward compatibility
   */
  public async logoutUser(): Promise<void> {
    return this.logout();
  }

  /**
   * Gets the current session information
   */
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

  public getDbName(): string {
    return this._config.db;
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
        ...(dogCategoryId ? [['category_id', 'in', [dogCategoryId]]] : [])
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
  public async callOdooMethod<T = unknown>(
    model: string,
    method: string,
    args: unknown[] = [],
    kwargs: Record<string, unknown> = {}
  ): Promise<T> {
    return this.call<T>(model, method, args, kwargs);
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
      date_start: plan.startDate,
      date_deadline: plan.endDate,
      description: plan.description,
      // Optionally serialize tasks as JSON or create subtasks separately
      tasks_json: JSON.stringify(plan.tasks),
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

      const domain: (string | [string, string, any])[] = [];
      
      // Filter by current user if available
      if (this._currentUser.uid) {
        domain.push('|', ['user_id', '=', this._currentUser.uid] as [string, string, number]);
      }
      
      // Filter by partner if available
      if (this._currentUser.partnerId) {
        const partnerId = Array.isArray(this._currentUser.partnerId) 
          ? this._currentUser.partnerId[0] 
          : this._currentUser.partnerId;
          
        if (typeof partnerId === 'number') {
          domain.push('|', ['partner_ids', 'in', [partnerId]] as [string, string, number[]]);
        } else if (Array.isArray(partnerId) && partnerId.length > 0 && typeof partnerId[0] === 'number') {
          domain.push('|', ['partner_ids', 'in', [partnerId[0]]] as [string, string, number[]]);
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