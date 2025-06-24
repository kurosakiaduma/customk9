import axios from 'axios';

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
    private baseUrl = 'https://erp.vuna.io';
    private sessionCookie: string = '';
    private readonly credentials = {
        db: 'Merican',
        login: 'sales@mericanltd.com',
        password: 'Qwerty@254'
    };

    constructor() {
        this.authenticate();
    }

    private async authenticate(): Promise<void> {
        try {
            const response = await axios.post(`${this.baseUrl}/web/session/authenticate`, {
                jsonrpc: '2.0',
                method: 'call',
                params: this.credentials
            });

            if (response.headers['set-cookie']) {
                this.sessionCookie = response.headers['set-cookie'][0];
            }
        } catch (error) {
            console.error('Authentication failed:', error);
            throw new Error('Failed to authenticate with Odoo');
        }
    }

    private async makeOdooRequest(method: string, params: any): Promise<any> {
        if (!this.sessionCookie) {
            await this.authenticate();
        }

        try {
            const response = await axios.post(`${this.baseUrl}/web/dataset/call_kw`, {
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    model: 'calendar.event',
                    method,
                    args: [],
                    kwargs: params
                }
            }, {
                headers: {
                    Cookie: this.sessionCookie
                }
            });

            return response.data.result;
        } catch (error) {
            console.error(`Odoo request failed (${method}):`, error);
            throw error;
        }
    }

    async getUpcomingAppointments(): Promise<CalendarEvent[]> {
        const today = new Date().toISOString().split('T')[0];
        
        try {
            const result = await this.makeOdooRequest('search_read', {
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
            });

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
            const result = await this.makeOdooRequest('create', {
                args: [eventData]
            });
            return result;
        } catch (error) {
            console.error('Failed to create booking:', error);
            throw error;
        }
    }

    private convertBookingToEvent(booking: BookingDetails): any {
        const duration = booking.type === 'individual' ? 1.0 : 1.5;
        const location = booking.type === 'individual' ? 'Training Room' : 'Training Hall';
        
        const description = `
Service: ${booking.service}
Dogs: ${booking.dogs.map(dog => `${dog.name}${dog.breed ? ` (${dog.breed})` : ''}`).join(', ')}
Training Focus: ${booking.service}
Terms Accepted: ${booking.termsAccepted ? 'Yes' : 'No'}
        `.trim();

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
        const events = await this.makeOdooRequest('search_read', {
            fields: ['start', 'stop'],
            domain: [
                ['start', '>=', `${date} 00:00:00`],
                ['start', '<=', `${date} 23:59:59`]
            ]
        });

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