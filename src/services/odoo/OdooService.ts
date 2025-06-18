import axios, { AxiosInstance } from 'axios';

interface OdooConfig {
  baseUrl: string;
  database: string;
  defaultUsername?: string;
  defaultPassword?: string;
}

export class OdooService {
  private client: AxiosInstance;
  private config: OdooConfig;
  private sessionId: string | null = null;

  constructor(config: OdooConfig) {
    this.config = config;
    // Use relative URL that will work with the proxy
    const baseURL = process.env.NODE_ENV === 'development' 
      ? '/odoo'  // This will be proxied through Next.js
      : config.baseUrl;
      
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true // Important for session cookie handling
    });
  }

  // Authentication
  async authenticate(login: string = this.config.defaultUsername || '', password: string = this.config.defaultPassword || '') {
    try {
      const response = await this.client.post('/web/session/authenticate', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: this.config.database,
          login,
          password
        }
      });

      if (response.data.error) {
        throw new Error(response.data.error.data.message || 'Authentication failed');
      }

      this.sessionId = response.data.result.session_id;
      
      // Update client headers with session id
      this.client.defaults.headers.common['X-Openerp-Session-Id'] = this.sessionId;

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
      const partner = await this.client.post('/web/dataset/call_kw/res.partner/create', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          args: [{
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            customer_rank: 1
          }],
          model: 'res.partner',
          method: 'create',
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
      const user = await this.client.post('/web/dataset/call_kw/res.users/create', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          args: [{
            login: userData.email,
            password: userData.password,
            partner_id: partner.data.result,
            name: userData.name,
            groups_id: [[6, 0, [portalGroupId]]], // Assign portal group
            action_id: false,
            active: true
          }],
          model: 'res.users',
          method: 'create',
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
      const response = await this.client.post('/web/dataset/call_kw/res.groups/search_read', {
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
  async createDogProfile(dogData: {
    name: string;
    breed: string;
    age: number;
    ownerId: number;
    trainingLevel: string;
    notes?: string;
  }) {
    try {
      const response = await this.client.post('/api/v1/customk9.dog', {
        data: {
          type: 'customk9.dog',
          attributes: {
            name: dogData.name,
            breed: dogData.breed,
            age: dogData.age,
            owner_id: dogData.ownerId,
            training_level: dogData.trainingLevel,
            notes: dogData.notes
          }
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDogs() {
    try {
      const response = await this.client.post('/web/dataset/call_kw/res.partner/search_read', {
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
      
      // Parse the dogs from the response
      const dogs = response.data.result.map((dog: any) => {
        let dogInfo = { breed: "", age: "", gender: "", level: "Beginner", progress: 0 };
        try {
          // Parse the comment field which contains the JSON data
          const commentData = JSON.parse(dog.comment.replace("<p>", "").replace("</p>", ""));
          if (commentData.dogInfo) {
            dogInfo = {
              breed: commentData.dogInfo.breed || "",
              age: commentData.dogInfo.age || "",
              gender: commentData.dogInfo.gender || "",
              level: commentData.dogInfo.trainingLevel || "Beginner",
              progress: commentData.dogInfo.progress || 0
            };
          }
        } catch (e) {
          console.error("Error parsing dog comment data:", e);
        }

        return {
          id: dog.id,
          name: dog.name,
          breed: dogInfo.breed,
          age: dogInfo.age,
          gender: dogInfo.gender,
          level: dogInfo.level,
          progress: dogInfo.progress,
          image: "/images/dog-placeholder.jpg" // Default image
        };
      });

      return dogs;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Training Plans
  async createTrainingPlan(planData: {
    name: string;
    dogId: number;
    startDate: string;
    endDate: string;
    objectives: string;
    exercises: Array<{
      name: string;
      description: string;
    }>;
  }) {
    try {
      const response = await this.client.post('/api/v1/customk9.training.plan', {
        data: {
          type: 'customk9.training.plan',
          attributes: {
            name: planData.name,
            dog_id: planData.dogId,
            start_date: planData.startDate,
            end_date: planData.endDate,
            objectives: planData.objectives
          },
          relationships: {
            exercises: {
              data: planData.exercises.map(exercise => ({
                type: 'customk9.training.exercise',
                attributes: {
                  name: exercise.name,
                  description: exercise.description,
                  completed: false
                }
              }))
            }
          }
        }
      });
      return response.data;
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
      const response = await this.client.post('/api/v1/calendar.event', {
        data: {
          type: 'calendar.event',
          attributes: {
            name: appointmentData.name,
            start: appointmentData.startTime,
            stop: appointmentData.endTime,
            partner_ids: [appointmentData.clientId, appointmentData.trainerId],
            description: appointmentData.description
          }
        }
      });
      return response.data;
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
      const response = await this.client.post('/api/v1/customk9.progress.note', {
        data: {
          type: 'customk9.progress.note',
          attributes: {
            dog_id: noteData.dogId,
            date: noteData.date,
            note: noteData.note,
            rating: noteData.rating
          }
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  private handleError(error: any) {
    if (error.response?.data?.error) {
      // Odoo error response
      return new Error(error.response.data.error.data.message || 'Odoo server error');
    } else if (error.response) {
      // HTTP error response
      return new Error(`Server error: ${error.response.status}`);
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server');
    } else {
      // Request setup error
      return new Error(error.message || 'Error setting up request');
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