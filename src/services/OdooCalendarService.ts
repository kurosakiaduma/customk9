import OdooClientService from '@/services/odoo/OdooClientService';

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

    // Test calendar connectivity
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
    }   
    
    async getUpcomingAppointments(): Promise<CalendarEvent[]> {
        let currentUser = this.odooClientService.getCurrentUser();
        if (!currentUser) {
            // Try to restore session (works on client-side)
            if (typeof window !== 'undefined' && this.odooClientService.getCurrentUser()) {
                currentUser = await this.odooClientService.getCurrentUser();
            }
        }
        if (!currentUser) {
            console.error('❌ No current user found (even after session restore attempt)');
            return [];
        }

        try {
            console.log('🔍 Fetching calendar events for user:', currentUser.username);

            // Build date filters
            const now = new Date();
            const oneMonthFromNow = new Date();
            oneMonthFromNow.setMonth(now.getMonth() + 1);
            
            // FIXED: Construct domain filter properly for Odoo
            const domainFilter = [
                '&',
                '&',
                ['start', '>=', now.toISOString()],
                ['start', '<=', oneMonthFromNow.toISOString()],
                '|',
                ['partner_ids', 'in', [currentUser.partnerId || 0]],
                ['user_id', '=', currentUser.uid]
            ];

            console.log('🔍 Calendar domain filter (fixed):', domainFilter);

            const result = await this.odooClientService.callOdooMethod(
                'calendar.event',
                'search_read',
                [domainFilter], // Wrap domainFilter in array
                {
                    fields: [
                        'id', 'name', 'start', 'stop', 'duration', 'location',
                        'partner_ids', 'description', 'user_id'
                    ],
                    limit: 20,
                    order: 'start ASC'
                }
            );

            console.log('📅 Calendar events fetched:', result);
            
            // Use a type-safe mapping for Odoo event objects
            type OdooEvent = {
                id: number;
                name?: string;
                start: string;
                stop: string;
                duration?: number;
                location?: string;
                partner_ids?: number[];
                description?: string | false;
                user_id?: number;
            };
            
            const odooEvents = result as OdooEvent[];
            console.log(`📅 Found ${odooEvents.length} events for user ${currentUser.username}`);
            
            // Transform the data to match our interface
            return odooEvents.map((event) => ({
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
            }));
        } catch (error) {
            console.error('❌ Calendar model not accessible:', error);
            console.log('⚠️ Calendar access failed, returning empty array');
            return [];
        }
    }
    
    private getTrainerName(partnerIds?: number[]): string {
        // For now return a default name, in a real implementation we would fetch the partner name
        void partnerIds; // suppress unused warning
        return 'Assigned Trainer';
    }

    private getDogNameFromDescription(description: string | false | undefined): string {
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
            // Get current user info to link the appointment properly
            const currentUser = this.odooClientService.getCurrentUser();
            if (currentUser?.partnerId && currentUser?.uid) {
                // Always set the booking user as the event owner and participant
                eventData.partner_ids = [[6, 0, [currentUser.partnerId]]];
                eventData.user_id = currentUser.uid;
            }
            const result = await this.odooClientService.callOdooMethod(
                'calendar.event',
                'create',
                [eventData]
            );
            console.log('✅ Calendar event created with ID:', result);
            return result as number;
        } catch (error) {
            console.error('❌ Error creating booking:', error);
            throw new Error(`Failed to create appointment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private convertBookingToEvent(booking: BookingDetails): Record<string, unknown> {
        const duration = booking.type === 'individual' ? 1.0 : 1.5;
        const location = booking.type === 'individual' ? 'Training Room' : 'Training Hall';
        
        // Parse start as either ISO or 'YYYY-MM-DD h:mm AM/PM'
        let startDate: Date | null = null;
        if (booking.dateTime.start) {
            // Try ISO first
            startDate = new Date(booking.dateTime.start);
            if (isNaN(startDate.getTime())) {
                // Fallback: parse 'YYYY-MM-DD h:mm AM/PM'
                const match = booking.dateTime.start.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
                if (match) {
                    const [/* _ */, date, hourStr, minStr, ampm] = match;
                    let hour = parseInt(hourStr, 10);
                    const min = parseInt(minStr, 10);
                    if (ampm.toUpperCase() === 'PM' && hour < 12) hour += 12;
                    if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
                    startDate = new Date(`${date}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`);
                }
            }
        }
        
        if (!startDate || isNaN(startDate.getTime())) {
            throw new Error(`Invalid date format for appointment booking.\nstart: ${booking.dateTime.start}`);
        }
        
        // Compute stop by adding duration (in hours) to start
        const stopDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
        
        return {
            name: `${booking.service} - ${booking.type} session`,
            start: startDate.toISOString().replace('T', ' ').substring(0, 19),
            stop: stopDate.toISOString().replace('T', ' ').substring(0, 19),
            duration: duration,
            location: location,
            description: `Service: ${booking.service}\nDogs: ${booking.dogs.map(d => d.name).join(', ')}\nType: ${booking.type}`,
            allday: false,
            show_as: 'busy'
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
                [[
                    ['start', '>=', `${date} 00:00:00`],
                    ['start', '<=', `${date} 23:59:59`]
                ]],
                {
                    fields: ['start', 'stop']
                }
            );

            console.log('📅 Existing events for date:', events);

            // Extract booked times as 'h:mm AM/PM' for comparison
            const bookedTimes = new Set(
                (events as unknown[]).map((e) => {
                    const startStr = (e as { start: string }).start;
                    const time = new Date(startStr).toLocaleTimeString('en-US', {
                        hour: 'numeric', minute: '2-digit', hour12: true
                    });
                    return time;
                })
            );

            // Generate available slots in 'h:mm AM/PM' format
            const workingHours = { start: 9, end: 17 };
            const duration = type === 'individual' ? 1 : 1.5;
            const slots: string[] = [];
            for (let hour = workingHours.start; hour < workingHours.end; hour += duration) {
                const slotDate = new Date(`${date}T00:00:00`);
                slotDate.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
                const slotTime = slotDate.toLocaleTimeString('en-US', {
                    hour: 'numeric', minute: '2-digit', hour12: true
                });
                if (!bookedTimes.has(slotTime)) {
                    slots.push(slotTime);
                }
            }

            console.log('✅ Available slots:', slots);
            return slots;
        } catch (error) {
            console.error('❌ Error fetching available slots:', error);
            return this.getDefaultSlots(type);
        }
    }

    private getDefaultSlots(type: 'individual' | 'group'): string[] {
        const slots: string[] = [];
        const duration = type === 'individual' ? 1 : 1.5;
        for (let hour = 9; hour < 17; hour += duration) {
            const slotDate = new Date();
            slotDate.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
            const timeString = slotDate.toLocaleTimeString('en-US', {
                hour: 'numeric', minute: '2-digit', hour12: true
            });
            slots.push(timeString);
        }
        return slots;
    }
}