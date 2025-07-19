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
      const dateStr = date.toISOString().split('T')[0];
      const domain = [
        ['start', '>=', `${dateStr} 00:00:00`],
        ['start', '<=', `${dateStr} 23:59:59`],
      ];
      const fields = ['start', 'stop'];

      const events = await this.odooClientService.searchRead<{ start: string; stop: string }>(
        'calendar.event',
        domain,
        fields
      );

      const startHour = 8; // 8:00 AM
      const endHour = 20; // 8:00 PM
      const slots: string[] = [];

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += duration) {
          const slotStartTime = new Date(`${dateStr}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
          const slotEndTime = new Date(slotStartTime.getTime() + duration * 60000);

          const isOverlapping = events.some(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.stop);
            return slotStartTime < eventEnd && slotEndTime > eventStart;
          });

          if (!isOverlapping) {
            slots.push(slotStartTime.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }));
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
      const domain = [
        '|',
        '&',
        ['start', '<', end],
        ['stop', '>', start],
        '&',
        ['start', '>=', start],
        ['stop', '<=', end],
      ];
      const events = await this.odooClientService.searchRead('calendar.event', domain, ['id']);
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
        const conflictDomain = [
          '|',
          '&',
          ['start', '<', dateTime.stop],
          ['stop', '>', dateTime.start],
          '&',
          ['start', '>=', dateTime.start],
          ['stop', '<=', dateTime.stop],
        ];
        const conflicts = await this.odooClientService.searchRead<{ id: number; start: string; stop: string }>(
          'calendar.event',
          conflictDomain,
          ['id', 'start', 'stop']
        );

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
      const createdEvent = await this.odooClientService.callOdooMethod<
        Array<{ id: number; start: string; stop: string }>
      >('calendar.event', 'read', [[bookingId]], { fields: ['id', 'start', 'stop'] });

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
