"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { CalendarIcon, MapPinIcon, UserGroupIcon, ClockIcon, ShareIcon, ArrowLeftIcon, 
         CurrencyDollarIcon, EnvelopeIcon, GlobeAltIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

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
  const [shareTooltip, setShareTooltip] = useState(false);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleRegister = () => {
    setIsRegistered(true);
    // In a real app, this would send data to a server
    console.log(`Registered for event: ${event.title}`);
  };
  
  const handleShare = () => {
    setShareTooltip(true);
    setTimeout(() => {
      setShareTooltip(false);
    }, 2000);
    // In a real app, this would open the native share dialog or copy to clipboard
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      {/* Enhanced Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-20 md:pb-0">
        <div className="absolute inset-0 z-0 h-[50vh] md:h-[65vh]">
          <Image 
            src={event.image} 
            alt={event.title}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 md:px-8 mt-[25vh] md:mt-[40vh]">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden transform md:-translate-y-16">
            <div className="p-6 md:p-10">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <Link 
                  href="/events" 
                  className="flex items-center text-sky-600 hover:text-sky-800 font-medium transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-1" />
                  Back to Events
                </Link>
                
                <span className="inline-flex items-center px-4 py-1.5 bg-sky-600 text-white text-sm font-semibold rounded-full">
                  {event.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-gray-800 leading-tight">
                {event.title}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start text-gray-700">
                      <div className="rounded-full bg-sky-100 p-3 mr-4">
                        <CalendarIcon className="h-6 w-6 text-sky-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-500">Date</div>
                        <div className="text-lg font-semibold">{event.date}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start text-gray-700">
                      <div className="rounded-full bg-sky-100 p-3 mr-4">
                        <ClockIcon className="h-6 w-6 text-sky-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-500">Time</div>
                        <div className="text-lg font-semibold">{event.time}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start text-gray-700">
                      <div className="rounded-full bg-sky-100 p-3 mr-4">
                        <MapPinIcon className="h-6 w-6 text-sky-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-500">Location</div>
                        <div className="text-lg font-semibold">{event.location}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start text-gray-700">
                      <div className="rounded-full bg-sky-100 p-3 mr-4">
                        <UserGroupIcon className="h-6 w-6 text-sky-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-500">Attendees</div>
                        <div className="text-lg font-semibold">{event.attending} people</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  {event.price && (
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-6 rounded-xl mb-6 border border-sky-100">
                      <h3 className="font-bold text-xl mb-3 text-gray-800">Registration</h3>
                      <div className="flex items-start mb-4">
                        <CurrencyDollarIcon className="h-5 w-5 text-sky-600 mr-2 mt-0.5" />
                        <p className="text-gray-700">{event.price}</p>
                      </div>
                      <button
                        onClick={handleRegister}
                        disabled={isRegistered}
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                          isRegistered
                            ? 'bg-green-600 text-white cursor-default shadow-md'
                            : 'bg-sky-600 hover:bg-sky-700 text-white shadow-md hover:shadow-lg'
                        }`}
                      >
                        {isRegistered ? (
                          <span className="flex items-center justify-center">
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            Registration Confirmed
                          </span>
                        ) : 'Register Now'}
                      </button>
                    </div>
                  )}
                  
                  <div className="relative">
                    <button 
                      onClick={handleShare}
                      className="flex items-center w-full justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-lg transition-colors border border-gray-200 shadow-sm"
                    >
                      <ShareIcon className="h-5 w-5 text-sky-600" />
                      <span className="font-medium">Share This Event</span>
                    </button>
                    
                    {shareTooltip && (
                      <div className="absolute -top-12 left-0 right-0 bg-gray-800 text-white text-sm py-2 px-4 rounded-md text-center">
                        Link copied to clipboard!
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Event Details with Enhanced Design */}
      <section className="py-0 md:py-8 -mt-4 md:-mt-0">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="w-10 h-1 bg-sky-600 mr-3"></span>
                About This Event
              </h2>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-md mb-8">
                <div className="prose max-w-none">
                  {event.description.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              
              {event.schedule && (
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                    <ClockIcon className="h-5 w-5 text-sky-600 mr-2" />
                    Event Schedule
                  </h3>
                  
                  <div className="space-y-0">
                    {event.schedule.map((item, i) => (
                      <div 
                        key={i} 
                        className={`flex border-l-2 ${
                          i === event.schedule!.length - 1 
                            ? 'border-transparent' 
                            : 'border-sky-200'
                        } pl-6 pb-6 relative`}
                      >
                        <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-sky-600"></div>
                        <div className="w-1/3 font-medium text-gray-800 pr-4">{item.time}</div>
                        <div className="w-2/3 text-gray-700">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="w-10 h-1 bg-sky-600 mr-3"></span>
                Additional Information
              </h2>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-md mb-8">
                {event.organizer && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                      <UserGroupIcon className="h-5 w-5 text-sky-600 mr-2" />
                      Organizer
                    </h3>
                    <p className="text-gray-700 ml-7">{event.organizer}</p>
                  </div>
                )}
                
                {event.contact && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                      <EnvelopeIcon className="h-5 w-5 text-sky-600 mr-2" />
                      Contact
                    </h3>
                    <a 
                      href={`mailto:${event.contact}`} 
                      className="text-sky-600 hover:text-sky-800 ml-7 transition-colors"
                    >
                      {event.contact}
                    </a>
                  </div>
                )}
                
                {event.website && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                      <GlobeAltIcon className="h-5 w-5 text-sky-600 mr-2" />
                      Website
                    </h3>
                    <a 
                      href={event.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sky-600 hover:text-sky-800 break-words ml-7 transition-colors"
                    >
                      {event.website.replace('https://', '')}
                    </a>
                  </div>
                )}
                
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <ShareIcon className="h-5 w-5 text-sky-600 mr-2" />
                    Share Event
                  </h3>
                  <div className="flex space-x-3 ml-7">
                    <button className="bg-[#1877F2] hover:bg-[#166FE5] text-white p-2 rounded-lg transition-colors w-10 h-10 flex items-center justify-center shadow-sm">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button className="bg-[#1DA1F2] hover:bg-[#1A94DA] text-white p-2 rounded-lg transition-colors w-10 h-10 flex items-center justify-center shadow-sm">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.059 10.059 0 01-3.13 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.83 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                      </svg>
                    </button>
                    <button className="bg-[#0A66C2] hover:bg-[#0958A7] text-white p-2 rounded-lg transition-colors w-10 h-10 flex items-center justify-center shadow-sm">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                    <button className="bg-[#25D366] hover:bg-[#20BD5C] text-white p-2 rounded-lg transition-colors w-10 h-10 flex items-center justify-center shadow-sm">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <MapPinIcon className="h-5 w-5 text-sky-600 mr-2" />
                  Location
                </h3>
                <div className="bg-slate-100 h-56 mb-4 rounded-lg flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
                  <div className="relative z-10 text-center px-4">
                    <MapPinIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 font-medium">
                      {event.location}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Interactive map loading...
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <address className="text-gray-700 not-italic">
                    <strong>{event.location}</strong><br />
                    Nairobi, Kenya
                  </address>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(event.location + ', Nairobi, Kenya')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-800 font-medium text-sm flex items-center"
                  >
                    Get Directions
                    <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Events CTA */}
      <section className="py-16 bg-gradient-to-b from-white to-sky-50 mt-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Discover More Events</h2>
          <p className="text-xl mb-8 text-gray-600 max-w-3xl mx-auto">
            Don't miss out on other exciting dog events happening soon.
          </p>
          <Link 
            href="/events" 
            className="inline-block px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            Browse All Events
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 