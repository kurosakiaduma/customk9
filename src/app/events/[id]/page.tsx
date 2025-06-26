"use client";

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { OdooEventService, Event } from '@/services/OdooEventService';
import ServiceFactory from '@/services/ServiceFactory';
import EventDetails from '../../components/events/EventDetails';

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const eventId = parseInt(params.id, 10);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const odooClientService = ServiceFactory.getInstance().getOdooClientService();
        const eventService = new OdooEventService(odooClientService);
        const fetchedEvent = await eventService.getEventById(eventId);
        
        if (!fetchedEvent) {
          notFound();
          return;
        }
        
        setEvent(fetchedEvent);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-600"></div>
    </div>;
  }

  if (error || !event) {
    return notFound();
  }

  return <EventDetails event={event} />;
}

