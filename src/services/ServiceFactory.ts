import { OdooClientService } from './odoo/OdooClientService';
import { AuthService } from './auth/AuthService';

interface ServiceConfig {
  odoo: {
    baseUrl: string; // This will be the full Odoo URL for server-side
    database: string;
    apiKey?: string;
  };
  odooClient: { // New config for client-side Odoo service
    baseUrl: string; // This will be the relative path to the Next.js API route
  };
}

// Default configuration using environment variables
const defaultConfig: ServiceConfig = {
  odoo: {
    baseUrl: process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'https://erp.vuna.io',
    database: process.env.NEXT_PUBLIC_ODOO_DATABASE || 'Merican',
    apiKey: process.env.NEXT_PUBLIC_ODOO_API_KEY
  },
  odooClient: {
    baseUrl: '/api/odoo' // Frontend calls its own API routes
  }
};

class ServiceFactory {
  private static instance: ServiceFactory;
  private config: ServiceConfig;
  private odooClientService: OdooClientService; // Changed from odooService
  private authService: AuthService;

  private constructor(config: ServiceConfig) {
    this.config = config;
    // Initialize OdooClientService with the client-side base URL
    this.odooClientService = new OdooClientService(config.odooClient);
    this.authService = new AuthService(this.odooClientService); // AuthService now uses OdooClientService
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
    return this.odooClientService;
  }

  getAuthService(): AuthService {
    return this.authService;
  }
}

export default ServiceFactory; 