"use client";

import { notFound } from 'next/navigation';
import { getEventById } from '../../data/eventsData';
import EventDetails from '../../components/events/EventDetails';

export default function EventPage({ params }: any) {
  // Get the event by ID
  const eventId = parseInt(params.id, 10);
  const event = getEventById(eventId);
  
  // If the event doesn't exist, show a 404 page
  if (!event) {
    return notFound();
  }
  
  // Render the event details using the EventDetails component
  return <EventDetails event={event} />;
}

