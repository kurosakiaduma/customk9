import OdooClientService from './odoo/OdooClientService';
import { AuthService } from './auth/AuthService';
import { config } from '../config/config';

interface ServiceConfig {
  odoo: {
    baseUrl: string; // This will be the full Odoo URL for server-side
    database: string;
    apiKey?: string;
  };
  odooClient: { // New config for client-side Odoo service
    baseUrl: string; // This will be the relative path to the Next.js API route
    db: string; // Database name for the Odoo client
  };
}

// Default configuration using the config object
const defaultConfig: ServiceConfig = {
  odoo: {
    baseUrl: config.odoo.baseUrl,
    database: config.odoo.database,
    apiKey: process.env.NEXT_PUBLIC_ODOO_API_KEY
  },
  odooClient: {
    baseUrl: '/api/odoo', // Frontend calls its own API routes
    db: config.odoo.database // Use database name from config
  }
};

class ServiceFactory {
  private static instance: ServiceFactory;
  private config: ServiceConfig;
  private odooClientService: OdooClientService | null = null; 
  private authService: AuthService | null = null;

  private constructor(config: ServiceConfig) {
    this.config = config;
  }

  private initializeServices() {
    if (!this.odooClientService) {
      const proxyBaseURL = '/api/odoo';
      console.log(`Initializing OdooClientService with proxy baseURL: ${proxyBaseURL}`);
      this.odooClientService = new OdooClientService(proxyBaseURL);
    }

    if (!this.authService && this.odooClientService) {
      this.authService = new AuthService(this.odooClientService);
      // Now, inject the authService back into the odooClientService to break the circular dependency
      this.odooClientService.setAuthService(this.authService);
    }
  }

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      // Auto-initialize with default config if not initialized
      ServiceFactory.initialize(defaultConfig);
    }
    return ServiceFactory.instance;
  }

  static initialize(config: ServiceConfig): void {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory(config);
    }
  }

  // Rename this to be explicit about client-side use
  getOdooClientService(): OdooClientService {
    if (!this.odooClientService) {
      this.initializeServices();
    }
    return this.odooClientService!;
  }

  getAuthService(): AuthService {
    if (!this.authService) {
      this.initializeServices();
    }
    return this.authService!;
  }
}

export default ServiceFactory; 