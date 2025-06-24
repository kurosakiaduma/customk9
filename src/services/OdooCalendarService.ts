import { OdooClientService } from './odoo/OdooClientService';
import { config } from '@/config/config'; // Needed for db in client service calls, if any

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
    }

    async getUpcomingAppointments(): Promise<CalendarEvent[]> {
        const today = new Date().toISOString().split('T')[0];
        
        try {
            const result = await this.odooClientService.callOdooMethod(
                'calendar.event', 
                'search_read', 
                [],
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
                        'allday',
                        'attendee_ids',
                        'current_status'
                    ],
                    domain: [
                        ['start', '>=', today]
                    ],
                    order: 'start asc'
                }
            );

            // Transform the data to match our interface
            return result.map((event: any) => ({
                id: event.id,
                name: event.name,
                start: event.start,
                stop: event.stop,
                duration: event.duration || 1.0,
                location: event.location || 'CustomK9 Training Center',
                trainer_name: this.getTrainerName(event.partner_ids),
                dog_name: this.getDogNameFromDescription(event.description),
                dog_image: '/images/dog-placeholder.jpg', // Default image since we don't have direct access
                state: this.mapOdooStatus(event.current_status)
            }));
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
            throw error;
        }
    }

    private getTrainerName(partnerIds: number[]): string {
        // For now return a default name, in a real implementation we would fetch the partner name
        return 'Assigned Trainer';
    }

    private getDogNameFromDescription(description: string | false): string {
        if (!description) return 'Unknown Dog';
        
        // Try to extract dog name from description
        const dogMatch = description.match(/Dogs?: ([^,\n]+)/);
        return dogMatch ? dogMatch[1].trim() : 'Unknown Dog';
    }

    private mapOdooStatus(status: string): 'confirmed' | 'pending' | 'cancelled' {
        switch (status) {
            case 'accepted':
                return 'confirmed';
            case 'tentative':
                return 'pending';
            case 'declined':
                return 'cancelled';
            default:
                return 'pending';
        }
    }

    async createBooking(details: BookingDetails): Promise<number> {
        const eventData = this.convertBookingToEvent(details);
        
        try {
            const result = await this.odooClientService.callOdooMethod(
                'calendar.event',
                'create',
                [eventData]
            );
            return result;
        } catch (error) {
            console.error('Failed to create booking:', error);
            throw error;
        }
    }

    private convertBookingToEvent(booking: BookingDetails): any {
        const duration = booking.type === 'individual' ? 1.0 : 1.5;
        const location = booking.type === 'individual' ? 'Training Room' : 'Training Hall';
        
        const description = `\nService: ${booking.service}\nDogs: ${booking.dogs.map(dog => `${dog.name}${dog.breed ? ` (${dog.breed})` : ''}`).join(', ')}\nTraining Focus: ${booking.service}\nTerms Accepted: ${booking.termsAccepted ? 'Yes' : 'No'}\n        `.trim();

        return {
            name: `${booking.type === 'individual' ? 'Individual' : 'Group'} Training - ${booking.service}`,
            start: booking.dateTime.start,
            stop: booking.dateTime.stop,
            allday: false,
            partner_ids: [[6, 0, [3]]], // Default trainer ID
            location,
            description,
            duration
        };
    }

    async getAvailableSlots(date: string, type: 'individual' | 'group'): Promise<string[]> {
        const events = await this.odooClientService.callOdooMethod(
            'calendar.event',
            'search_read',
            [],
            {
                fields: ['start', 'stop'],
                domain: [
                    ['start', '>=', `${date} 00:00:00`],
                    ['start', '<=', `${date} 23:59:59`]
                ]
            }
        );
        
        // Generate available slots
        const workingHours = {
            start: 9, // 9 AM
            end: 17 // 5 PM
        };

        const duration = type === 'individual' ? 1 : 1.5;
        const slots: string[] = [];
        const bookedTimes = new Set(events.map((e: any) => e.start));

        for (let hour = workingHours.start; hour < workingHours.end; hour += duration) {
            const slotTime = `${date} ${String(Math.floor(hour)).padStart(2, '0')}:${String((hour % 1) * 60).padStart(2, '0')}:00`;
            if (!bookedTimes.has(slotTime)) {
                slots.push(slotTime);
            }
        }

        return slots;
    }
} 