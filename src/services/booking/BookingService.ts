import { OdooCalendarService } from '../OdooCalendarService';
import OdooClientService from '../odoo/OdooClientService';

export interface BookingRequest {
  type: 'individual' | 'group';
  service: string;
  dateTime: {
    start: string;
    stop: string;
  };
  dogs: Array<{
    name: string;
    breed?: string;
  }>;
  termsAccepted: boolean;
}

export interface BookingResult {
  success: boolean;
  bookingId?: string;
  message: string;
  errorCode?: string;
  errorDetails?: unknown;
  conflictDetails?: Array<{
    id: number;
    start: string;
    stop: string;
  }>;
}

export interface BookingConflictError extends Error {
  name: 'BookingConflictError';
  type: 'CONFLICT';
  conflicts: Array<{
    id: number;
    start: string;
    stop: string;
  }>;
}

export class BookingService {
  private calendarService: OdooCalendarService;
  private odooClientService: OdooClientService;
  private pendingBookings: Set<string> = new Set();

  constructor(odooClientService: OdooClientService) {
    this.odooClientService = odooClientService;
    this.calendarService = new OdooCalendarService(odooClientService);
  }

  /**
   * Checks if a time slot is available for booking
   * @param start Start time in ISO format
   * @param end End time in ISO format
   * @returns Promise<boolean> True if the slot is available
   */
  /**
   * Fetches available time slots for a given date
   * @param date The date to fetch available slots for
   * @param duration Duration of each slot in minutes (default: 60)
   * @returns Promise<string[]> Array of available time slots in 'HH:MM AM/PM' format
   */
  async getAvailableTimeSlots(date: Date, duration: number = 60): Promise<string[]> {
    try {
      // Format the date to YYYY-MM-DD
      const dateStr = date.toISOString().split('T')[0];
      
      // Get all events for the day
      const events = await this.odooClientService.callOdooMethod(
        'calendar.event',
        'search_read',
        [[
          ['start', '>=', `${dateStr} 00:00:00`],
          ['start', '<=', `${dateStr} 23:59:59`]
        ],
        ['start', 'stop']
        ],
        {}
      ) as { start: string; stop: string }[];

      // Generate time slots for the day
      const startHour = 8; // Start generating slots from 8:00 AM
      const endHour = 20; // Stop generating slots at 8:00 PM
      const slots: string[] = [];

      // Check each hour interval
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += duration) {
          // Check if this slot conflicts with any existing events
          const isAvailable = !events.some((event: { start: string; stop: string }) => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.stop);
            
            // Convert slot times to Date objects
            const slotStartTime = new Date(dateStr);
            slotStartTime.setHours(hour, minute, 0);
            const slotEndTime = new Date(dateStr);
            slotEndTime.setHours(hour, minute + duration, 0);

            // Check for overlap
            return (
              (slotStartTime >= eventStart && slotStartTime < eventEnd) ||
              (slotEndTime > eventStart && slotEndTime <= eventEnd) ||
              (slotStartTime <= eventStart && slotEndTime >= eventEnd)
            );
          });

          if (isAvailable) {
            // Format time as HH:MM AM/PM
            const formattedStart = new Date(dateStr);
            formattedStart.setHours(hour, minute, 0);
            const formattedTime = formattedStart.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            });
            slots.push(formattedTime);
          }
        }
      }

      return slots;
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      return [];
    }
  }

  /**
   * Checks if a specific time slot is available
   * @param start Start time in ISO format
   * @param end End time in ISO format
   * @returns Promise<boolean> True if the slot is available
   */
  async isTimeSlotAvailable(start: string, end: string): Promise<boolean> {
    try {
      const events = await this.odooClientService.callOdooMethod(
        'calendar.event',
        'search_read',
        [[
          '|',
          '&',
          ['start', '<', end],
          ['start', '>=', start],
          '&',
          ['stop', '>', start],
          ['stop', '<=', end]
        ]],
        { fields: ['id', 'start', 'stop'] }
      ) as Array<{ id: number; start: string; stop: string }>;

      return events.length === 0;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }
  }

  /**
   * Creates a new booking with conflict detection
   * @param bookingData Booking details
   * @returns Promise<number> The ID of the created booking
   * @throws {BookingConflictError} If there's a scheduling conflict
   */
  async createBooking(bookingData: BookingRequest): Promise<number> {
    const { dateTime } = bookingData;
    const bookingKey = `${dateTime.start}-${dateTime.stop}`;

    // Prevent duplicate booking attempts
    if (this.pendingBookings.has(bookingKey)) {
      throw new Error('A booking request is already in progress for this time slot');
    }

    this.pendingBookings.add(bookingKey);

    try {
      // First, check for conflicts
      const isAvailable = await this.isTimeSlotAvailable(dateTime.start, dateTime.stop);
      
      if (!isAvailable) {
        // Get conflicting events for the error message
        const conflicts = await this.odooClientService.callOdooMethod(
          'calendar.event',
          'search_read',
          [[
            '|',
            '&',
            ['start', '<', dateTime.stop],
            ['start', '>=', dateTime.start],
            '&',
            ['stop', '>', dateTime.start],
            ['stop', '<=', dateTime.stop]
          ]],
          { fields: ['id', 'start', 'stop', 'name'] }
        ) as Array<{ id: number; start: string; stop: string; name: string }>;

        const error = new Error('The selected time slot is no longer available') as BookingConflictError;
        error.name = 'BookingConflictError';
        error.type = 'CONFLICT';
        error.conflicts = conflicts.map(event => ({
          id: event.id,
          start: event.start,
          stop: event.stop
        }));
        throw error;
      }

      // If we get here, the slot is available - create the booking
      const bookingId = await this.calendarService.createBooking(bookingData);
      
      // Verify the booking was created successfully
      const createdEvent = await this.odooClientService.callOdooMethod(
        'calendar.event',
        'read',
        [[bookingId], ['id', 'start', 'stop']]
      ) as Array<{ id: number; start: string; stop: string }>;

      if (!createdEvent || createdEvent.length === 0) {
        throw new Error('Failed to verify booking creation');
      }

      return bookingId;
    } finally {
      this.pendingBookings.delete(bookingKey);
    }
  }

  /**
   * Gets available time slots for a given date and booking type
   * @param date Date in YYYY-MM-DD format
   * @param type 'individual' or 'group'
   * @returns Promise<string[]> Array of available time slots in 'h:mm AM/PM' format
   */
  async getAvailableSlots(date: string, type: 'individual' | 'group'): Promise<string[]> {
    try {
      return await this.calendarService.getAvailableSlots(date, type);
    } catch (error) {
      console.error('Error getting available slots:', error);
      // Return empty array instead of default slots to prevent double-booking
      return [];
    }
  }
}
