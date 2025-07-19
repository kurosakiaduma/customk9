import axios, { AxiosInstance } from 'axios';
import {
  OdooSessionInfo,
  OdooUser,
  OdooUserContext,
  OdooError,
  ProjectTask,
  CalendarEvent,
  SubTask
} from './odoo.types';
import { AuthService } from "../auth/AuthService";
import { Dog } from '@/types/dog';

// Type definitions for Odoo
type OdooDomainItem = [string, string, string | number | boolean | null | false | undefined | (string | number | boolean | null | false | undefined)[]];
export type OdooDomain = (OdooDomainItem | string)[];

// Re-export types for convenience
export type { OdooUser, OdooError };

interface OdooJsonRpcResult<T> {
  jsonrpc: '2.0';
  id: number | null;
  result: T;
  error?: OdooError;
}

/**
 * OdooClientService is a stateless, low-level client for interacting with the Odoo API.
 * It is responsible for making API requests and handling Odoo-specific error formats.
 * It does NOT manage session state; that is the responsibility of AuthService.
 */
export default class OdooClientService {
  private authService!: AuthService;

  public setAuthService(authService: AuthService) {
    this.authService = authService;
  }

  private _client: AxiosInstance;

  constructor(baseURL: string) {
    this._client = axios.create({
      baseURL,
      withCredentials: true, // Ensures cookies (like HttpOnly session_id) are sent with requests
    });
  }

  /**
   * A generic error handler for Odoo API responses.
   */
  private handleError(error: unknown, context = 'Odoo API Error'): Error {
    if (axios.isAxiosError(error)) {
      const odooError = error.response?.data?.error as OdooError;
      if (odooError && odooError.message) {
        const errorMessage = odooError.data?.message || odooError.message;
        console.error(`[${context}] Odoo Error: ${errorMessage}`, odooError);
        return new Error(errorMessage);
      }
      console.error(`[${context}] HTTP Error: ${error.response?.status}`, error.message);
      return new Error(`HTTP Error: ${error.response?.statusText || 'Network error'}`);
    }
    if (error instanceof Error) {
      console.error(`[${context}] Error:`, error.message);
      return error;
    }
    console.error(`[${context}] Unknown Error:`, error);
    return new Error('An unknown error occurred.');
  }

  /**
   * Performs a JSON-RPC call using admin privileges.
   */
  private async jsonRpcAdmin<T>(endpoint: string, params: object): Promise<T> {
    const adminUsername = process.env.ODOO_ADMIN_USERNAME;
    const adminPassword = process.env.ODOO_ADMIN_PASSWORD;
    const db = process.env.ODOO_DB;

    if (!adminUsername || !adminPassword || !db) {
      throw new Error('Admin credentials or DB are not configured in environment variables.');
    }

    let adminSessionId: string | undefined;
    const tempClient = axios.create({ baseURL: this._client.defaults.baseURL });

    try {
      // 1. Authenticate as admin
      const authResponse = await tempClient.post<OdooJsonRpcResult<OdooSessionInfo>>('/web/session/authenticate', {
        jsonrpc: '2.0',
        method: 'call',
        params: { db, login: adminUsername, password: adminPassword },
        id: Math.floor(Math.random() * 1000000000),
      });

      if (authResponse.data.error) {
        throw this.handleError(authResponse.data.error, 'Admin authentication failed');
      }

      const adminCookie = authResponse.headers['set-cookie']?.find(c => c.startsWith('session_id'));
      if (!adminCookie) {
        throw new Error('Admin session cookie not found after authentication.');
      }
      adminSessionId = adminCookie.split(';')[0].split('=')[1];

      // 2. Execute the privileged call
      const response = await tempClient.post<OdooJsonRpcResult<T>>(endpoint, {
        jsonrpc: '2.0',
        method: 'call',
        params,
        id: Math.floor(Math.random() * 1000000000),
      }, { headers: { 'Cookie': `session_id=${adminSessionId}` } });

      if (response.data.error) {
        throw this.handleError(response.data.error, `Admin JSON-RPC call failed for ${endpoint}`);
      }

      return response.data.result;

    } catch (error) {
      throw this.handleError(error, `Admin JSON-RPC request failed for ${endpoint}`);
    } finally {
      // 3. Clean up the admin session
      if (adminSessionId) {
        try {
          await tempClient.post('/web/session/destroy', {
            jsonrpc: '2.0',
            method: 'call',
            params: {},
            id: Math.floor(Math.random() * 1000000000),
          }, { headers: { 'Cookie': `session_id=${adminSessionId}` } });
        } catch (e) {
          // Log cleanup error but don't throw, as the primary operation might have succeeded
          console.warn('Failed to destroy admin session. This is not critical but should be noted.', e);
        }
      }
    }
  }

  /**
   * Performs a JSON-RPC call to a specific Odoo endpoint.
   */
  private async jsonRpc<T>(endpoint: string, params: object): Promise<T> {
    try {
      const response = await this._client.post<OdooJsonRpcResult<T>>(endpoint, {
        jsonrpc: '2.0',
        method: 'call',
        params,
        id: Math.floor(Math.random() * 1000000000),
      });

      if (response.data.error) {
        throw this.handleError(response.data.error, `JSON-RPC call failed for ${endpoint}`);
      }

      return response.data.result;
    } catch (error) {
      throw this.handleError(error, `Request to ${endpoint} failed`);
    }
  }

  /**
   * Informs the Odoo server to destroy the current session.
   */
  public async clearSession(): Promise<void> {
    try {
      await this.jsonRpc('/web/session/destroy', {});
      console.log('Session destroyed successfully.');
    } catch {
      // This might fail if the session is already invalid, which is not a critical error.
      console.warn('Could not destroy session, it may have already expired.');
    }
  }

  /**
   * Authenticates with Odoo and returns the user session information.
   */
  public async login(db: string, login: string, password_param: string): Promise<OdooUser> {
    try {
      const result = await this.jsonRpc<OdooUser>('/web/session/authenticate', {
        db,
        login,
        password: password_param,
      });
      if (!result || !result.uid) {
        throw new Error('Authentication failed: No user ID returned.');
      }
      console.log(`[OdooClientService] User ${result.name} authenticated successfully.`);
      return result;
    } catch (error) {
      throw this.handleError(error, 'Login failed') as Error;
    }
  }

  /**
   * Retrieves session information from the Odoo server.
   */
  public async getSessionInfo(): Promise<OdooSessionInfo | null> {
    try {
      return await this.jsonRpc<OdooSessionInfo>('/web/session/get_session_info', {});
    } catch (err) {
      // This warning is expected if the user is not logged in.
      // We log the specific error for debugging but return null as the expected outcome.
      console.warn('Could not get session info, likely no active session.', err instanceof Error ? err.message : err);
      return null;
    }
  }

  /**
   * A generic method to call any model's method with arguments.
   */
  public async callOdooMethod<T>(model: string, method: string, args: unknown[] = [], kwargs: Record<string, unknown> = {}): Promise<T> {
    const params = {
      model,
      method,
      args,
      kwargs,
    };
    return this.jsonRpc<T>('/web/dataset/call_kw', params);
  }

  /**
   * Searches and reads data from a specific Odoo model.
   */
  public async searchRead<T>(
    model: string,
    domain: OdooDomain = [],
    fields: string[] = [],
    limit = 0,
    offset = 0,
    order = ''
  ): Promise<T[]> {
    const args = [domain, fields];
    const kwargs = {
      limit: limit || false,
      offset: offset || false,
      order: order || false,
    };

    // Odoo expects null/false for optional parameters, not 0 or ''
    if (!limit) delete (kwargs as Partial<typeof kwargs>).limit;
    if (!offset) delete (kwargs as Partial<typeof kwargs>).offset;
    if (!order) delete (kwargs as Partial<typeof kwargs>).order;

    return this.callOdooMethod<T[]>(model, 'search_read', args, kwargs);
  }

  /**
   * Fetches detailed user information by user ID.
   */
  public async getUser(uid: number): Promise<OdooUser | null> {
    try {
      const users = await this.searchRead<OdooUser>(
        'res.users',
        [['id', '=', uid]],
        ['id', 'name', 'login', 'partner_id', 'email', 'image_1920'],
        1
      );
      if (users.length > 0) {
        return users[0];
      }
      return null;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch user ${uid}`);
    }
  }

  /**
   * Fetches user tasks (training plans, etc.) by partner ID.
   */
  public async getUserTasks(partnerId: number): Promise<ProjectTask[]> {
    const domain: OdooDomain = [['partner_id', '=', partnerId]];
    return this.searchRead<ProjectTask>('project.task', domain);
  }

  /**
   * Fetches user calendar events (appointments) by partner ID.
   */
  public async getUserCalendar(partnerId: number): Promise<CalendarEvent[]> {
    const domain: OdooDomain = [['partner_ids', 'in', [partnerId]]];
    return this.searchRead<CalendarEvent>('calendar.event', domain);
  }

  /**
   * Fetches user dogs by partner ID.
   */
  public async getUserDogs(partnerId: number): Promise<Dog[]> {
    // Fetch all child contacts of the user, then filter for dogs
    // This approach is more inclusive and will find both old and new dogs
    const domain: OdooDomain = [
      ['parent_id', '=', partnerId],
      ['is_company', '=', false], // Only individual contacts, not companies
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
      'fear_description', 'notes', 'category_id',
    ];

    const allChildContacts = await this.searchRead<Dog>('res.partner', domain, fields);
    
    // Filter to identify dogs - they should have at least a breed or be categorized as 'Dog'
    const dogs = allChildContacts.filter(contact => {
      // Check if it has the 'Dog' category (for new dogs)
      const hasDogsCategory = contact.category_id && Array.isArray(contact.category_id) && 
        contact.category_id.some((cat: any) => 
          (typeof cat === 'object' && cat.name === 'Dog') || 
          (typeof cat === 'string' && cat.includes('Dog'))
        );
      
      // Check if it has dog-specific fields (for old dogs or dogs without category)
      const hasDogFields = contact.breed || contact.dog_source || contact.vet_clinic || 
                          contact.walk_frequency || contact.toy_types;
      
      return hasDogsCategory || hasDogFields;
    });

    console.log(`[getUserDogs] Found ${allChildContacts.length} child contacts, ${dogs.length} identified as dogs`);
    return dogs;
  }

  /**
   * Alias for backward compatibility.
   */
  public async getDogs(partnerId: number): Promise<Dog[]> {
    return this.getUserDogs(partnerId);
  }

  /**
   * [SERVER-SIDE ONLY] Creates a dog profile using admin privileges.
   * This method should only be called from a secure, server-side context.
   */
  public async _createDogProfileWithAdmin(partner_id: number, dogData: Partial<Dog>): Promise<number> {
    try {
      // First, get the ID for the 'Dog' category
      const dogCategory = await this.callOdooMethod<Array<{ id: number }>>(
        'res.partner.category',
        'search_read',
        [[['name', '=', 'Dog']], ['id']],
        { limit: 1 }
      );
      const dogCategoryId = dogCategory.length > 0 ? dogCategory[0].id : false;

      const newDogData: Record<string, unknown> = {
        ...dogData,
        parent_id: partner_id,
        // Use the correct category_id to classify this partner as a dog
        category_id: dogCategoryId ? [[6, 0, [dogCategoryId]]] : [],
      };

      const params = {
        model: 'res.partner',
        method: 'create',
        args: [newDogData],
        kwargs: {},
      };

      console.log('[OdooClientService] Creating dog profile with admin privileges on server.');
      // Use jsonRpcAdmin to ensure the call is made with admin rights
      return await this.jsonRpcAdmin<number>('/web/dataset/call_kw', params);

    } catch (error) {
      throw this.handleError(error, 'Failed to create dog profile with admin rights');
    }
  }

  /**
   * [CLIENT-SIDE] Creates a dog profile by calling the secure server-side API route.
   */
  public async createDogProfile(dogData: Partial<Dog>, partnerId: number): Promise<number> {
    console.log('[OdooClientService] Creating dog profile as a child contact.');
    try {
      // 1. Find or create the 'Dog' category ID.
      let dogCategoryId: number | undefined;

      try {
        const categories = await this.searchRead<{ id: number }>(
          'res.partner.category',
          [['name', '=', 'Dog']],
          ['id'],
          1
        );
        dogCategoryId = categories?.[0]?.id;
      } catch (error) {
        console.warn("[OdooClientService] Could not search for 'Dog' category, will create without category.");
      }

      // If no Dog category found, try to create one
      if (!dogCategoryId) {
        try {
          dogCategoryId = await this.callOdooMethod<number>(
            'res.partner.category',
            'create',
            [{ name: 'Dog', color: 2 }] // color 2 is typically blue
          );
          console.log(`[OdooClientService] Created 'Dog' category with ID: ${dogCategoryId}`);
        } catch (error) {
          console.warn("[OdooClientService] Could not create 'Dog' category, proceeding without it.");
        }
      }

      // 2. Prepare the data for the new res.partner record.
      // Remove the 'image' field since it doesn't exist, use image_1920 instead
      const { image, ...restOfDogData } = dogData;

      const newDogData: Record<string, unknown> = {
        ...restOfDogData,
        parent_id: partnerId, // Set the user as the parent
        is_company: false, // Ensure it's marked as an individual contact
        customer_rank: 0, // Not a customer
        supplier_rank: 0, // Not a supplier
      };

      // Use the correct image field name
      if (image && image !== '/images/dog-placeholder.jpg') {
        newDogData.image_1920 = image;
      }

      if (dogCategoryId) {
        // Odoo's many2many relation update format: (6, 0, [IDs]) replaces all with the new list.
        newDogData.category_id = [[6, 0, [dogCategoryId]]];
      }

      // 3. Create the new partner record.
      const newDogId = await this.callOdooMethod<number>(
        'res.partner',
        'create',
        [newDogData]
      );

      console.log(`[OdooClientService] Successfully created dog with ID: ${newDogId}`);
      return newDogId;

    } catch (error) {
      throw this.handleError(error, 'Failed to create dog profile');
    }
  }

  /**
   * Fetches training plans for a specific user.
   * Training plans are stored as 'project.task'.
   */
  public async getTrainingPlans(partnerId: number): Promise<ProjectTask[]> {
    const fields = [
      'id',
      'name',
      'description',
      'stage_id',
      'create_date',
      'date_deadline',
      'user_ids',
      'partner_id',
      'x_dog_id',
      'x_tasks_json',
    ];
    // Training plans are linked to the client's contact record (partner).
    const domain: OdooDomain = [['partner_id', '=', partnerId]];
    console.log(`Fetching training plans for partner ID: ${partnerId}`);
    console.log(`Domain: ${JSON.stringify(domain)}`);
    console.log(`Fields: ${JSON.stringify(fields)}`);
    const plans = await this.searchRead<ProjectTask>('project.task', domain, fields);
    console.log('[getTrainingPlans] Raw result from Odoo:', JSON.stringify(plans, null, 2));
    return plans;
  }

  /**
   * Fetches the tasks for a specific training plan.
   */
  public async getTrainingPlanTasks(planId: number): Promise<SubTask[]> {
    const fields = ['x_tasks_json'];
    const plan = await this.searchRead<ProjectTask>('project.task', [['id', '=', planId]], fields, 1);

    if (plan && plan.length > 0 && typeof plan[0].x_tasks_json === 'string' && plan[0].x_tasks_json.trim() !== '') {
      try {
        return JSON.parse(plan[0].x_tasks_json);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error('Error parsing tasks JSON:', errorMessage);
        return [];
      }
    }

    return [];
  }

  /**
   * Creates a new training plan.
   * Training plans are stored as 'project.task'.
   */
  public async createTrainingPlan(data: {
    name: string;
    x_dog_id: number;
    startDate: string;
    endDate: string;
    description?: string;
    tasks: { name: string; description: string }[];
  }): Promise<number> {
    const currentUser = await this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("Authentication error: Cannot create a plan without a user.");
    }

    console.log('[createTrainingPlan] Current user data:', currentUser);

    // Get the actual user ID from the session info
    const sessionInfo = await this.getSessionInfo();
    const userId = sessionInfo?.uid;
    
    console.log('[createTrainingPlan] Session info:', sessionInfo);
    console.log('[createTrainingPlan] User ID from session:', userId);

    if (!userId || typeof userId !== 'number') {
      throw new Error(`Invalid user ID from session: ${userId}. Cannot assign training plan to user.`);
    }

    const planData = {
      name: data.name,
      partner_id: currentUser.partnerId, // Associate with the owner
      x_dog_id: data.x_dog_id, // Corrected custom field for the dog
      create_date: data.startDate,
      date_deadline: data.endDate,
      description: data.description,
      x_tasks_json: JSON.stringify(data.tasks),
      // Use the user ID from session info instead of currentUser.id
      user_ids: [[6, 0, [userId]]], // Assign to the current user (many2many)
    };

    console.log('[createTrainingPlan] Creating plan with data:', planData);
    return this.callOdooMethod<number>('project.task', 'create', [planData]);
  }

  /**
   * Gets the current user by validating the session.
   * This method is critical for UI components to determine the logged-in user.
   */
  public async getCurrentUser(): Promise<OdooUser | null> {
    const sessionInfo = await this.getSessionInfo();
    if (sessionInfo?.uid) {
      return this.getUser(sessionInfo.uid);
    }
    return null;
  }

  /**
   * Returns a hardcoded guest partner ID.
   * In a real application, this might be fetched from configuration.
   */
  public getGuestPartnerId(): number {
    return 4; // Commonly, 'Public user' has partner_id 4 in Odoo
  }
}