# Appointment System Implementation Guide

## Overview
This guide details how to implement the appointment system for CustomK9, integrating with Odoo's calendar module. The system handles both individual and group training sessions.

## 1. Authentication Setup

```typescript
// src/services/odoo/auth.ts
export interface OdooAuthConfig {
  baseUrl: string;
  database: string;
  username?: string;
  password?: string;
}

export async function getOdooSession(config: OdooAuthConfig) {
  const response = await fetch(`${config.baseUrl}/web/session/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params: {
        db: config.database,
        login: config.username || 'sales@mericanltd.com',
        password: config.password || 'Qwerty@254'
      }
    }),
    credentials: 'include'
  });

  const data = await response.json();
  return data.result.session_id;
}
```

## 2. Odoo Service Implementation

```typescript
// src/services/odoo/OdooService.ts
import { getOdooSession, OdooAuthConfig } from './auth';

export class OdooService {
  private baseUrl: string;
  private database: string;
  private sessionId: string | null = null;

  constructor(config: OdooAuthConfig) {
    this.baseUrl = config.baseUrl;
    this.database = config.database;
  }

  private async ensureAuth() {
    if (!this.sessionId) {
      this.sessionId = await getOdooSession({
        baseUrl: this.baseUrl,
        database: this.database
      });
    }
  }

  private async makeRequest(endpoint: string, data: any) {
    await this.ensureAuth();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Openerp-Session-Id': this.sessionId!
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: data
      }),
      credentials: 'include'
    });

    const result = await response.json();
    if (result.error) {
      throw new Error(result.error.data.message || 'API Error');
    }
    return result.result;
  }

  // API Methods
  async getAllAppointments() {
    return this.makeRequest('/web/dataset/call_kw', {
      model: 'calendar.event',
      method: 'search_read',
      args: [[['privacy', 'in', ['public', 'private']]]],
      kwargs: {
        fields: [
          'id', 'name', 'start', 'stop', 'duration',
          'description', 'location', 'privacy', 'show_as',
          'allday', 'partner_ids', 'categ_ids', 'attendee_ids',
          'attendees_count', 'accepted_count', 'declined_count',
          'tentative_count'
        ]
      }
    });
  }

  async createAppointment(data: {
    name: string;
    start: string;
    stop: string;
    description?: string;
    location?: string;
    privacy: 'public' | 'private';
    partner_ids: number[];
  }) {
    return this.makeRequest('/web/dataset/call_kw', {
      model: 'calendar.event',
      method: 'create',
      args: [{
        ...data,
        show_as: 'busy',
        partner_ids: [[6, 0, data.partner_ids]]
      }],
      kwargs: {}
    });
  }

  async getEventAttendees(eventId: number) {
    return this.makeRequest('/web/dataset/call_kw', {
      model: 'calendar.attendee',
      method: 'search_read',
      args: [[['event_id', '=', eventId]]],
      kwargs: {
        fields: ['id', 'partner_id', 'email', 'state', 'event_id']
      }
    });
  }

  async updateAttendeeStatus(
    attendeeId: number,
    state: 'accepted' | 'declined' | 'tentative'
  ) {
    return this.makeRequest('/web/dataset/call_kw', {
      model: 'calendar.attendee',
      method: 'write',
      args: [[attendeeId], { state }],
      kwargs: {}
    });
  }
}
```

## 3. React Components Implementation

### Calendar Container Component
```typescript
// src/components/calendar/CalendarContainer.tsx
import { useState, useEffect } from 'react';
import { OdooService } from '@/services/odoo/OdooService';
import { CalendarView } from './CalendarView';
import { EventModal } from './EventModal';

export function CalendarContainer() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState<'individual' | 'group'>('individual');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const odooService = new OdooService({
        baseUrl: process.env.NEXT_PUBLIC_ODOO_URL!,
        database: 'Merican'
      });
      const events = await odooService.getAllAppointments();
      setEvents(events);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <div className="space-x-2">
          <button
            onClick={() => setView('individual')}
            className={`px-4 py-2 rounded ${
              view === 'individual' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Individual Training
          </button>
          <button
            onClick={() => setView('group')}
            className={`px-4 py-2 rounded ${
              view === 'group' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Group Training
          </button>
        </div>
      </div>

      <CalendarView
        events={events.filter(e => 
          view === 'individual' ? e.privacy === 'private' : e.privacy === 'public'
        )}
        onEventClick={setSelectedEvent}
      />

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onStatusUpdate={loadEvents}
        />
      )}
    </div>
  );
}
```

### Calendar View Component
```typescript
// src/components/calendar/CalendarView.tsx
import { format } from 'date-fns';

interface CalendarViewProps {
  events: any[];
  onEventClick: (event: any) => void;
}

export function CalendarView({ events, onEventClick }: CalendarViewProps) {
  // Calendar grid implementation
  // ... (Previous calendar grid implementation)
}
```

### Event Modal Component
```typescript
// src/components/calendar/EventModal.tsx
interface EventModalProps {
  event: any;
  onClose: () => void;
  onStatusUpdate: () => void;
}

export function EventModal({ event, onClose, onStatusUpdate }: EventModalProps) {
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    loadAttendees();
  }, [event.id]);

  const loadAttendees = async () => {
    const odooService = new OdooService({
      baseUrl: process.env.NEXT_PUBLIC_ODOO_URL!,
      database: 'Merican'
    });
    const attendees = await odooService.getEventAttendees(event.id);
    setAttendees(attendees);
  };

  const handleStatusUpdate = async (attendeeId: number, status: string) => {
    const odooService = new OdooService({
      baseUrl: process.env.NEXT_PUBLIC_ODOO_URL!,
      database: 'Merican'
    });
    await odooService.updateAttendeeStatus(attendeeId, status);
    await loadAttendees();
    onStatusUpdate();
  };

  // Modal UI implementation
  // ... (Previous modal implementation)
}
```

## 4. Environment Setup

Create a `.env.local` file:
```
NEXT_PUBLIC_ODOO_URL=https://erp.vuna.io
```

## 5. Usage Examples

### Creating an Individual Training Session
```typescript
const odooService = new OdooService({
  baseUrl: process.env.NEXT_PUBLIC_ODOO_URL!,
  database: 'Merican'
});

await odooService.createAppointment({
  name: 'Individual Training - Basic Obedience',
  start: '2024-03-20T10:00:00',
  stop: '2024-03-20T11:00:00',
  description: 'One-on-one training session',
  privacy: 'private',
  partner_ids: [trainerId, clientId]
});
```

### Creating a Group Training Session
```typescript
await odooService.createAppointment({
  name: 'Group Training - Puppy Socialization',
  start: '2024-03-21T14:00:00',
  stop: '2024-03-21T15:30:00',
  description: 'Group puppy training and socialization',
  privacy: 'public',
  partner_ids: [trainerId, ...clientIds]
});
```

## 6. Key Features

1. Separate views for Individual and Group training
2. Real-time calendar updates
3. Attendee management
4. Status tracking (accepted/declined/tentative)
5. Odoo integration
6. Error handling
7. Loading states

## 7. Best Practices

1. Always handle loading states
2. Implement proper error handling
3. Use TypeScript interfaces for type safety
4. Keep authentication state managed
5. Refresh data after updates
6. Use environment variables for configuration
7. Implement proper date formatting
8. Handle timezone differences

## 8. Testing

```typescript
// src/__tests__/calendar.test.ts
import { OdooService } from '@/services/odoo/OdooService';

describe('Calendar Service', () => {
  let service: OdooService;

  beforeEach(() => {
    service = new OdooService({
      baseUrl: process.env.NEXT_PUBLIC_ODOO_URL!,
      database: 'Merican'
    });
  });

  test('fetches appointments', async () => {
    const events = await service.getAllAppointments();
    expect(Array.isArray(events)).toBe(true);
  });

  test('creates appointment', async () => {
    const eventId = await service.createAppointment({
      name: 'Test Event',
      start: '2024-03-20T10:00:00',
      stop: '2024-03-20T11:00:00',
      privacy: 'private',
      partner_ids: [1, 2]
    });
    expect(typeof eventId).toBe('number');
  });
});
``` 