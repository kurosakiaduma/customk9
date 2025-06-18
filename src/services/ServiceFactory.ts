import { OdooService } from './odoo/OdooService';
import { AuthService } from './auth/AuthService';

interface ServiceConfig {
  odoo: {
    baseUrl: string;
    database: string;
    apiKey?: string;
  };
}

// Default configuration using environment variables
const defaultConfig: ServiceConfig = {
  odoo: {
    baseUrl: process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'http://localhost:8069',
    database: process.env.NEXT_PUBLIC_ODOO_DATABASE || 'customk9',
    apiKey: process.env.NEXT_PUBLIC_ODOO_API_KEY
  }
};

class ServiceFactory {
  private static instance: ServiceFactory;
  private config: ServiceConfig;
  private odooService: OdooService;
  private authService: AuthService;

  private constructor(config: ServiceConfig) {
    this.config = config;
    this.odooService = new OdooService(config.odoo);
    this.authService = new AuthService(this.odooService);
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

  getOdooService(): OdooService {
    return this.odooService;
  }

  getAuthService(): AuthService {
    return this.authService;
  }
}

export default ServiceFactory; 