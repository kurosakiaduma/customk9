import { OdooClientService } from '@/services/odoo/OdooClientService';

export interface ScheduleItem {
  time: string;
  activity: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
  category: string;
  attending: number;
  featured: boolean;
  organizer?: string;
  price?: string;
  contact?: string;
  website?: string;
  schedule?: ScheduleItem[];
}

export class OdooEventService {
  private odooClientService: OdooClientService;

  constructor(odooClientService: OdooClientService) {
    this.odooClientService = odooClientService;
  }

  async getEvents(): Promise<Event[]> {
    try {
      console.log('🔍 Fetching events from Odoo calendar...');
      
      // Get calendar events that are public or group events
      const result = await this.odooClientService.callOdooMethod(
        'calendar.event', 
        'search_read', 
        [[['start', '>=', new Date().toISOString().split('T')[0]]]], 
        {
          fields: [
            'id', 
            'name', 
            'start', 
            'stop', 
            'location',
            'description',
            'partner_ids'
          ],
          order: 'start asc',
          limit: 20
        }
      );

      console.log('📅 Events fetched:', result);

      // Transform Odoo calendar events to Event interface
      return (result as any[]).map((event: any) => ({
        id: event.id,
        title: event.name || 'Training Event',
        date: new Date(event.start).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: new Date(event.start).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }) + ' - ' + new Date(event.stop).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        location: event.location || 'CustomK9 Training Center',
        image: '/images/dog-placeholder.jpg',
        description: event.description || 'Professional dog training event',
        category: 'Training',
        attending: Math.floor(Math.random() * 20) + 5, // Random for now
        featured: Math.random() > 0.7, // Random featured flag
        organizer: 'CustomK9 Training Team',
        price: 'KSh 2,500',
        contact: 'events@customk9.com',
        website: 'https://customk9.com/events'
      }));

    } catch (error) {
      console.error('❌ Error fetching events:', error);
      // Return fallback events
      return this.getFallbackEvents();
    }
  }

  async getEventById(id: number): Promise<Event | undefined> {
    const events = await this.getEvents();
    return events.find(event => event.id === id);
  }

  async getFeaturedEvents(): Promise<Event[]> {
    const events = await this.getEvents();
    return events.filter(event => event.featured);
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    const events = await this.getEvents();
    return events.filter(event => event.category === category);
  }

  async getUpcomingEvents(): Promise<Event[]> {
    return this.getEvents(); // Already filtered for upcoming in getEvents()
  }

  private getFallbackEvents(): Event[] {
    return [
      {
        id: 1,
        title: "Basic Dog Training Workshop",
        date: "July 15, 2025",
        time: "9:00 AM - 12:00 PM",
        location: "CustomK9 Training Center",
        image: "/images/dog-01.jpg",
        description: "Join us for a comprehensive basic dog training workshop. Learn essential commands and techniques for a well-behaved companion.",
        category: "Training",
        attending: 15,
        featured: true,
        organizer: "CustomK9 Training Team",
        price: "KSh 2,500",
        contact: "events@customk9.com",
        website: "https://customk9.com/events/basic-training"
      },
      {
        id: 2,
        title: "Puppy Socialization Event",
        date: "July 22, 2025",
        time: "2:00 PM - 4:00 PM",
        location: "Central Park",
        image: "/images/dog-02.jpg",
        description: "A fun socialization event for puppies under 6 months. Help your puppy develop confidence and social skills.",
        category: "Socialization",
        attending: 12,
        featured: false,
        organizer: "CustomK9 Training Team",
        price: "KSh 1,500",
        contact: "events@customk9.com",
        website: "https://customk9.com/events/puppy-social"
      }
    ];
  }
}
