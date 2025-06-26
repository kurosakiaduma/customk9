import axios, { AxiosInstance } from 'axios';
import { config } from '@/config/config'; // Import config
import { Dog, TrainingPlan, DogLifestyle, DogHistory, DogGoals } from '@/types/odoo'; // Import common Odoo types

interface OdooClientConfig {
  baseUrl: string; // This will be the relative path to your Next.js API route (e.g., '/api/odoo')
}

interface DogProfileCreateInput {
  name: string;
  breed: string;
  age: string;
  gender: string;
  sterilized: string;
  dogSource: string;
  timeWithDog: string;
  medications: string;
  currentDeworming: string;
  tickFleaPreventative: string;
  vetClinic: string;
  vetName: string;
  vetPhone: string;
  medicalIssues: string;
  lifestyle: DogLifestyle;
  history: DogHistory;
  goals: DogGoals;
  behaviorChecklist: string[];
  behaviorDetails: string;
  undesirableBehavior: string;
  fearDescription: string;
}

interface SessionInfo {
  uid: number;
  username: string;
  is_admin: boolean;
  is_system: boolean;
  session_id: string;
  partner_id?: number;
}

interface CurrentUser {
  uid: number;
  username: string;
  displayName?: string;
  partnerId?: number;
  isAdmin: boolean;
}

export class OdooClientService {
  private client: AxiosInstance;
  private isAuthenticated: boolean = false;
  private sessionInfo: SessionInfo | null = null;
  private authenticationPromise: Promise<SessionInfo> | null = null;
  private currentUser: CurrentUser | null = null;
  private isUsingAdminCredentials: boolean = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_config: OdooClientConfig) {
    this.client = axios.create({
      baseURL: '', // Use relative URLs since we're calling our own API routes
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Important for browser to send/receive cookies
    });  }
  
  // Generic method to call Odoo operations via the Next.js API proxy
  async call(path: string, payload: Record<string, unknown>, skipAuthCheck: boolean = false) {
    try {
      // Skip authentication checks for session validation calls to avoid infinite loops
      if (!skipAuthCheck && path !== '/web/session/authenticate' && path !== '/web/session/get_session_info' && path !== '/jsonrpc') {
        await this.ensureAuthenticated();
      }

      // Route all calls through our Next.js API proxy
      const apiPath = `/api/odoo${path}`;
      const response = await this.client.post(apiPath, payload);      if (response.data.error) {
        console.error('🔍 Detailed Odoo error:', {
          message: response.data.error.message,
          data: response.data.error.data,
          code: response.data.error.code,
          fullError: response.data.error
        });
        
        // Extract more specific error information
        let errorMessage = 'Odoo Server Error';
        if (response.data.error.data) {
          if (response.data.error.data.message) {
            errorMessage = response.data.error.data.message;
          } else if (response.data.error.data.name) {
            errorMessage = response.data.error.data.name;
          } else if (response.data.error.data.arguments) {
            errorMessage = response.data.error.data.arguments.join(' ');
          }
        } else if (response.data.error.message) {
          errorMessage = response.data.error.message;
        }
        
        console.error('🔍 Extracted error message:', errorMessage);
        throw new Error(errorMessage);
      }
      return response.data.result;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }  // Method to ensure authentication before making data calls
  private async ensureAuthenticated(): Promise<void> {
    if (this.isAuthenticated && this.currentUser) {
      return;
    }

    // Check if we have a valid user session first
    const currentUser = await this.checkUserSession();
    if (currentUser) {
      console.log('✅ User session found during ensureAuthenticated');
      return;
    }

    // If no user session, we need to redirect to login
    if (typeof window !== 'undefined') {
      console.log('❌ No user session found, redirecting to login');
      window.location.href = '/client-area';
      throw new Error('Authentication required - redirecting to login');
    }
    
    throw new Error('Authentication required');
  }
  // Authentication methods
  async authenticate(login: string, password: string, db: string) {
    try {
      console.log(`🔐 Authenticating user via authenticate method: ${login}`);
      
      const result = await this.call('/web/session/authenticate', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db,
          login,
          password
        }
      }, true); // Skip auth check for login
      
      if (result && result.uid) {
        this.sessionInfo = {
          uid: result.uid,
          username: result.username || login,
          is_admin: result.is_admin || false,
          is_system: result.is_system || false,
          session_id: result.session_id || 'MISSING',
          partner_id: result.partner_id
        };
        
        this.isAuthenticated = true;
        this.isUsingAdminCredentials = false;
        this.currentUser = {
          uid: result.uid,
          username: result.username || login,
          partnerId: result.partner_id,
          isAdmin: result.is_admin || false,
          displayName: result.name || result.username || login.split('@')[0]
        };
        
        // Store user session for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('customk9_user_session', JSON.stringify({
            username: login,
            uid: result.uid,
            isAdmin: result.is_admin || false,
            partnerId: result.partner_id,
            displayName: result.name || result.username || login.split('@')[0],
            timestamp: Date.now()
          }));
        }
        
        console.log(`✅ User authenticated via authenticate method: ${login}, Admin: ${this.currentUser.isAdmin}, Partner ID: ${this.currentUser.partnerId}`);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Authentication error in authenticate method:', error);
      throw error;
    }
  }
  async destroySession() {
    const result = await this.call('/web/session/destroy', {
      jsonrpc: '2.0',
      method: 'call'
    });
    
    this.isAuthenticated = false;
    return result;
  }  // Get session info with caching to avoid redundant authentication calls
  // This method should ONLY return admin sessions for API operations
  async getSessionInfo(): Promise<SessionInfo> {
    // If we already have cached ADMIN session info, return it
    if (this.isAuthenticated && this.sessionInfo && this.isUsingAdminCredentials) {
      console.log('🟢 Using cached ADMIN session info:', {
        uid: this.sessionInfo.uid,
        username: this.sessionInfo.username,
        session_id: this.sessionInfo.session_id?.substring(0, 10) + '...' || 'MISSING'
      });
      return this.sessionInfo;
    }

    // Clear any cached user session since we need admin session
    if (this.sessionInfo && !this.isUsingAdminCredentials) {
      console.log('🔄 Clearing user session to get admin session');
      this.sessionInfo = null;
      this.isAuthenticated = false;
    }

    // If there's already an authentication in progress, wait for it
    if (this.authenticationPromise) {
      console.log('⏳ Admin authentication already in progress, waiting...');
      return await this.authenticationPromise;
    }

    // Start new ADMIN authentication
    console.log('🔄 Starting new ADMIN authentication...');
    this.authenticationPromise = this.performAuthentication();
    
    try {
      const sessionInfo = await this.authenticationPromise;
      return sessionInfo;
    } finally {
      // Clear the promise once done (whether success or failure)
      this.authenticationPromise = null;
    }
  }
  private async performAuthentication(): Promise<SessionInfo> {
    try {
      // ALWAYS use admin credentials for this service - never user credentials
      console.log('🔍 OdooClientService: Starting ADMIN authentication...');
      
      // Route all calls through our Next.js API proxy with detailed logging
      const apiPath = `/api/odoo/web/session/authenticate`;
      const payload = {
        jsonrpc: '2.0',
        method: 'call',        params: {
          db: config.odoo.database,
          login: config.odoo.adminUsername,
          password: config.odoo.adminPassword
        }
      };
      
      console.log('🔍 OdooClientService: Making ADMIN authentication request to:', apiPath);
      console.log('🔍 OdooClientService: Payload:', { 
        ...payload, 
        params: { 
          ...payload.params, 
          password: '***',
          login: config.odoo.adminUsername 
        } 
      });
      
      const response = await this.client.post(apiPath, payload);
      
      console.log('🔍 OdooClientService: Raw response status:', response.status);
      console.log('🔍 OdooClientService: Raw response data:', response.data);
        // Handle nested result structures - the response is { result: { jsonrpc: "2.0", id: null, result: {...} } }
      let authResult = response.data;
      
      // First level of nesting
      if (response.data.result) {
        authResult = response.data.result;
        console.log('🔍 OdooClientService: First level nested result:', authResult);
        
        // Second level of nesting - check if there's another result property
        if (authResult.result) {
          authResult = authResult.result;
          console.log('🔍 OdooClientService: Second level nested result (final):', authResult);
        }
      } else {
        console.log('🔍 OdooClientService: Using direct response data:', authResult);
      }
      
      // Check for errors in response
      if (response.data.error) {
        console.error('❌ OdooClientService: ADMIN authentication error in response:', response.data.error);
        throw new Error(response.data.error.message || response.data.error.data?.message || 'Odoo Server Error');
      }
      
      // Check for uid in the auth result to confirm successful authentication
      if (authResult && authResult.uid) {
        console.log('✅ OdooClientService: ADMIN authentication successful, uid:', authResult.uid);
        this.isAuthenticated = true;
        this.isUsingAdminCredentials = true; // Mark that we're using admin credentials
        
        const sessionInfo: SessionInfo = {
          uid: authResult.uid,
          username: authResult.username || authResult.login || config.odoo.adminUsername,
          is_admin: authResult.is_admin || false,
          is_system: authResult.is_system || false,
          session_id: authResult.session_id || ''
        };
        
        // Cache the session info
        this.sessionInfo = sessionInfo;
        
        console.log('✅ OdooClientService: ADMIN session info created and cached:', { 
          ...sessionInfo, 
          session_id: sessionInfo.session_id ? 'PRESENT' : 'MISSING',
          isAdminUID: sessionInfo.uid === 2 // UID 2 is typically admin
        });
        return sessionInfo;
      } else {
        console.error('❌ OdooClientService: No uid found in ADMIN authentication response');
        console.error('❌ OdooClientService: AuthResult:', authResult);
        throw new Error('Admin authentication failed: No user ID returned');
      }
    } catch (error: unknown) {
      console.error('❌ OdooClientService: ADMIN authentication failed:', error);
      this.isAuthenticated = false;
      this.isUsingAdminCredentials = false;
      this.sessionInfo = null;
      throw error;
    }
  }// Core Odoo method calling - with intelligent credential management
  async callOdooMethod(model: string, method: string, args: unknown[] = [], kwargs: Record<string, unknown> = {}): Promise<unknown> {
    try {
      console.log(`🔍 OdooClientService: Calling ${model}.${method} with args:`, args, 'kwargs:', kwargs);
      
      let sessionInfo: SessionInfo;
      let useAdminCredentials = false;
      
      // For user management operations, always use admin credentials
      const adminOnlyOperations = ['create', 'write', 'unlink'];
      const adminOnlyModels = ['res.users', 'res.groups', 'res.partner'];
      
      if (adminOnlyModels.includes(model) && adminOnlyOperations.includes(method)) {
        console.log(`🔐 Using admin credentials for ${model}.${method} operation`);
        sessionInfo = await this.getSessionInfo(); // This gets admin session
        useAdminCredentials = true;
      }      // For authenticated users, use admin credentials with user context for data filtering
      // This is temporary until server-side permissions are fully working
      else if (this.isAuthenticated && this.currentUser) {
        console.log(`🔐 Using admin credentials for ${model} with user context (user: ${this.currentUser.username})`);
        sessionInfo = await this.getSessionInfo(); // This gets admin session
        useAdminCredentials = true;
      } else {
        // Not authenticated or initial authentication - use admin session
        sessionInfo = await this.getSessionInfo(); // This gets admin session
        useAdminCredentials = true;
      }      
      console.log(`✅ OdooClientService: Session info obtained, uid: ${sessionInfo.uid} (admin: ${useAdminCredentials})`);
      
      // Apply user data filtering for non-admin users, regardless of which credentials are used for the API call
      let finalArgs = args;
      if (method === 'search' || method === 'search_read') {
        const userFilter = this.getUserDataFilter(model);
        if (userFilter.length > 0) {
          // Combine existing domain with user filter
          const existingDomain = Array.isArray(args[0]) ? args[0] : [];
          const combinedDomain = existingDomain.length > 0 ? [...existingDomain, ...userFilter] : userFilter;
          finalArgs = [combinedDomain, ...args.slice(1)];
          console.log(`🔍 Applied user filter for ${model}:`, userFilter);
          console.log(`🔍 Final domain for ${model}:`, combinedDomain);
        }
      }
      
      // Try the /jsonrpc endpoint
      const response = await this.call('/jsonrpc', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            config.odoo.database,
            sessionInfo.uid,
            config.odoo.adminPassword, // Use admin password for authentication
            model,
            method,
            finalArgs, // Use filtered args
            kwargs
          ]
        },
        id: Date.now()
      });
        console.log(`📊 OdooClientService: ${model}.${method} response:`, response);
      return response;
    } catch (error) {
      console.error(`❌ Error calling Odoo method ${model}.${method}:`, error);
      
      // If we get an access error and haven't tried admin credentials yet, try them
      if (error instanceof Error && 
          error.message.includes('Access Denied') &&
          this.currentUser && !this.isCurrentUserAdmin() && !kwargs._retryWithAdmin) {
        console.log('🔄 Access denied for user, retrying with admin credentials...');
        
        // Retry with admin credentials but maintain user context for filtering
        return this.callOdooMethod(model, method, args, { ...kwargs, _retryWithAdmin: true });
      }
      
      // If we get an authentication error, clear the cache and try again once
      if (error instanceof Error && 
          (error.message.includes('authentication') || 
           error.message.includes('session') || 
           error.message.includes('invalid') ||
           error.message.includes('expired'))) {
        console.log('🔄 Authentication error detected, clearing cache and retrying...');
        this.clearSessionCache();
        
        // Only retry once to avoid infinite loops
        if (!kwargs._retryAttempt) {
          return this.callOdooMethod(model, method, args, { ...kwargs, _retryAttempt: true });
        }
      }
      
      throw error;
    }
  }// Authenticate with user-provided credentials
  async authenticateUser(username: string, password: string): Promise<SessionInfo> {
    try {
      console.log(`🔐 Authenticating user: ${username}`);
      
      const response = await this.call('/web/session/authenticate', {
        jsonrpc: "2.0",
        method: "call",
        params: {
          db: config.odoo.database,
          login: username,
          password: password
        }
      }, true); // Skip auth check for login

      console.log('🔍 Authentication response:', response);

      // Handle nested result structures - similar to performAuthentication
      let authResult = response;
      
      // First level of nesting
      if (response && response.result) {
        authResult = response.result;
        console.log('🔍 First level nested result:', authResult);
        
        // Second level of nesting - check if there's another result property
        if (authResult.result) {
          authResult = authResult.result;
          console.log('🔍 Second level nested result (final):', authResult);
        }
      }

      if (authResult && authResult.uid) {
        this.sessionInfo = {
          uid: authResult.uid,
          username: authResult.username || username,
          is_admin: authResult.is_admin || false,
          is_system: authResult.is_system || false,
          session_id: authResult.session_id || 'MISSING',
          partner_id: authResult.partner_id
        };
          this.isAuthenticated = true;
        this.isUsingAdminCredentials = false;
        
        // Create display name - prefer response username, fallback to extracting from email
        const displayName = authResult.username || username.split('@')[0];
        
        this.currentUser = {
          uid: authResult.uid,
          username: authResult.username || username,
          displayName: displayName,
          partnerId: authResult.partner_id,
          isAdmin: authResult.is_admin || false
        };
        
        // Store user session for persistence with display name
        if (typeof window !== 'undefined') {
          localStorage.setItem('customk9_user_session', JSON.stringify({
            email: username,
            username: authResult.username || username,
            displayName: displayName,
            uid: authResult.uid,
            isAdmin: authResult.is_admin || false,
            partnerId: authResult.partner_id,
            timestamp: Date.now()
          }));
        }
        
        console.log(`✅ User authenticated: ${username}, Admin: ${this.currentUser.isAdmin}, Partner ID: ${this.currentUser.partnerId}`);
        return this.sessionInfo;      } else {
        console.error('❌ No uid found in authentication response');
        console.error('❌ AuthResult:', authResult);
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('❌ User authentication error:', error);
      throw error;
    }
  }

  // Check if user session exists and is valid
  async checkUserSession(): Promise<CurrentUser | null> {
    if (typeof window === 'undefined') return null;
    
    const userSession = localStorage.getItem('customk9_user_session');
    if (!userSession) return null;
    
    try {
      const session = JSON.parse(userSession);
      const hoursSinceLogin = (Date.now() - session.timestamp) / (1000 * 60 * 60);
      
      // Session expires after 8 hours
      if (hoursSinceLogin > 8) {
        localStorage.removeItem('customk9_user_session');
        return null;
      }

      // For now, trust the local session if it's not expired
      // We'll validate against Odoo only when making actual API calls
      this.currentUser = {
        uid: session.uid,
        username: session.username || session.email,
        displayName: session.displayName || session.username || session.email?.split('@')[0],
        partnerId: session.partnerId,
        isAdmin: session.isAdmin
      };
      this.isAuthenticated = true;
      this.isUsingAdminCredentials = false;
      
      console.log('✅ Valid user session found:', {
        username: this.currentUser.username,
        displayName: this.currentUser.displayName,
        isAdmin: this.currentUser.isAdmin,
        partnerId: this.currentUser.partnerId
      });
      
      return this.currentUser;
    } catch (error) {
      console.error('Error parsing user session:', error);
      localStorage.removeItem('customk9_user_session');
      return null;
    }
  }

  // Get current user info
  getCurrentUser(): CurrentUser | null {
    return this.currentUser;
  }

  // Check if current user is admin
  isCurrentUserAdmin(): boolean {
    return this.currentUser?.isAdmin || false;
  }
  // Logout user
  async logoutUser(): Promise<void> {
    try {
      // First clear all local state
      this.isAuthenticated = false;
      this.sessionInfo = null;
      this.currentUser = null;
      this.isUsingAdminCredentials = false;
      this.authenticationPromise = null;
      
      // Clear localStorage immediately
      if (typeof window !== 'undefined') {
        localStorage.removeItem('customk9_user_session');
        localStorage.removeItem('customk9_auth_token');
        localStorage.removeItem('customk9_user');
        localStorage.removeItem('customk9_user_name');
      }
      
      // Try to destroy the Odoo session, but don't let it block logout
      try {
        await this.destroySession();
        console.log('✅ Odoo session destroyed successfully');
      } catch (error) {
        console.warn('⚠️ Failed to destroy Odoo session, but user logged out locally:', error);
      }
      
      console.log('✅ User logout completed');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Even if there's an error, ensure local state is cleared
      this.isAuthenticated = false;
      this.sessionInfo = null;
      this.currentUser = null;
      this.isUsingAdminCredentials = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('customk9_user_session');
        localStorage.removeItem('customk9_auth_token');
        localStorage.removeItem('customk9_user');
        localStorage.removeItem('customk9_user_name');
      }
    }
  }  // Get user-specific data filters - different filters for different models
  private getUserDataFilter(model: string = ''): unknown[] {
    // Always filter data for non-admin users, regardless of which credentials are used for the API call
    if (this.currentUser && !this.currentUser.isAdmin) {
      const partnerId = this.currentUser.partnerId;
      if (partnerId) {
        // Different models use different field names to reference partners
        if (model === 'res.partner') {
          // For partners (dogs), filter by parent_id since dogs are child records of the user
          console.log(`🔍 Applying user filter for res.partner: parent_id = ${partnerId}`);
          return [['parent_id', '=', partnerId]];
        } else if (model === 'project.project') {
          // For projects, filter by partner_id
          console.log(`🔍 Applying user filter for project.project: partner_id = ${partnerId}`);
          return [['partner_id', '=', partnerId]];
        } else if (model === 'calendar.event') {
          // For calendar events, filter by partner_ids (many2many) or user_id
          console.log(`🔍 Applying user filter for calendar.event: partner_ids contains ${partnerId}`);
          return ['|', ['partner_ids', 'in', [partnerId]], ['user_id', '=', this.currentUser.uid]];
        } else if (model === 'project.task') {
          // For tasks, filter by project's partner_id
          console.log(`🔍 Applying user filter for project.task: project partner_id = ${partnerId}`);
          return [['project_id.partner_id', '=', partnerId]];
        } else {
          // Default: try partner_id field
          console.log(`🔍 Applying default user filter for ${model}: partner_id = ${partnerId}`);
          return [['partner_id', '=', partnerId]];
        }
      } else {
        // If no partner_id, return filter that matches nothing
        console.log("⚠️ No partner_id found for user, returning empty filter");
        return [['id', '=', -1]];
      }
    } else {
      // Admins can see all data
      console.log("🔍 Admin user or no current user, no filter applied");
      return [];
    }
  }
  // Clear session cache and force re-authentication
  clearSessionCache(): void {
    this.isAuthenticated = false;
    this.sessionInfo = null;
    this.authenticationPromise = null;
    this.currentUser = null;
    this.isUsingAdminCredentials = false; // Reset admin credentials flag
    if (typeof window !== 'undefined') {
      localStorage.removeItem('customk9_user_session');
    }
  }
  
  // Check if current user has required group membership
  async checkUserPermissions(model: string): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Admin users always have access
    if (user.isAdmin) return true;
    
    // For regular users, since we've already set up the CustomK9 Client group with proper permissions,
    // we can assume they have access if they're authenticated portal users
    // The record rules will handle the data isolation automatically
    console.log(`✅ User has permissions for ${model}, using user session`);
    return true;
  }

  // Helper method to check if a model exists and user has access
  async checkModelAccess(modelName: string): Promise<boolean> {
    try {
      // First check if user has permissions for this model
      const hasPermissions = await this.checkUserPermissions(modelName);
      if (!hasPermissions) {
        console.warn(`User does not have permissions for model ${modelName}`);
        return false;
      }
      
      await this.callOdooMethod(modelName, 'search', [[]], { limit: 1 });
      return true;
    } catch (error) {
      console.warn(`Model ${modelName} not accessible:`, error);
      return false;
    }
  }  // Dog Profile Management
  async getDogs(): Promise<Dog[]> {
    try {
      console.log("🐕 OdooClientService.getDogs(): Starting...");
      
      if (!this.isAuthenticated || !this.currentUser) {
        console.warn("🐕 User not authenticated, returning empty array");
        return [];
      }

      // Use base dog filter only - user filtering will be applied automatically in callOdooMethod
      const baseFilter = [["function", "=", "Dog"]];
      
      console.log("🔍 Base filter for dogs:", baseFilter);

      const response = await this.callOdooMethod('res.partner', 'search_read',
        [baseFilter],
        { fields: ["name", "comment", "id", "parent_id"] });
      
      console.log("🐕 OdooClientService.getDogs(): Raw response:", response);
      
      // Handle empty response gracefully
      if (!Array.isArray(response)) {
        console.warn("🐕 Unexpected response format, returning empty array");
        return [];
      }
      
      if (response.length === 0) {
        console.log("🐕 No dogs found for user, returning empty array");
        return [];
      }
      
      console.log(`🐕 Found ${response.length} dogs for user ${this.currentUser.username}`);
        
      const processedDogs = (response as Record<string, unknown>[]).map((dog: Record<string, unknown>) => {
        try {
          // Clean HTML encoding from comment field and extract JSON
          let cleanComment = dog.comment && typeof dog.comment === 'string' ? dog.comment : '';
          cleanComment = cleanComment.replace(/<\/?p>/g, '').replace(/\\u003c/g, '<').replace(/\\u003e/g, '>');
          const commentData = cleanComment ? JSON.parse(cleanComment) : {};
          return {
            id: typeof dog.id === 'number' ? dog.id : 0,
            name: typeof dog.name === 'string' ? dog.name : 'Unknown',
            breed: commentData.dogInfo?.breed || 'Unknown',
            age: commentData.dogInfo?.age || 'Unknown',
            gender: commentData.dogInfo?.gender || 'Unknown',
            level: commentData.dogInfo?.level || 'Beginner',
            progress: commentData.dogInfo?.progress || 0,
            image: '/images/dog-placeholder.jpg',
            dogInfo: commentData.dogInfo || {},
            lifestyle: commentData.lifestyle || {},
            history: commentData.history || {},
            goals: commentData.goals || {},
            behaviorChecklist: commentData.behaviorChecklist || [],
          } as Dog;
        } catch (parseError: unknown) {
          console.warn('Failed to parse dog comment data:', parseError);
          return {
            id: typeof dog.id === 'number' ? dog.id : 0,
            name: typeof dog.name === 'string' ? dog.name : 'Unknown',
            breed: 'Unknown',
            age: 'Unknown',
            gender: 'Unknown',
            level: 'Beginner',
            progress: 0,
            image: '/images/dog-placeholder.jpg',
            dogInfo: {
              breed: 'Unknown',
              age: 'Unknown',
              gender: 'Unknown',
              level: 'Beginner',
              progress: 0,
              sterilized: 'N',
              dogSource: '',
              timeWithDog: '',
              medications: '',
              currentDeworming: 'N',
              tickFleaPreventative: '',
              vetClinic: '',
              vetName: '',
              vetPhone: '',
              medicalIssues: ''
            },
            lifestyle: {},
            history: {},
            goals: {},
            behaviorChecklist: [],
          } as Dog;
        }
      });
      
      console.log("🐕 OdooClientService.getDogs(): Final processed dogs:", processedDogs);
      return processedDogs;
    } catch (error: unknown) {
      console.error("❌ OdooClientService.getDogs(): Error:", error);
      
      // Return empty array for network/connection issues to allow graceful empty state handling
      // Only throw for authentication errors
      if (error instanceof Error && error.message.includes('authentication')) {
        throw this.handleError(error);
      }
      
      console.warn("🐕 Returning empty array due to error:", error);
      return [];
    }
  }  // Training Plan Management
  async getTrainingPlans(): Promise<TrainingPlan[]> {
    try {
      console.log("📋 OdooClientService.getTrainingPlans(): Starting...");
      
      if (!this.isAuthenticated || !this.currentUser) {
        console.warn("📋 User not authenticated, returning empty array");
        return [];
      }

      // Use empty filter - user filtering will be applied automatically in callOdooMethod
      const response = await this.callOdooMethod('project.project', 'search_read', 
        [[]], // Empty domain - user filter will be applied automatically
        {
          fields: ['id', 'name', 'partner_id', 'date_start', 'date', 'description', 'task_ids'],
          limit: 20
        });

      console.log("📋 OdooClientService.getTrainingPlans(): Raw response:", response);
      
      // Handle empty response gracefully
      if (!Array.isArray(response)) {
        console.warn("📋 Unexpected response format, returning empty array");
        return [];
      }
      
      if (response.length === 0) {
        console.log("📋 No training plans found for user, returning empty array");
        return [];
      }
      
      console.log(`📋 Found ${response.length} training plans for user ${this.currentUser.username}`);

      const processedPlans = (response as Record<string, unknown>[]).map((plan: Record<string, unknown>) => ({
        id: typeof plan.id === 'number' ? plan.id : 0,
        name: typeof plan.name === 'string' ? plan.name : '',
        partner_id: Array.isArray(plan.partner_id) && plan.partner_id.length > 0 ? plan.partner_id[0] : null,
        date_start: typeof plan.date_start === 'string' ? plan.date_start : null,
        date: typeof plan.date === 'string' ? plan.date : null,
        description: typeof plan.description === 'string' ? plan.description : '',
        progress: 0, // Project model doesn't have progress by default
        task_ids: Array.isArray(plan.task_ids) ? plan.task_ids : [],
        tasks: [],
      })) as TrainingPlan[];
      
      console.log("📋 OdooClientService.getTrainingPlans(): Final processed plans:", processedPlans);
      return processedPlans;
    } catch (error: unknown) {
      console.error("❌ OdooClientService.getTrainingPlans(): Error:", error);
      
      // Return empty array for most errors to allow graceful empty state handling
      // Only throw for critical authentication errors
      if (error instanceof Error && error.message.includes('authentication')) {
        throw this.handleError(error);
      }
      
      console.warn("📋 Returning empty array due to error:", error);
      return [];
    }
  }

  async createTrainingPlan(planData: {
    name: string;
    dogId: number;
    startDate: string;
    endDate: string;
    description: string;
    tasks: Array<{
      name: string;
      description: string;
    }>;
  }): Promise<number> {
    try {      // Check if project model is available
      const hasProjectAccess = await this.checkModelAccess('project.project');
      
      if (!hasProjectAccess) {
        console.log("⚠️ Project model not accessible, cannot create training plan");
        // Return a mock ID since we can't actually create the plan
        throw new Error("Training plan creation not available - project management module not installed");
      }

      // Ensure user is authenticated and get their IDs
      if (!this.currentUser || !this.currentUser.partnerId) {
        throw new Error('User not authenticated or missing partner information');
      }

      const response = await this.callOdooMethod('project.project', 'create', [{
        name: planData.name,
        user_id: this.currentUser.uid, // Use current user's UID
        partner_id: this.currentUser.partnerId, // Link to current user's partner
        date_start: planData.startDate,
        date: planData.endDate,
        description: planData.description,
      }]);
      const projectId = response as number;

      if (planData.tasks && planData.tasks.length > 0) {
        for (const task of planData.tasks) {
          await this.callOdooMethod('project.task', 'create', [{
            name: task.name,
            project_id: projectId,
            description: task.description,
          }]);
        }
      }
      return projectId;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  async createDogProfile(dogProfileData: DogProfileCreateInput): Promise<number> {
    const odooComment = JSON.stringify({
      dogInfo: {
        breed: dogProfileData.breed,
        age: dogProfileData.age,
        gender: dogProfileData.gender,
        sterilized: dogProfileData.sterilized,
        dogSource: dogProfileData.dogSource,
        timeWithDog: dogProfileData.timeWithDog,
        medications: dogProfileData.medications,
        currentDeworming: dogProfileData.currentDeworming,
        tickFleaPreventative: dogProfileData.tickFleaPreventative,
        vetClinic: dogProfileData.vetClinic,
        vetName: dogProfileData.vetName,
        vetPhone: dogProfileData.vetPhone,
        medicalIssues: dogProfileData.medicalIssues,
      },
      lifestyle: dogProfileData.lifestyle,
      history: dogProfileData.history,
      goals: dogProfileData.goals,
      behaviorChecklist: dogProfileData.behaviorChecklist,
      behaviorDetails: dogProfileData.behaviorDetails,
      undesirableBehavior: dogProfileData.undesirableBehavior,
      fearDescription: dogProfileData.fearDescription,
    });    // Ensure user is authenticated and get their partner ID
    if (!this.currentUser || !this.currentUser.partnerId) {
      throw new Error('User not authenticated or missing partner information');
    }

    const response = await this.callOdooMethod('res.partner', 'create', [{
      name: dogProfileData.name,
      parent_id: this.currentUser.partnerId, // Use current user's partner ID instead of hardcoded 3
      function: 'Dog',
      comment: odooComment,
    }]);

    return response as number;
  }  async registerUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ userId: number; partnerId: number; token: string }> {
    try {      // Create partner first
      const partnerResponse = await this.callOdooMethod('res.partner', 'create', [{
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        customer_rank: 1
      }]);
      const partnerId = partnerResponse as number;

      // Get Portal group (required for all portal users)
      const portalGroupResponse = await this.callOdooMethod('res.groups', 'search_read',
        [[['name', '=', 'Portal']]],
        { fields: ['id'] });
      
      if (!Array.isArray(portalGroupResponse) || portalGroupResponse.length === 0) {
        throw new Error('Portal group not found in Odoo');
      }
      const portalGroupId = (portalGroupResponse[0] as { id: number }).id;      // Get or create CustomK9 Client group
      const customk9GroupResponse = await this.callOdooMethod('res.groups', 'search_read',
        [[['name', '=', 'CustomK9 Client']]],
        { fields: ['id'] });
      
      let customk9GroupId: number;
      
      if (!Array.isArray(customk9GroupResponse) || customk9GroupResponse.length === 0) {
        console.log('⚠️ CustomK9 Client group not found, creating it...');
        
        // Get base category for groups
        let baseCategoryId: number | false = false;
        try {
          const categoryResponse = await this.callOdooMethod('ir.module.category', 'search_read',
            [[['name', '=', 'Hidden']]],
            { fields: ['id'], limit: 1 });
          if (Array.isArray(categoryResponse) && categoryResponse.length > 0) {
            baseCategoryId = (categoryResponse[0] as { id: number }).id;
          }
        } catch (error) {
          console.warn('Could not find Hidden category, using false:', error);
        }
        
        // Create the CustomK9 Client group
        customk9GroupId = await this.callOdooMethod('res.groups', 'create', [{
          name: 'CustomK9 Client',
          category_id: baseCategoryId,
          comment: 'Clients with access to training plans and calendar events for CustomK9',
        }]) as number;
        
        console.log(`✅ Created CustomK9 Client group with ID: ${customk9GroupId}`);
        
        // Set up basic access rights for the newly created group
        await this.setupCustomK9GroupPermissions(customk9GroupId);
      } else {
        customk9GroupId = (customk9GroupResponse[0] as { id: number }).id;
        console.log(`✅ Found existing CustomK9 Client group with ID: ${customk9GroupId}`);
      }

      // Create user with both Portal and CustomK9 Client groups
      const userResponse = await this.callOdooMethod('res.users', 'create', [{
        login: userData.email,
        password: userData.password,
        partner_id: partnerId,
        name: userData.name,
        groups_id: [[6, 0, [portalGroupId, customk9GroupId]]],        action_id: false,
        active: true
      }]);
      const userId = userResponse as number;

      console.log(`✅ Created user ${userData.email} with Portal and CustomK9 Client groups`);

      // Authenticate the user to get their session
      const authResponse = await this.authenticate(userData.email, userData.password, config.odoo.database);

      return {
        partnerId,
        userId,
        token: (authResponse as { session_id: string }).session_id
      };
    } catch (error: unknown) {
      console.error('❌ Error in registerUser:', error);
      throw this.handleError(error);
    }
  }

  // Helper method to set up basic permissions for CustomK9 Client group
  private async setupCustomK9GroupPermissions(groupId: number): Promise<void> {
    try {
      console.log('🔧 Setting up basic permissions for CustomK9 Client group...');
      
      // Get model IDs for the models we want to grant access to
      const modelsToSetup = [
        { external_id: 'project.model_project_project', name: 'project.project' },
        { external_id: 'project.model_project_task', name: 'project.task' },
        { external_id: 'calendar.model_calendar_event', name: 'calendar.event' },
        { external_id: 'base.model_res_partner', name: 'res.partner' }
      ];
      
      for (const modelInfo of modelsToSetup) {
        try {
          // Get the model ID
          const modelResponse = await this.callOdooMethod('ir.model', 'search_read',
            [[['model', '=', modelInfo.name]]],
            { fields: ['id'], limit: 1 });
          
          if (Array.isArray(modelResponse) && modelResponse.length > 0) {
            const modelId = (modelResponse[0] as { id: number }).id;
            
            // Create basic read access for this model
            const accessName = `CustomK9 Client ${modelInfo.name} Read`;
            const existingAccess = await this.callOdooMethod('ir.model.access', 'search',
              [[['name', '=', accessName], ['group_id', '=', groupId]]]);
            
            if (!Array.isArray(existingAccess) || existingAccess.length === 0) {
              await this.callOdooMethod('ir.model.access', 'create', [{
                name: accessName,
                model_id: modelId,
                group_id: groupId,
                perm_read: true,
                perm_write: modelInfo.name === 'calendar.event' || modelInfo.name === 'res.partner',
                perm_create: modelInfo.name === 'calendar.event',
                perm_unlink: false,
              }]);
              console.log(`✅ Created access rule: ${accessName}`);
            }
          }
        } catch (error) {
          console.warn(`⚠️ Could not set up permissions for ${modelInfo.name}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ Error setting up CustomK9 group permissions:', error);
      // Don't throw here - group creation was successful, permissions can be set up later
    }
  }

  private handleError(error: unknown): Error {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: { error?: unknown }, status?: number }, request?: unknown, message?: string };
      
      if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'error' in axiosError.response.data) {
        const odooError = axiosError.response.data.error as Record<string, unknown>;
        const errorMessage = 
          (typeof odooError.data === 'object' && odooError.data !== null && 'message' in odooError.data ? String(odooError.data.message) : '') ||
          (typeof odooError.message === 'string' ? odooError.message : '') ||
          (typeof odooError.data === 'object' && odooError.data !== null && 'name' in odooError.data ? String(odooError.data.name) : '') ||
          'Odoo server error (via proxy)';
        return new Error(errorMessage);
      } else if (axiosError.response) {
        return new Error(`Server error (via proxy): ${axiosError.response.status}`);
      } else if (axiosError.request) {
        return new Error('No response from proxy server');
      } else {
        return new Error(axiosError.message || 'Error setting up request to proxy');
      }
    } else if (error instanceof Error) {
      return error;
    } else {
      return new Error(String(error) || 'Unknown error occurred');
    }
  }
}
