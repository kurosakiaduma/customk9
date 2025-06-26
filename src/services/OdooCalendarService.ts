import { config } from '@/config/config';
import { OdooClientService } from '@/services/odoo/OdooClientService';

export interface CalendarEvent {
    id: number;
    name: string;
    start: string;
    stop: string;
    duration: number;
    location: string;
    trainer_name: string;
    dog_name: string;
    dog_image: string;
    state: 'confirmed' | 'pending' | 'cancelled';
}

export interface BookingDetails {
    type: 'individual' | 'group';
    service: string;
    dateTime: {
        start: string;
        stop: string;
    };
    dogs: {
        name: string;
        breed?: string;
    }[];
    termsAccepted: boolean;
}

export class OdooCalendarService {
    private odooClientService: OdooClientService;

    constructor(odooClientService: OdooClientService) {
        this.odooClientService = odooClientService;
    }    // Test calendar connectivity
    async testCalendarConnection(): Promise<boolean> {
        try {
            console.log('🔍 Testing calendar.event model access...');
            const result = await this.odooClientService.callOdooMethod(
                'calendar.event', 
                'search', 
                [[]], // Fix: domain should be empty array wrapped in array
                { limit: 1 }
            );
            console.log('✅ Calendar model accessible:', result);
            return true;
        } catch (error) {
            console.error('❌ Calendar model not accessible:', error);
            return false;
        }
    }    async getUpcomingAppointments(): Promise<CalendarEvent[]> {
        const today = new Date().toISOString().split('T')[0];
        
        try {
            console.log('🔍 Fetching calendar events from:', today);
            
            // Check if user is authenticated
            const currentUser = this.odooClientService.getCurrentUser();
            if (!currentUser) {
                console.log('⚠️ User not authenticated');
                return [];
            }
            
            // First test if we have access
            const hasAccess = await this.testCalendarConnection();
            if (!hasAccess) {
                console.log('⚠️ Calendar access failed, returning empty array');
                return [];
            }
            // Build user-specific filter
            const domainFilter: unknown[] = [['start', '>=', today]];
            
            // If not admin, filter by user's events only
            if (!currentUser.isAdmin && currentUser.partnerId) {
                domainFilter.push(['partner_ids', 'in', [currentUser.partnerId]]);
            }
            
            console.log('🔍 Calendar domain filter:', domainFilter);

            const result = await this.odooClientService.callOdooMethod(
                'calendar.event', 
                'search_read', 
                [domainFilter],
                {
                    fields: [
                        'id', 
                        'name', 
                        'start', 
                        'stop', 
                        'duration',
                        'location',
                        'partner_ids',
                        'description',
                        'allday'
                    ],
                    order: 'start asc',
                    limit: 10
                }
            );

            console.log('📅 Calendar events fetched:', result);
            console.log(`📅 Found ${(result as any[]).length} events for user ${currentUser.username}`);

            // Transform the data to match our interface
            return (result as any[]).map((event: any) => ({
                id: event.id,
                name: event.name || 'Training Session',
                start: event.start,
                stop: event.stop,
                duration: event.duration || 1.0,
                location: event.location || 'CustomK9 Training Center',
                trainer_name: this.getTrainerName(event.partner_ids),
                dog_name: this.getDogNameFromDescription(event.description),
                dog_image: '/images/dog-placeholder.jpg',
                state: 'confirmed' as const
            }));} catch (error) {
            console.error('❌ Failed to fetch appointments:', error);
            // Return empty array instead of mock data
            return [];
        }
    }    private getTrainerName(partnerIds: number[]): string {
        // For now return a default name, in a real implementation we would fetch the partner name
        return 'Assigned Trainer';
    }

    private getDogNameFromDescription(description: string | false): string {
        if (!description) return 'Training Dog';
        
        // Try to extract dog name from description
        const dogMatch = description.match(/Dogs?: ([^,\n]+)/);
        return dogMatch ? dogMatch[1].trim() : 'Training Dog';
    }

    private mapOdooStatus(status: string): 'confirmed' | 'pending' | 'cancelled' {
        switch (status) {
            case 'confirmed':
                return 'confirmed';
            case 'tentative':
                return 'pending';
            case 'cancelled':
                return 'cancelled';
            default:
                return 'confirmed';
        }
    }

    async createBooking(details: BookingDetails): Promise<number> {
        const eventData = this.convertBookingToEvent(details);
        
        try {
            console.log('📅 Creating calendar event:', eventData);
            
            // Check calendar access first
            const hasAccess = await this.testCalendarConnection();
            if (!hasAccess) {
                console.log('⚠️ Calendar not accessible, simulating booking creation');
                return Math.floor(Math.random() * 1000) + 100; // Return mock ID
            }

            const result = await this.odooClientService.callOdooMethod(
                'calendar.event',
                'create',
                [eventData]
            );

            console.log('✅ Calendar event created:', result);
            return result as number;
        } catch (error) {
            console.error('❌ Error creating booking:', error);
            throw error;
        }
    }

    private convertBookingToEvent(booking: BookingDetails): any {
        const duration = booking.type === 'individual' ? 1.0 : 1.5;
        const location = booking.type === 'individual' ? 'Training Room' : 'Training Hall';
        
        return {
            name: `${booking.service} - ${booking.type} session`,
            start: booking.dateTime.start,
            stop: booking.dateTime.stop,
            duration: duration,
            location: location,
            description: `Service: ${booking.service}\nDogs: ${booking.dogs.map(d => d.name).join(', ')}\nType: ${booking.type}`,
            allday: false
        };
    }

    async getAvailableSlots(date: string, type: 'individual' | 'group'): Promise<string[]> {
        try {
            console.log('🔍 Fetching available slots for:', date, type);
              // Check calendar access first
            const hasAccess = await this.testCalendarConnection();
            if (!hasAccess) {
                console.log('⚠️ Calendar not accessible, returning default slots');
                return this.getDefaultSlots(type);
            }
            
            const events = await this.odooClientService.callOdooMethod(
                'calendar.event',
                'search_read',
                [[  // Fix: wrap domain in array
                    ['start', '>=', `${date} 00:00:00`],
                    ['start', '<=', `${date} 23:59:59`]
                ]],
                {
                    fields: ['start', 'stop']
                }
            );
            
            console.log('📅 Existing events for date:', events);
            
            // Generate available slots
            const workingHours = { start: 9, end: 17 };
            const duration = type === 'individual' ? 1 : 1.5;
            const slots: string[] = [];
            const bookedTimes = new Set((events as any[]).map((e: any) => e.start));

            for (let hour = workingHours.start; hour < workingHours.end; hour += duration) {
                const slotTime = `${date} ${String(Math.floor(hour)).padStart(2, '0')}:${String((hour % 1) * 60).padStart(2, '0')}:00`;
                if (!bookedTimes.has(slotTime)) {
                    slots.push(slotTime);
                }
            }

            console.log('✅ Available slots:', slots);
            return slots;        } catch (error) {
            console.error('❌ Error fetching available slots:', error);
            return this.getDefaultSlots(type);
        }
    }    private getDefaultSlots(type: 'individual' | 'group'): string[] {
        const slots: string[] = [];
        const duration = type === 'individual' ? 1 : 1.5;
        
        // Generate time slots for standard working hours
        for (let hour = 9; hour < 17; hour += duration) {
            const timeString = `${String(Math.floor(hour)).padStart(2, '0')}:${String((hour % 1) * 60).padStart(2, '0')}`;
            slots.push(timeString);
        }
        
        return slots;
    }
}