import OdooClientService from '@/services/odoo/OdooClientService';

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
            console.log('🔧 Using domain:', [
                ['sale_ok', '=', true],
                ['type', '=', 'service'],
                ['categ_id.name', 'ilike', 'Training'],
                ['active', '=', true]
            ]);

            const domain: Array<[string, string, string | boolean]> = [
                ['sale_ok', '=', true],
                ['type', '=', 'service'],
                ['active', '=', true]
                // Temporarily removed category filter to see all services
            ];

            // Request basic fields that should always be available
            const fields = [
                'id',
                'name',
                'list_price',
                'categ_id'
            ];
            const limit = 20;

            console.log('🔧 Requesting fields:', fields);

            const result = await this.odooClientService.searchRead(
                'product.template',
                domain,
                fields,
                limit
            );

            console.log('📦 Raw services from Odoo:', result);
            console.log('📊 Number of services found:', result.length);

            // Transform Odoo data to our Service interface
            const services = await Promise.all((result as OdooService[]).map(async (service: OdooService) => {
                // Try to get description from custom attribute
                let description = 'Professional dog training service';

                // If you have custom attributes, we can try to fetch them
                // For now, we'll use a mapping based on service names
                const descriptionMap: { [key: string]: string } = {
                    'Basic Obedience Training': 'One-on-one session focused on basic commands and behavior',
                    'Behavior Consultation': 'Assessment and plan for addressing specific behavior issues',
                    'Group Training Session': 'Group training for socialization and basic commands',
                    'Advanced Training': 'Advanced obedience and specialized training techniques',
                    'Puppy Training': 'Essential training for puppies 8 weeks to 6 months old'
                };

                if (service.name && descriptionMap[service.name]) {
                    description = descriptionMap[service.name];
                }

                // Duration mapping based on service type and price
                let duration = '60 minutes'; // Default
                if (service.list_price) {
                    if (service.list_price >= 6000) {
                        duration = '120 minutes'; // Higher priced services get more time
                    } else if (service.list_price <= 3000) {
                        duration = '90 minutes'; // Group sessions might be longer
                    }
                }

                // Service name-based duration mapping
                const durationMap: { [key: string]: string } = {
                    'Basic Obedience Training': '60 minutes',
                    'Behavior Consultation': '120 minutes',
                    'Group Training Session': '90 minutes',
                    'Advanced Training': '90 minutes',
                    'Puppy Training': '45 minutes'
                };

                if (service.name && durationMap[service.name]) {
                    duration = durationMap[service.name];
                }

                return {
                    id: service.id,
                    name: service.name || 'Training Service',
                    description: description,
                    duration: duration,
                    price: service.list_price || 5000,
                    image: '/images/dog-placeholder.jpg' // Default placeholder
                };
            }));

            return services;

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
