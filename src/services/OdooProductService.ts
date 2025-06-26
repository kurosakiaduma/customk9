import { OdooClientService } from '@/services/odoo/OdooClientService';

export interface OdooService {
    id: number;
    name: string;
    description: string;
    list_price: number;
    duration?: number;
    categ_id?: [number, string];
    image?: string;
}

export interface Service {
    id: number;
    name: string;
    description: string;
    duration: string;
    price: number;
    image: string;
}

export class OdooProductService {
    private odooClientService: OdooClientService;

    constructor(odooClientService: OdooClientService) {
        this.odooClientService = odooClientService;
    }

    async getTrainingServices(): Promise<Service[]> {
        try {
            console.log('🔍 Fetching training services from Odoo...');
            
            // Search for products/services that are training-related
            const result = await this.odooClientService.callOdooMethod(
                'product.template', 
                'search_read', 
                [[['sale_ok', '=', true], ['type', '=', 'service']]], 
                {
                    fields: [
                        'id', 
                        'name', 
                        'description',
                        'list_price',
                        'categ_id',
                    ],
                    limit: 20
                }
            );

            console.log('📦 Services fetched:', result);

            // Transform Odoo data to our Service interface
            return (result as OdooService[]).map((service: OdooService) => ({
                id: service.id,
                name: service.name || 'Training Service',
                description: service.description || 'Professional dog training service',
                duration: '60 minutes', // Default duration
                price: service.list_price || 5000,
                image: '/images/dog-placeholder.jpg'
            }));

        } catch (error) {
            console.error('❌ Error fetching services:', error);
            // Return fallback services
            return this.getFallbackServices();
        }
    }

    private getFallbackServices(): Service[] {
        return [
            {
                id: 1,
                name: 'Basic Obedience Training',
                description: 'One-on-one session focused on basic commands and behavior',
                duration: '60 minutes',
                price: 4500,
                image: '/images/dog-01.jpg'
            },
            {
                id: 2,
                name: 'Behavior Consultation',
                description: 'Assessment and plan for addressing specific behavior issues',
                duration: '120 minutes',
                price: 6000,
                image: '/images/dog-03.jpg'
            },
            {
                id: 3,
                name: 'Group Training Session',
                description: 'Group training for socialization and basic commands',
                duration: '90 minutes',
                price: 3000,
                image: '/images/dog-02.jpg'
            }
        ];
    }
}
