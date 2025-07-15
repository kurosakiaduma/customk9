import axios, { AxiosInstance } from 'axios';

interface OdooConfig {
  baseUrl: string;
  database: string;
  defaultUsername?: string;
  defaultPassword?: string;
}

interface DogInfo {
  breed: string;
  age: string;
  gender: string;
  level: string;
  progress: number;
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
}

interface DogLifestyle {
  homeAloneLocation: string;
  sleepLocation: string;
  hasCrate: string;
  likesCrate: string;
  crateLocation: string;
  chewsCrate: string;
  hoursAlone: string;
  foodBrand: string;
  feedingSchedule: string;
  foodLeftOut: string;
  allergies: string;
  toyTypes: string;
  toyPlayTime: string;
  toyStorage: string;
  walkFrequency: string;
  walkPerson: string;
  walkDuration: string;
  otherExercise: string;
  walkEquipment: string;
  offLeash: string;
  forestVisits: string;
  pulling: string;
  pullingPrevention: string;
}

interface DogHistory {
  previousTraining: string;
  growled: string;
  growlDetails: string;
  bitten: string;
  biteDetails: string;
  fearful: string;
  fearDetails: string;
  newPeopleResponse: string;
  groomingResponse: string;
  ignoreReaction: string;
  previousServices: string;
  toolsUsed: string;
}

interface DogGoals {
  trainingGoals: string;
  idealDogBehavior: string;
}

interface Dog {
  id: number | string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  level: string;
  progress: number;
  image: string;
  dogInfo: DogInfo;
  lifestyle: Partial<DogLifestyle>;
  history: Partial<DogHistory>;
  goals: Partial<DogGoals>;
  behaviorChecklist: string[];
  behaviorDetails?: string;
  undesirableBehavior?: string;
  fearDescription?: string;
  owner_id?: number | string;
  notes?: string;
}

interface TrainingPlan {
  id: number;
  name: string;
  partner_id: number;
  date_start: string;
  date: string;
  description: string;
  progress: number;
  task_ids: number[];
  tasks: Array<{
    id: number;
    name: string;
    description: string;
    stage_id: number;
    date_end?: string;
  }>;
}

export class OdooServerService {
  private client: AxiosInstance;
  private config: OdooConfig;
  private sessionId: string | null = null;

  constructor(config: OdooConfig) {
    this.config = config;
    
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      // withCredentials is not typically needed for server-to-server calls
      // as cookies will be managed manually via the session_id
    });
  }
  // Authentication
  async authenticate(login: string = this.config.defaultUsername || '', password: string = this.config.defaultPassword || '') {
    try {
      console.log('OdooServerService: Attempting authentication with:', {
        baseUrl: this.config.baseUrl,
        database: this.config.database,
        login: login,
        passwordLength: password.length
      });

      const response = await this.client.post('/web/session/authenticate', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: this.config.database,
          login,
          password
        }
      });

      console.log('OdooServerService: Authentication response:', {
        status: response.status,
        hasError: !!response.data.error,
        hasResult: !!response.data.result,
        error: response.data.error,
        result: response.data.result ? { ...response.data.result, session_id: 'REDACTED' } : null
      });

      if (response.data.error) {
        throw new Error(response.data.error.data.message || 'Authentication failed');
      }

      this.sessionId = response.data.result.session_id;
      
      // Odoo's default session cookie will be managed by axios if withCredentials is true,
      // but for server-side, it's safer to explicitly handle it.
      // For /web/dataset/call_kw, the session_id is often sufficient in X-Openerp-Session-Id header.
      this.client.defaults.headers.common['X-Openerp-Session-Id'] = this.sessionId; // Set for subsequent requests

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // New method for making generic Odoo JSON-RPC calls from the server side
  async callOdoo(path: string, payload: any, sessionId: string | null = null) {
    try {
      const headers: { [key: string]: string } = {
        'Content-Type': 'application/json',
      };
      if (sessionId) {
        // For server-side calls, Odoo typically expects the session ID in this header
        // if not relying on direct cookie management (which is harder server-side)
        headers['X-Openerp-Session-Id'] = sessionId;
      }

      const response = await this.client.post(path, payload, { headers });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // User Management
  async createUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) {
    try {
      console.log('Creating user with data:', { ...userData, password: '***' });
      
      // Ensure we have an active session
      if (!this.sessionId) {
        console.log('No active session, authenticating as admin...');
        await this.authenticate();
      }

      // Get portal group ID
      console.log('Fetching portal group ID...');
      const portalGroupId = await this.getPortalGroupId();
      console.log('Portal group ID:', portalGroupId);

      // Create partner first
      console.log('Creating partner...');
      const partner = await this.client.post('/web/dataset/call_kw', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'res.partner',
          method: 'create',
          args: [{
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            customer_rank: 1
          }],
          kwargs: {}
        }
      });

      if (partner.data.error) {
        console.error('Failed to create partner:', partner.data.error);
        throw new Error(partner.data.error.data.message || 'Failed to create partner');
      }

      console.log('Partner created successfully with ID:', partner.data.result);

      // Create portal user directly using res.users model
      console.log('Creating portal user...');
      const user = await this.client.post('/web/dataset/call_kw', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'res.users',
          method: 'create',
          args: [{
            login: userData.email,
            password: userData.password,
            partner_id: partner.data.result,
            name: userData.name,
            groups_id: [[6, 0, [portalGroupId]]], // Assign portal group
            action_id: false,
            active: true
          }],
          kwargs: {}
        }
      });

      if (user.data.error) {
        console.error('Failed to create portal user:', user.data.error);
        throw new Error(user.data.error.data.message || 'Failed to create user');
      }

      console.log('Portal user created successfully with ID:', user.data.result);

      // Authenticate as the new user to get their session
      console.log('Authenticating as new user...');
      const auth = await this.authenticate(userData.email, userData.password);

      console.log('User authenticated successfully');

      return {
        partnerId: partner.data.result,
        userId: user.data.result,
        token: auth.result.session_id
      };
    } catch (error) {
      console.error('Error in createUser:', error);
      throw this.handleError(error);
    }
  }

  // Helper method to get portal group ID
  private async getPortalGroupId(): Promise<number> {
    try {
      const response = await this.client.post('/web/dataset/call_kw', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'res.groups',
          method: 'search_read',
          args: [[['name', '=', 'Portal']]],
          kwargs: {
            fields: ['id']
          }
        }
      });

      if (response.data.error || !response.data.result?.length) {
        console.error('Failed to get portal group:', response.data.error || 'Group not found');
        throw new Error('Failed to get portal group ID');
      }

      return response.data.result[0].id;
    } catch (error) {
      console.error('Error getting portal group ID:', error);
      throw this.handleError(error);
    }
  }

  // Dog Profile Management
  /**
   * Creates a new dog profile as a child contact of the specified owner.
   * @param dog Dog profile data (rich structure)
   * @returns The new dog partner ID
   */
  async createDogProfile(dog: Partial<Dog> & { owner_id: number }): Promise<number> {
    try {
      // Prepare the comment field with all structured data
      const commentData = {
        dogInfo: dog.dogInfo || {
          breed: dog.breed,
          age: dog.age,
          gender: dog.gender,
          level: dog.level,
          progress: dog.progress,
          sterilized: (dog.dogInfo && dog.dogInfo.sterilized) || "",
          dogSource: (dog.dogInfo && dog.dogInfo.dogSource) || "",
          timeWithDog: (dog.dogInfo && dog.dogInfo.timeWithDog) || "",
          medications: (dog.dogInfo && dog.dogInfo.medications) || "",
          currentDeworming: (dog.dogInfo && dog.dogInfo.currentDeworming) || "",
          tickFleaPreventative: (dog.dogInfo && dog.dogInfo.tickFleaPreventative) || "",
          vetClinic: (dog.dogInfo && dog.dogInfo.vetClinic) || "",
          vetName: (dog.dogInfo && dog.dogInfo.vetName) || "",
          vetPhone: (dog.dogInfo && dog.dogInfo.vetPhone) || "",
          medicalIssues: (dog.dogInfo && dog.dogInfo.medicalIssues) || ""
        },
        lifestyle: dog.lifestyle || {},
        history: dog.history || {},
        goals: dog.goals || {},
        behaviorChecklist: dog.behaviorChecklist || [],
        behaviorDetails: dog.behaviorDetails || "",
        undesirableBehavior: dog.undesirableBehavior || "",
        fearDescription: dog.fearDescription || "",
        notes: dog.notes || ""
      };

      // Create the dog profile using the res.partner model
      const response = await this.client.post('/web/dataset/call_kw', {
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "res.partner",
          method: "create",
          args: [{
            name: dog.name,
            parent_id: dog.owner_id, // Owner's partner ID
            type: "contact",
            function: "Dog",
            comment: JSON.stringify(commentData)
          }],
          kwargs: {}
        }
      });

      if (response.data.error) {
        throw new Error(response.data.error.data.message || 'Failed to create dog profile');
      }

      return response.data.result;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDogs(): Promise<Dog[]> {
    try {
      console.log("Fetching dogs from Odoo...");
      const response = await this.client.post('/web/dataset/call_kw', {
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "res.partner",
          method: "search_read",
          args: [[["parent_id", "=", 3], ["function", "=", "Dog"]]],
          kwargs: {
            fields: ["name", "comment", "id"]
          }
        }
      });
      
      console.log("Raw response from Odoo:", response.data.result);
      
      // Parse the dogs from the response
      const dogs = response.data.result.map((dog: any) => {
        console.log(`Processing dog ${dog.name}, comment:`, dog.comment);
        
        const defaultDogInfo: DogInfo = {
          breed: "",
          age: "",
          gender: "",
          level: "Beginner",
          progress: 0,
          sterilized: "N",
          dogSource: "",
          timeWithDog: "",
          medications: "",
          currentDeworming: "N",
          tickFleaPreventative: "",
          vetClinic: "",
          vetName: "",
          vetPhone: "",
          medicalIssues: ""
        };
        
        let dogInfo: DogInfo = { ...defaultDogInfo };
        let lifestyle: Partial<DogLifestyle> = {};
        let history: Partial<DogHistory> = {};
        let goals: Partial<DogGoals> = {};
        let behaviorChecklist: string[] = [];
        
        if (typeof dog.comment === 'string' && dog.comment.trim()) {
          try {
            // Clean up the comment field - remove HTML tags and decode HTML entities
            let cleanComment = dog.comment.trim()
              .replace(/<[^>]*>/g, '') // Remove HTML tags
              .replace(/&quot;/g, '"')  // Replace HTML quotes
              .replace(/&amp;/g, '&')   // Replace HTML ampersands
              .replace(/&lt;/g, '<')    // Replace HTML less than
              .replace(/&gt;/g, '>')    // Replace HTML greater than
              .replace(/\\"/g, '"')     // Replace escaped quotes
              .replace(/\\/g, '')      // Remove remaining backslashes
              .trim();

            // Try to find the start of the JSON object
            const jsonStart = cleanComment.indexOf('{');
            if (jsonStart !== -1) {
              cleanComment = cleanComment.substring(jsonStart);
            }

            console.log("Cleaned comment:", cleanComment);

            // Try to parse the comment field as JSON
            const commentData = JSON.parse(cleanComment);
            console.log("Successfully parsed comment JSON:", commentData);
            
            if (commentData && typeof commentData === 'object') {
              // Extract dogInfo
              if (commentData.dogInfo) {
                console.log("Found dogInfo:", commentData.dogInfo);
                dogInfo = {
                  ...defaultDogInfo,
                  ...commentData.dogInfo,
                  level: commentData.dogInfo.trainingLevel || "Beginner",
                  progress: commentData.dogInfo.progress || 0
                };
              }

              // Extract lifestyle data
              if (commentData.lifestyle) {
                console.log("Found lifestyle data:", commentData.lifestyle);
                lifestyle = {
                  homeAloneLocation: commentData.lifestyle.homeAloneLocation || "",
                  sleepLocation: commentData.lifestyle.sleepLocation || "",
                  hasCrate: commentData.lifestyle.hasCrate || "N",
                  likesCrate: commentData.lifestyle.likesCrate || "N",
                  crateLocation: commentData.lifestyle.crateLocation || "",
                  chewsCrate: commentData.lifestyle.chewsCrate || "N",
                  hoursAlone: commentData.lifestyle.hoursAlone || "",
                  foodBrand: commentData.lifestyle.foodBrand || "",
                  feedingSchedule: commentData.lifestyle.feedingSchedule || "",
                  foodLeftOut: commentData.lifestyle.foodLeftOut || "N",
                  allergies: commentData.lifestyle.allergies || "",
                  toyTypes: commentData.lifestyle.toyTypes || "",
                  toyPlayTime: commentData.lifestyle.toyPlayTime || "",
                  toyStorage: commentData.lifestyle.toyStorage || "",
                  walkFrequency: commentData.lifestyle.walkFrequency || "",
                  walkPerson: commentData.lifestyle.walkPerson || "",
                  walkDuration: commentData.lifestyle.walkDuration || "",
                  otherExercise: commentData.lifestyle.otherExercise || "",
                  walkEquipment: commentData.lifestyle.walkEquipment || "",
                  offLeash: commentData.lifestyle.offLeash || "N",
                  forestVisits: commentData.lifestyle.forestVisits || "",
                  pulling: commentData.lifestyle.pulling || "N",
                  pullingPrevention: commentData.lifestyle.pullingPrevention || ""
                };
              }

              // Extract history data
              if (commentData.history) {
                console.log("Found history data:", commentData.history);
                history = {
                  previousTraining: commentData.history.previousTraining || "",
                  growled: commentData.history.growled || "N",
                  growlDetails: commentData.history.growlDetails || "",
                  bitten: commentData.history.bitten || "N",
                  biteDetails: commentData.history.biteDetails || "",
                  fearful: commentData.history.fearful || "N",
                  fearDetails: commentData.history.fearDetails || "",
                  newPeopleResponse: commentData.history.newPeopleResponse || "",
                  groomingResponse: commentData.history.groomingResponse || "",
                  ignoreReaction: commentData.history.ignoreReaction || "",
                  previousServices: commentData.history.previousServices || "",
                  toolsUsed: commentData.history.toolsUsed || ""
                };
              }

              // Extract goals and behavior data
              if (commentData.goals) {
                console.log("Found goals data:", commentData.goals);
                goals = {
                  trainingGoals: commentData.goals.trainingGoals || "",
                  idealDogBehavior: commentData.goals.idealDogBehavior || ""
                };
              }

              if (Array.isArray(commentData.behaviorChecklist)) {
                console.log("Found behavior checklist:", commentData.behaviorChecklist);
                behaviorChecklist = commentData.behaviorChecklist;
              }
            }
          } catch (e) {
            // If JSON parsing fails, log warning and keep default values
            console.error("Failed to parse dog comment as JSON:", e, "\nRaw comment:", dog.comment);
          }
        } else {
          console.warn("Dog comment is empty or not a string:", dog.comment);
        }

        const dogData: Dog = {
          id: dog.id,
          name: dog.name,
          breed: dogInfo.breed,
          age: dogInfo.age,
          gender: dogInfo.gender,
          level: dogInfo.level,
          progress: dogInfo.progress,
          image: "/images/dog-placeholder.jpg",
          dogInfo,
          lifestyle,
          history,
          goals,
          behaviorChecklist
        };

        console.log("Final processed dog data:", dogData);
        return dogData;
      });

      return dogs;
    } catch (error) {
      console.error("Error fetching dogs:", error);
      throw this.handleError(error);
    }
  }

  // Training Plans
  async getTrainingPlans(): Promise<TrainingPlan[]> {
    try {
      // Get all training plans (projects)
      const response = await this.client.post('/web/dataset/call_kw', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'project.project',
          method: 'search_read',
          args: [[['partner_id', '!=', false]]],
          kwargs: {
            fields: ['id', 'name', 'partner_id', 'date_start', 'date', 'description', 'task_ids']
          }
        }
      });

      if (response.data.error) {
        throw new Error(response.data.error.data.message || 'Failed to fetch training plans');
      }

      const plans = response.data.result;

      // Get tasks for each plan
      const plansWithTasks = await Promise.all(plans.map(async (plan: any) => {
        const taskResponse = await this.client.post('/web/dataset/call_kw', {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'project.task',
            method: 'search_read',
            args: [[['id', 'in', plan.task_ids]]],
            kwargs: {
              fields: ['id', 'name', 'description', 'stage_id', 'date_end']
            }
          }
        });

        return {
          ...plan,
          tasks: taskResponse.data.result || []
        };
      }));

      return plansWithTasks;
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
      const response = await this.client.post('/web/dataset/call_kw', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'project.project',
          method: 'create',
          args: [{
            name: planData.name,
            partner_id: planData.dogId,
            date_start: planData.startDate,
            date: planData.endDate,
            description: planData.description,
            task_ids: planData.tasks.map(task => [0, 0, {
              name: task.name,
              description: task.description
            }])
          }],
          kwargs: {}
        }
      });

      if (response.data.error) {
        throw new Error(response.data.error.data.message || 'Failed to create training plan');
      }

      return response.data.result;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTaskStatus(taskId: number, completed: boolean): Promise<void> {
    try {
      const response = await this.client.post('/web/dataset/call_kw', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'project.task',
          method: 'write',
          args: [[taskId], {
            stage_id: completed ? 4 : 1, // 4 = Done, 1 = To Do
            date_end: completed ? new Date().toISOString().split('T')[0] : false
          }],
          kwargs: {}
        }
      });

      if (response.data.error) {
        throw new Error(response.data.error.data.message || 'Failed to update task status');
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Appointments
  async createAppointment(appointmentData: {
    name: string;
    startTime: string;
    endTime: string;
    clientId: number;
    trainerId: number;
    description?: string;
  }) {
    try {
      const response = await this.client.post('/web/dataset/call_kw', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'calendar.event',
          method: 'create',
          args: [{
            name: appointmentData.name,
            start: appointmentData.startTime,
            stop: appointmentData.endTime,
            partner_ids: [[6, 0, [appointmentData.clientId, appointmentData.trainerId]]], // Many2many record command
            description: appointmentData.description
          }],
          kwargs: {}
        }
      });
      if (response.data.error) {
        throw new Error(response.data.error.data.message || 'Failed to create appointment');
      }
      return response.data.result;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Progress Tracking
  async createProgressNote(noteData: {
    dogId: number;
    date: string;
    note: string;
    rating: number;
  }) {
    try {
      const response = await this.client.post('/web/dataset/call_kw', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'customk9.progress.note',
          method: 'create',
          args: [{
            dog_id: noteData.dogId,
            date: noteData.date,
            note: noteData.note,
            rating: noteData.rating
          }],
          kwargs: {}
        }
      });
      if (response.data.error) {
        throw new Error(response.data.error.data.message || 'Failed to create progress note');
      }
      return response.data.result;
    } catch (error) {
      throw this.handleError(error);
    }
  }  // Error handling
  private handleError(error: unknown) {
    const err = error as {
      message?: string;
      response?: {
        status?: number;
        statusText?: string;
        data?: unknown;
        headers?: unknown;
      };
      request?: unknown;
      config?: {
        url?: string;
        method?: string;
        baseURL?: string;
      };
      code?: string;
    };

    console.error('OdooServerService Error Details:', {
      message: err.message,
      response: {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers
      },
      request: {
        url: err.config?.url,
        method: err.config?.method,
        baseURL: err.config?.baseURL
      },
      code: err.code
    });

    if (err.response?.data && typeof err.response.data === 'object' && err.response.data !== null && 'error' in err.response.data) {
      const odooError = err.response.data as { error: { data: { message?: string } } };
      return new Error(odooError.error.data.message || 'Odoo server error');
    } else if (err.response) {
      // HTTP error response
      return new Error(`Server error: ${err.response.status} - ${err.response.statusText}`);
    } else if (err.request) {
      // Request made but no response
      return new Error('No response from server');
    } else {
      // Request setup error
      return new Error(err.message || 'Error setting up request');
    }
  }

  // Session management
  async checkSession() {
    try {
      const response = await this.client.post('/web/session/get_session_info', {
        jsonrpc: '2.0',
        method: 'call'
      });

      if (response.data.result && response.data.result.uid) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // Logout
  async logout() {
    try {
      await this.client.post('/web/session/destroy', {
        jsonrpc: '2.0',
        method: 'call'
      });
      this.sessionId = null;
      delete this.client.defaults.headers.common['X-Openerp-Session-Id'];
    } catch (error) {
      throw this.handleError(error);
    }
  }
} 