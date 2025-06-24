import axios, { AxiosInstance } from 'axios';
import { config } from '@/config/config'; // Import config
import { Dog, TrainingPlan, DogInfo, DogLifestyle, DogHistory, DogGoals } from '@/types/odoo'; // Import common Odoo types

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

export class OdooClientService {
  private client: AxiosInstance;

  constructor(config: OdooClientConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Important for browser to send/receive cookies
    });
  }

  // Generic method to call Odoo operations via the Next.js API proxy
  // This method will mimic the structure of the OdooServerService methods,
  // but it will send requests to the Next.js API route.
  async call(path: string, payload: any) {
    try {
      // The path here will be relative to the baseURL of this client (e.g., '/web/session/authenticate')
      // The API route will then combine this with its own base URL to call Odoo.
      const response = await this.client.post(path, payload);

      if (response.data.error) {
        // Propagate Odoo errors
        throw new Error(response.data.error.data.message || 'Odoo API Error');
      }
      return response.data.result;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // --- Client-side Specific Methods (calling the proxy) ---

  async authenticate(login: string, password: string, db: string) {
    return this.call('/web/session/authenticate', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        db,
        login,
        password
      }
    });
  }

  async destroySession() {
    return this.call('/web/session/destroy', {
      jsonrpc: '2.0',
      method: 'call'
    });
  }

  async getSessionInfo() {
    return this.call('/web/session/get_session_info', {
      jsonrpc: '2.0',
      method: 'call'
    });
  }

  async callOdooMethod(model: string, method: string, args: any[] = [], kwargs: any = {}) {
    return this.call('/web/dataset/call_kw', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model,
        method,
        args,
        kwargs
      }
    });
  }

  // Registration logic (creating partner and user via proxy)
  async registerUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ userId: number; partnerId: number; token: string }> {
    try {
      // 1. Create partner first
      const partnerResponse = await this.callOdooMethod('res.partner', 'create', [{
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        customer_rank: 1
      }]);
      const partnerId = partnerResponse;

      // 2. Get portal group ID (can be hardcoded or fetched via another Odoo call)
      // For simplicity, we'll assume a common portal group ID or fetch it once server-side if needed.
      // For now, let's assume `portalGroupId` could be fetched on server or part of config.
      // For the client, we'll simplify and assign a dummy or a known portal group ID.
      // A robust solution would fetch this via an API route on demand, or have it configurable.
      // For this step, we will make a direct call to get it through the proxy.
      const portalGroupResponse = await this.callOdooMethod('res.groups', 'search_read',
        [[['name', '=', 'Portal']]],
        { fields: ['id'] });
      
      if (!portalGroupResponse || portalGroupResponse.length === 0) {
        throw new Error('Portal group not found in Odoo');
      }
      const portalGroupId = portalGroupResponse[0].id;

      // 3. Create portal user directly using res.users model
      const userResponse = await this.callOdooMethod('res.users', 'create', [{
        login: userData.email,
        password: userData.password,
        partner_id: partnerId,
        name: userData.name,
        groups_id: [[6, 0, [portalGroupId]]], // Assign portal group
        action_id: false,
        active: true
      }]);
      const userId = userResponse;

      // 4. Authenticate as the new user to get their session (via proxy)
      const authResponse = await this.authenticate(userData.email, userData.password, config.odoo.database);

      return {
        partnerId,
        userId,
        token: authResponse.session_id
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Dog Profile Management
  async getDogs(): Promise<Dog[]> {
    try {
      const response = await this.callOdooMethod('res.partner', 'search_read',
        [[["parent_id", "=", 3], ["function", "=", "Dog"]]],
        { fields: ["name", "comment", "id"] });
      
      // Assume response parsing similar to OdooService.ts getDogs
      // For now, return as is, further transformation will happen in component or dedicated client method
      return response.map((dog: any) => {
        // Minimal transformation for type compatibility
        return {
          id: dog.id,
          name: dog.name,
          breed: dog.comment ? JSON.parse(dog.comment).dogInfo?.breed : 'Unknown',
          age: dog.comment ? JSON.parse(dog.comment).dogInfo?.age : 'Unknown',
          gender: dog.comment ? JSON.parse(dog.comment).dogInfo?.gender : 'Unknown',
          level: dog.comment ? JSON.parse(dog.comment).dogInfo?.level : 'Beginner',
          progress: dog.comment ? JSON.parse(dog.comment).dogInfo?.progress : 0,
          image: '/images/dog-placeholder.jpg', // Placeholder
          dogInfo: dog.comment ? JSON.parse(dog.comment).dogInfo : {},
          lifestyle: dog.comment ? JSON.parse(dog.comment).lifestyle : {},
          history: dog.comment ? JSON.parse(dog.comment).history : {},
          goals: dog.comment ? JSON.parse(dog.comment).goals : {},
          behaviorChecklist: dog.comment ? JSON.parse(dog.comment).behaviorChecklist : [],
        } as Dog; // Cast to Dog type
      });

    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Training Plan Management
  async getTrainingPlans(): Promise<TrainingPlan[]> {
    try {
      const response = await this.callOdooMethod('project.project', 'search_read', [], {
        fields: ['id', 'name', 'partner_id', 'date_start', 'date', 'description', 'progress', 'task_ids'],
      });

      // Assuming tasks need to be fetched separately if task_ids is just an array of IDs
      // For now, return basic plans, task fetching logic might need to be moved/simplified
      return response.map((plan: any) => ({
        id: plan.id,
        name: plan.name,
        partner_id: plan.partner_id ? plan.partner_id[0] : null,
        date_start: plan.date_start,
        date: plan.date,
        description: plan.description || '',
        progress: plan.progress || 0,
        task_ids: plan.task_ids || [],
        tasks: [], // Tasks will need to be fetched or processed separately if required for display
      })) as TrainingPlan[];

    } catch (error) {
      throw this.handleError(error);
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
    try {
      const response = await this.callOdooMethod('project.project', 'create', [{
        name: planData.name,
        user_id: 3, // Assuming a default user for now, or fetch from session
        date_start: planData.startDate,
        date: planData.endDate,
        description: planData.description,
      }]);
      const projectId = response;

      // Create tasks for the project
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
    } catch (error) {
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
    });

    const response = await this.callOdooMethod('res.partner', 'create', [{
      name: dogProfileData.name,
      // IMPORTANT: This parent_id should be dynamic based on the logged-in user's partner ID
      parent_id: 3,
      function: 'Dog',
      comment: odooComment,
    }]);

    return response;
  }

  private handleError(error: any) {
    if (error.response?.data?.error) {
      return new Error(error.response.data.error.data.message || 'Odoo server error (via proxy)');
    } else if (error.response) {
      return new Error(`Server error (via proxy): ${error.response.status}`);
    } else if (error.request) {
      return new Error('No response from proxy server');
    } else {
      return new Error(error.message || 'Error setting up request to proxy');
    }
  }
} 