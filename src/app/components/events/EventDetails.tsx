"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { CalendarIcon, MapPinIcon, UserGroupIcon, ClockIcon, ShareIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Define proper types for our event object
interface ScheduleItem {
  time: string;
  activity: string;
}

interface Event {
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

// Create the EventDetails component
export default function EventDetails({ event }: { event: Event }) {
  const [isRegistered, setIsRegistered] = useState(false);
  
  const handleRegister = () => {
    setIsRegistered(true);
    // In a real app, this would send data to a server
    console.log(`Registered for event: ${event.title}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:py-24">
        <div className="absolute inset-0 z-0 h-[40vh] md:h-[50vh]">
          <Image 
            src={event.image} 
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 mt-[25vh] md:mt-[30vh]">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-start gap-4">
                <Link 
                  href="/events" 
                  className="flex items-center text-sky-600 hover:text-sky-800 font-medium mb-4"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-1" />
                  Back to Events
                </Link>
                
                <span className="bg-sky-600 text-white text-sm font-semibold py-1 px-3 rounded-full">
                  {event.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">{event.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center mb-4 text-gray-700">
                    <CalendarIcon className="h-6 w-6 mr-3 text-sky-600" />
                    <div>
                      <div className="font-medium">Date</div>
                      <div>{event.date}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4 text-gray-700">
                    <ClockIcon className="h-6 w-6 mr-3 text-sky-600" />
                    <div>
                      <div className="font-medium">Time</div>
                      <div>{event.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4 text-gray-700">
                    <MapPinIcon className="h-6 w-6 mr-3 text-sky-600" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div>{event.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4 text-gray-700">
                    <UserGroupIcon className="h-6 w-6 mr-3 text-sky-600" />
                    <div>
                      <div className="font-medium">Attendees</div>
                      <div>{event.attending} people attending</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-start justify-between">
                  {event.price && (
                    <div className="bg-gray-100 p-4 rounded-lg mb-4 w-full">
                      <h3 className="font-bold text-lg mb-2">Ticket Information</h3>
                      <p className="text-gray-700 mb-2">{event.price}</p>
                      <button
                        onClick={handleRegister}
                        disabled={isRegistered}
                        className={`w-full py-3 px-6 rounded-md font-semibold transition-colors ${
                          isRegistered
                            ? 'bg-green-600 text-white cursor-default'
                            : 'bg-sky-600 hover:bg-sky-700 text-white'
                        }`}
                      >
                        {isRegistered ? 'Registration Confirmed ✓' : 'Register Now'}
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 w-full">
                    <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-full transition-colors">
                      <ShareIcon className="h-5 w-5" />
                    </button>
                    <span className="text-gray-600 text-sm">Share this event</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Event Details */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">About This Event</h2>
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="prose max-w-none">
                  {event.description.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
              
              {event.schedule && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Event Schedule</h3>
                  <div className="space-y-4">
                    {event.schedule.map((item, i) => (
                      <div key={i} className="flex border-b border-gray-100 pb-4">
                        <div className="w-1/3 font-medium text-gray-700">{item.time}</div>
                        <div className="w-2/3 text-gray-600">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Event Details</h2>
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                {event.organizer && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-700 mb-2">Organizer</h3>
                    <p className="text-gray-600">{event.organizer}</p>
                  </div>
                )}
                
                {event.contact && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-700 mb-2">Contact</h3>
                    <p className="text-gray-600">{event.contact}</p>
                  </div>
                )}
                
                {event.website && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-700 mb-2">Website</h3>
                    <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-800 break-words">
                      {event.website.replace('https://', '')}
                    </a>
                  </div>
                )}
                
                <div>
                  <h3 className="font-bold text-gray-700 mb-2">Share</h3>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-full transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.059 10.059 0 01-3.13 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.83 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                      </svg>
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.21 16.38A3.46 3.46 0 0 1 16 17a4.59 4.59 0 0 1-1.83-.39 1.84 1.84 0 0 0 .5-.69 2.89 2.89 0 0 0 .09-.33l.05-.2.51.11a1.82 1.82 0 0 0 .42.05 1.38 1.38 0 0 0 .85-.28 2.15 2.15 0 0 0 .41-.45.63.63 0 0 1-.43.17 1.18 1.18 0 0 1-1.2-.91 1.43 1.43 0 0 0 1.28-.29 1 1 0 0 0 .37-.75 1.31 1.31 0 0 0-.36-.75 3.2 3.2 0 0 1 .78-.08A3.69 3.69 0 0 1 17 12a3.51 3.51 0 0 1 1.4-2.79 3.55 3.55 0 0 1 2.36-.77 3.3 3.3 0 0 1 2.55 1 3.47 3.47 0 0 1 .89 2.48 3.25 3.25 0 0 1-.62 2 5.83 5.83 0 0 1-1.36 1.31c-.74.53-1.48 1.1-1.48 1.95 0 .35.24.82.74 1 .94.26 1.88 0 2.26-.52.26-.36.12-.92-.06-1a.39.39 0 0 0-.35 0c-.1.09-.25.23-.19.46a.5.5 0 0 1-.16.3.75.75 0 0 1-.56.14 1.39 1.39 0 0 1-.89-.54 1 1 0 0 1 0-1 3.81 3.81 0 0 1 1.26-.87 8.15 8.15 0 0 0 1.46-.87A2.67 2.67 0 0 0 24 12.29a2.86 2.86 0 0 0-.6-1.74 3 3 0 0 0-2.58-1.06 4.13 4.13 0 0 0-2.55 1 2.14 2.14 0 0 0-.69 1.39c0 .55.23 1.24.93 1.24a1.46 1.46 0 0 0 1.12-.53 1.47 1.47 0 0 0 .17-1.45 1.13 1.13 0 0 1 .13 1.66 1.33 1.33 0 0 1-1 .43 1.42 1.42 0 0 1-1.15-.62 1.51 1.51 0 0 1-.22-.8 3.84 3.84 0 0 1 1.42-2.93 4.53 4.53 0 0 1 3-.92c1.19 0 2.24.27 3 .92s1.13 1.59 1.13 2.59a4 4 0 0 1-1.13 2.66 8.75 8.75 0 0 1-1.39.84 5.92 5.92 0 0 0-1.7 1.13 1.31 1.31 0 0 0-.34 1 1.9 1.9 0 0 0 1.81 1.27 2 2 0 0 0 .7-.13 1.92 1.92 0 0 0 .73-.46 1.38 1.38 0 0 0 .35-.64 2.15 2.15 0 0 0 0-.77.89.89 0 0 1 .36-.13.92.92 0 0 1 .57.48 1.76 1.76 0 0 1-.34 1.93 2.53 2.53 0 0 1-1.87.75 3.19 3.19 0 0 1-2.46-1.06 3 3 0 0 1-.15-3.63zM15.24 10.89a1.91 1.91 0 0 0-1.4.62 2.58 2.58 0 0 0 0 2 4.42 4.42 0 0 0-1.6-.33c-1 0-1.82.48-2.32 1a3.78 3.78 0 0 0-1 2.73 4.2 4.2 0 0 0 .64 2.45c.26.35.81 1 1.29 1a.54.54 0 0 0 .4-.17.59.59 0 0 0 .17-.43.55.55 0 0 0-.17-.4.5.5 0 0 0-.4-.17c-.3 0-.61-.46-.8-.86a3.4 3.4 0 0 1-.18-1.45 3.36 3.36 0 0 1 .59-1.83c.37-.5.86-.8 1.78-.8a2.8 2.8 0 0 1 2.66 2.75 2.79 2.79 0 0 1-.83 2.41c-.54.45-1.32.53-2.43.72-1.29.22-1.74.89-1.74 1.39a.59.59 0 0 0 .16.43.52.52 0 0 0 .4.17.56.56 0 0 0 .57-.6c0-.15 0-.27.45-.37 1.13-.26 1.75-.46 2.46-1A3.31 3.31 0 0 0 15 17.69a3.8 3.8 0 0 0-1.14-2.69 2.55 2.55 0 0 0-.85-.6 1.4 1.4 0 0 1 .74-1.91 2.68 2.68 0 0 0 1.18.31 1.27 1.27 0 0 0 .47-.09 1.43 1.43 0 0 0 .85-1.82z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-gray-700 mb-4">Location</h3>
                <div className="bg-gray-200 h-48 mb-4 rounded-lg flex items-center justify-center">
                  {/* In a real app, this would be a Google Maps embed */}
                  <p className="text-gray-500 text-center">
                    Map of {event.location}<br />
                    <span className="text-sm">(Map embed would be here)</span>
                  </p>
                </div>
                <address className="text-gray-600 not-italic">
                  {event.location}<br />
                  Nairobi, Kenya
                </address>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 