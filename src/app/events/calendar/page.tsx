"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { OdooEventService, Event } from '@/services/OdooEventService';
import ServiceFactory from '@/services/ServiceFactory';

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
};

function getDaysInMonth(year: number, month: number, events: Event[]): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();
  
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  const days: CalendarDay[] = [];
  
  // Add days from previous month to fill the first week
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
  
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(prevYear, prevMonth, daysInPrevMonth - i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(date, events)
    });
  }
  
  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isToday = date.toDateString() === today.toDateString();
    
    days.push({
      date,
      isCurrentMonth: true,
      isToday,
      events: getEventsForDate(date, events)
    });
  }
  
  // Add days from next month to fill the last week
  const remainingDays = 42 - days.length; // 6 weeks * 7 days
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(nextYear, nextMonth, day);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(date, events)
    });
  }
  
  return days;
}

function getEventsForDate(date: Date, events: Event[]): Event[] {
  const dateString = date.toISOString().split('T')[0];
  return events.filter(event => {
    // Convert event date string to comparable format
    const eventDate = new Date(event.date);
    const eventDateString = eventDate.toISOString().split('T')[0];
    return eventDateString === dateString;
  });
}

export default function EventsCalendarPage() {
  const currentDate = new Date();
  const [viewDate, setViewDate] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const odooClientService = ServiceFactory.getInstance().getOdooClientService();
        const eventService = new OdooEventService(odooClientService);
        const fetchedEvents = await eventService.getUpcomingEvents();
        setEvents(fetchedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  
  const calendarDays = getDaysInMonth(viewDate.year, viewDate.month, events);
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const goToPreviousMonth = () => {
    setViewDate(prev => {
      const newMonth = prev.month - 1;
      const newYear = prev.year + (newMonth < 0 ? -1 : 0);
      return {
        year: newYear,
        month: newMonth < 0 ? 11 : newMonth,
      };
    });
  };
  
  const goToNextMonth = () => {
    setViewDate(prev => {
      const newMonth = prev.month + 1;
      const newYear = prev.year + (newMonth > 11 ? 1 : 0);
      return {
        year: newYear,
        month: newMonth > 11 ? 0 : newMonth,
      };
    });
  };
  
  const goToToday = () => {
    setViewDate({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Events</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Calendar Header */}
      <section className="pt-28 pb-10 bg-sky-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Events Calendar</h1>
              <p className="text-sky-100">Stay updated with our upcoming training events and workshops</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="flex-1 py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between p-6 bg-gray-50 border-b">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {monthNames[viewDate.month]} {viewDate.year}
                </h2>
                <button
                  onClick={goToToday}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Today
                </button>
              </div>
              
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 bg-gray-100 border-b">
              {weekdays.map((day) => (
                <div key={day} className="p-4 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0 ${
                    !day.isCurrentMonth ? 'bg-gray-50' : ''
                  } ${day.isToday ? 'bg-sky-50' : ''}`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    !day.isCurrentMonth ? 'text-gray-400' : day.isToday ? 'text-sky-600' : 'text-gray-900'
                  }`}>
                    {day.date.getDate()}
                  </div>
                  
                  {/* Events for this day */}
                  <div className="space-y-1">
                    {day.events.slice(0, 2).map((event) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className="block"
                      >
                        <div className="bg-sky-100 text-sky-800 px-2 py-1 rounded text-xs hover:bg-sky-200 transition-colors">
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-sky-600">{event.time}</div>
                        </div>
                      </Link>
                    ))}
                    
                    {/* Show "more" indicator if there are additional events */}
                    {day.events.length > 2 && (
                      <div className="text-xs text-gray-500 px-2">
                        +{day.events.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}