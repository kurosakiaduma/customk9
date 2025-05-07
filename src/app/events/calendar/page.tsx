"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// This would typically be fetched from an API or CMS
const eventsData = [
  {
    id: 1,
    title: "Annual Dog Show Competition",
    date: "2023-08-15",
    time: "9:00 AM - 4:00 PM",
    location: "Nairobi Arboretum",
    image: "/images/events/dog-show.jpg",
    category: "Competition",
  },
  {
    id: 2,
    title: "Puppy Socialization Workshop",
    date: "2023-09-05",
    time: "10:00 AM - 12:00 PM",
    location: "CustomK9 Training Center",
    image: "/images/events/puppy-workshop.jpg",
    category: "Workshop",
  },
  {
    id: 3,
    title: "Agility Course Open Day",
    date: "2023-09-20",
    time: "2:00 PM - 5:00 PM",
    location: "Karura Forest Dog Park",
    image: "/images/events/agility-course.jpg",
    category: "Open Day",
  },
  {
    id: 4,
    title: "Dog First Aid Training",
    date: "2023-10-08",
    time: "9:00 AM - 1:00 PM",
    location: "Karen Veterinary Center",
    image: "/images/events/first-aid.jpg",
    category: "Training",
  },
  {
    id: 5,
    title: "Rescue Dog Adoption Day",
    date: "2023-10-22",
    time: "10:00 AM - 3:00 PM",
    location: "Westlands Shopping Mall",
    image: "/images/events/adoption-day.jpg",
    category: "Adoption",
  },
  {
    id: 6,
    title: "Advanced Obedience Competition",
    date: "2023-11-12",
    time: "8:00 AM - 2:00 PM",
    location: "Ngong Racecourse",
    image: "/images/events/obedience-competition.jpg",
    category: "Competition",
  },
  // Adding more events for calendar display
  {
    id: 7,
    title: "Canine First Aid Workshop",
    date: "2023-07-18",
    time: "9:00 AM - 12:00 PM",
    location: "CustomK9 Training Center",
    category: "Workshop",
  },
  {
    id: 8,
    title: "Puppy Playtime",
    date: "2023-07-25",
    time: "3:00 PM - 5:00 PM",
    location: "Karura Forest Dog Park",
    category: "Open Day",
  },
  {
    id: 9,
    title: "Training Demonstration",
    date: "2023-08-05",
    time: "10:00 AM - 11:30 AM",
    location: "CustomK9 Training Center",
    category: "Demonstration",
  },
  {
    id: 10,
    title: "Senior Dog Care Seminar",
    date: "2023-08-22",
    time: "2:00 PM - 4:00 PM",
    location: "Karen Veterinary Center",
    category: "Seminar",
  },
  {
    id: 11,
    title: "Dog Photography Workshop",
    date: "2023-09-10",
    time: "10:00 AM - 1:00 PM", 
    location: "Nairobi Arboretum",
    category: "Workshop",
  },
  {
    id: 12,
    title: "Dog Nutrition Seminar",
    date: "2023-09-28",
    time: "6:00 PM - 8:00 PM",
    location: "Karen Shopping Center",
    category: "Seminar",
  }
];

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: typeof eventsData;
}

function getDaysInMonth(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0-6, Sunday is 0
  
  const today = new Date();
  const calendarDays: CalendarDay[] = [];
  
  // Add days from previous month to fill the first week
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const prevMonthLastDay = new Date(prevMonthYear, month, 0).getDate();
  
  for (let i = 0; i < startDayOfWeek; i++) {
    const date = new Date(prevMonthYear, prevMonth, prevMonthLastDay - startDayOfWeek + i + 1);
    calendarDays.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      events: eventsData.filter(event => isSameDay(new Date(event.date), date))
    });
  }
  
  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    calendarDays.push({
      date,
      isCurrentMonth: true,
      isToday: isSameDay(date, today),
      events: eventsData.filter(event => isSameDay(new Date(event.date), date))
    });
  }
  
  // Add days from next month to complete the last week
  const daysToAdd = 42 - calendarDays.length; // 6 rows of 7 days
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  
  for (let day = 1; day <= daysToAdd; day++) {
    const date = new Date(nextMonthYear, nextMonth, day);
    calendarDays.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      events: eventsData.filter(event => isSameDay(new Date(event.date), date))
    });
  }
  
  return calendarDays;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export default function EventsCalendarPage() {
  const currentDate = new Date();
  const [viewDate, setViewDate] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
  });
  
  const calendarDays = getDaysInMonth(viewDate.year, viewDate.month);
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Calendar Header */}
      <section className="pt-28 pb-10 bg-sky-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Events Calendar</h1>
              <p className="text-lg text-white/80">
                View all of our upcoming dog events at CustomK9 Kenya
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                href="/events" 
                className="bg-white text-sky-600 hover:bg-sky-50 font-semibold py-2 px-6 rounded-md transition-colors"
              >
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Calendar Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <button 
                onClick={goToPreviousMonth}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
              </button>
              <h2 className="text-2xl font-bold mx-4 text-gray-800">
                {monthNames[viewDate.month]} {viewDate.year}
              </h2>
              <button 
                onClick={goToNextMonth}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Next month"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <button 
              onClick={goToToday}
              className="bg-sky-100 text-sky-600 hover:bg-sky-200 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      </section>
      
      {/* Calendar Grid */}
      <section className="py-8 bg-gray-50 flex-1">
        <div className="container mx-auto px-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-1 text-center">
            {weekdays.map(day => (
              <div key={day} className="py-2 hidden sm:block text-gray-500 font-medium">
                {day}
              </div>
            ))}
            {/* Mobile Weekday Headers (first letter only) */}
            {weekdays.map(day => (
              <div key={day} className="py-2 sm:hidden text-gray-500 font-medium">
                {day.charAt(0)}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div 
                key={index}
                className={`min-h-[100px] sm:min-h-[120px] p-2 rounded-md ${
                  day.isCurrentMonth 
                    ? day.isToday 
                      ? 'bg-sky-50 border border-sky-300' 
                      : 'bg-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`font-medium ${day.isToday ? 'text-sky-600' : ''}`}>
                    {day.date.getDate()}
                  </span>
                  {day.events.length > 0 && (
                    <span className="bg-sky-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {day.events.length}
                    </span>
                  )}
                </div>
                
                <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
                  {day.events.map(event => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="block text-xs p-1 rounded-sm bg-sky-100 hover:bg-sky-200 text-sky-800 truncate"
                    >
                      {event.time && <span className="font-medium">{event.time.split(' - ')[0]}</span>} {event.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* View Mode Toggle (Mobile) */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <Link
          href="/events"
          className="bg-sky-600 text-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </Link>
      </div>
      
      <Footer />
    </div>
  );
} 