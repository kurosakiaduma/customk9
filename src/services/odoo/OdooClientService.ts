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
}

export class OdooClientService {
  private client: AxiosInstance;
  private isAuthenticated: boolean = false;
  private sessionInfo: SessionInfo | null = null;
  private authenticationPromise: Promise<SessionInfo> | null = null;

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
  }
  // Method to ensure authentication before making data calls
  private async ensureAuthenticated(): Promise<void> {
    if (this.isAuthenticated) {
      return;
    }

    // For now, assume authentication based on successful login redirect to dashboard
    // We'll improve this once the basic data flow works
    console.log('Assuming user is authenticated since they reached the dashboard');
    this.isAuthenticated = true;
    return;
  }

  // Authentication methods
  async authenticate(login: string, password: string, db: string) {
    const result = await this.call('/web/session/authenticate', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        db,
        login,
        password
      }
    });
    
    if (result && result.uid) {
      this.isAuthenticated = true;
    }
    
    return result;
  }
  async destroySession() {
    const result = await this.call('/web/session/destroy', {
      jsonrpc: '2.0',
      method: 'call'
    });
    
    this.isAuthenticated = false;
    return result;
  }  // Get session info with caching to avoid redundant authentication calls
  async getSessionInfo(): Promise<SessionInfo> {
    // If we already have cached session info and are authenticated, return it
    if (this.isAuthenticated && this.sessionInfo) {
      console.log('🟢 Using cached session info:', {
        uid: this.sessionInfo.uid,
        username: this.sessionInfo.username,
        session_id: this.sessionInfo.session_id?.substring(0, 10) + '...' || 'MISSING'
      });
      return this.sessionInfo;
    }

    // If there's already an authentication in progress, wait for it
    if (this.authenticationPromise) {
      console.log('⏳ Authentication already in progress, waiting...');
      return await this.authenticationPromise;
    }

    // Start new authentication
    console.log('🔄 Starting new authentication...');
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
      console.log('🔍 OdooClientService: Starting performAuthentication()...');
      
      // Route all calls through our Next.js API proxy with detailed logging
      const apiPath = `/api/odoo/web/session/authenticate`;
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: config.odoo.database,
          login: config.odoo.defaultUsername,
          password: config.odoo.defaultPassword
        }
      };
      
      console.log('🔍 OdooClientService: Making authentication request to:', apiPath);
      console.log('🔍 OdooClientService: Payload:', { ...payload, params: { ...payload.params, password: '***' } });
      
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
        console.error('❌ OdooClientService: Authentication error in response:', response.data.error);
        throw new Error(response.data.error.message || response.data.error.data?.message || 'Odoo Server Error');
      }
      
      // Check for uid in the auth result to confirm successful authentication
      if (authResult && authResult.uid) {
        console.log('✅ OdooClientService: Authentication successful, uid:', authResult.uid);
        this.isAuthenticated = true;
        
        const sessionInfo: SessionInfo = {
          uid: authResult.uid,
          username: authResult.username || authResult.login || config.odoo.defaultUsername,
          is_admin: authResult.is_admin || false,
          is_system: authResult.is_system || false,
          session_id: authResult.session_id || ''
        };
        
        // Cache the session info
        this.sessionInfo = sessionInfo;
        
        console.log('✅ OdooClientService: Session info created and cached:', { 
          ...sessionInfo, 
          session_id: sessionInfo.session_id ? 'PRESENT' : 'MISSING' 
        });
        return sessionInfo;
      } else {
        console.error('❌ OdooClientService: No uid found in authentication response');
        console.error('❌ OdooClientService: AuthResult:', authResult);
        throw new Error('Authentication failed: No user ID returned');
      }
    } catch (error: unknown) {
      console.error('❌ OdooClientService: Session authentication failed:', error);
      this.isAuthenticated = false;
      this.sessionInfo = null;
      throw error;
    }
  }  // Core Odoo method calling - optimized to reduce authentication calls
  async callOdooMethod(model: string, method: string, args: unknown[] = [], kwargs: Record<string, unknown> = {}): Promise<unknown> {
    try {
      console.log(`🔍 OdooClientService: Calling ${model}.${method} with args:`, args, 'kwargs:', kwargs);
      
      // Ensure we have an active session - this will use cached session if available
      const sessionInfo = await this.getSessionInfo();
      console.log(`✅ OdooClientService: Session info obtained, uid: ${sessionInfo.uid} (cached: ${this.sessionInfo ? 'yes' : 'no'})`);
      
      // Try the /jsonrpc endpoint which might work better
      const response = await this.call('/jsonrpc', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            config.odoo.database,
            sessionInfo.uid,
            config.odoo.defaultPassword, // Use the password for authentication
            model,
            method,
            args,
            kwargs
          ]
        },
        id: Date.now()
      });
        console.log(`📊 OdooClientService: ${model}.${method} response:`, response);
      return response;
    } catch (error) {
      console.error(`❌ Error calling Odoo method ${model}.${method}:`, error);
      
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
  }
  // Clear session cache (useful for logout or authentication errors)
  clearSessionCache(): void {
    console.log('🧹 Clearing session cache...');
    this.isAuthenticated = false;
    this.sessionInfo = null;
    this.authenticationPromise = null;
  }
  // Helper method to check if a model exists and user has access
  async checkModelAccess(modelName: string): Promise<boolean> {
    try {
      await this.callOdooMethod(modelName, 'search', [[]], { limit: 1 });
      return true;
    } catch (error) {
      console.warn(`Model ${modelName} not accessible:`, error);
      return false;
    }
  }

  // Dog Profile Management
  async getDogs(): Promise<Dog[]> {
    try {
      console.log("🐕 OdooClientService.getDogs(): Starting...");
      const response = await this.callOdooMethod('res.partner', 'search_read',
        [[["parent_id", "=", 3], ["function", "=", "Dog"]]],
        { fields: ["name", "comment", "id"] });
      
      console.log("🐕 OdooClientService.getDogs(): Raw response:", response);
        
      return (response as Record<string, unknown>[]).map((dog: Record<string, unknown>) => {try {
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
          } as Dog;        } catch (parseError: unknown) {
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
        }      });
      console.log("🐕 OdooClientService.getDogs(): Final processed dogs:", (response as Record<string, unknown>[]));
    } catch (error: unknown) {
      console.error("❌ OdooClientService.getDogs(): Error:", error);
      throw this.handleError(error);
    }
  }  // Training Plan Management
  async getTrainingPlans(): Promise<TrainingPlan[]> {
    try {
      console.log("📋 OdooClientService.getTrainingPlans(): Starting...");
      
      // First check if the project model is available
      const hasProjectAccess = await this.checkModelAccess('project.project');
      console.log("📋 Project model access:", hasProjectAccess);
      
      if (!hasProjectAccess) {
        console.log("⚠️ Project model not accessible, returning mock training plans");
        return this.getMockTrainingPlans();
      }

      const response = await this.callOdooMethod('project.project', 'search_read', 
        [], // Empty domain to get all projects
        {
          fields: ['id', 'name', 'partner_id', 'date_start', 'date', 'description', 'task_ids'],
          limit: 20
        });

      console.log("📋 OdooClientService.getTrainingPlans(): Raw response:", response);

      return (response as Record<string, unknown>[]).map((plan: Record<string, unknown>) => ({
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
    } catch (error: unknown) {
      console.error("❌ OdooClientService.getTrainingPlans(): Error:", error);
      return this.getMockTrainingPlans();
    }
  }

  private getMockTrainingPlans(): TrainingPlan[] {
    return [
      {
        id: 1,
        name: "Basic Obedience Training",
        partner_id: 3,
        date_start: "2024-01-15",
        date: "2024-03-15", 
        description: "Fundamental commands and behaviors for new dogs",
        progress: 65,
        task_ids: [1, 2, 3],
        tasks: []
      },
      {
        id: 2,
        name: "Advanced Behavioral Training", 
        partner_id: 3,
        date_start: "2024-02-01",
        date: "2024-04-01",
        description: "Advanced commands and problem behavior correction",
        progress: 45,
        task_ids: [4, 5, 6],
        tasks: []
      }
    ] as TrainingPlan[];
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
    try {
      // Check if project model is available
      const hasProjectAccess = await this.checkModelAccess('project.project');
      
      if (!hasProjectAccess) {
        console.log("⚠️ Project model not accessible, cannot create training plan");
        // Return a mock ID since we can't actually create the plan
        throw new Error("Training plan creation not available - project management module not installed");
      }

      const response = await this.callOdooMethod('project.project', 'create', [{
        name: planData.name,
        user_id: 3,
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
    });    const response = await this.callOdooMethod('res.partner', 'create', [{
      name: dogProfileData.name,
      parent_id: 3,
      function: 'Dog',
      comment: odooComment,
    }]);

    return response as number;
  }

  async registerUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ userId: number; partnerId: number; token: string }> {
    try {      const partnerResponse = await this.callOdooMethod('res.partner', 'create', [{
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        customer_rank: 1
      }]);
      const partnerId = partnerResponse as number;

      const portalGroupResponse = await this.callOdooMethod('res.groups', 'search_read',
        [[['name', '=', 'Portal']]],
        { fields: ['id'] });
      
      if (!Array.isArray(portalGroupResponse) || portalGroupResponse.length === 0) {
        throw new Error('Portal group not found in Odoo');
      }
      const portalGroupId = (portalGroupResponse[0] as { id: number }).id;

      const userResponse = await this.callOdooMethod('res.users', 'create', [{
        login: userData.email,
        password: userData.password,
        partner_id: partnerId,
        name: userData.name,
        groups_id: [[6, 0, [portalGroupId]]],        action_id: false,
        active: true
      }]);
      const userId = userResponse as number;

      const authResponse = await this.authenticate(userData.email, userData.password, config.odoo.database);

      return {
        partnerId,
        userId,
        token: (authResponse as { session_id: string }).session_id
      };
    } catch (error: unknown) {
      throw this.handleError(error);
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
