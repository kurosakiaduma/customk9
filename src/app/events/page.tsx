"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import { CalendarIcon, MapPinIcon, UserGroupIcon, ClockIcon, FunnelIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { OdooEventService, Event } from '@/services/OdooEventService';
import ServiceFactory from '@/services/ServiceFactory';

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [displayEvents, setDisplayEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Load events data on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const odooClientService = ServiceFactory.getInstance().getOdooClientService();
        const eventService = new OdooEventService(odooClientService);
        
        const [upcoming, featured] = await Promise.all([
          eventService.getUpcomingEvents(),
          eventService.getFeaturedEvents()
        ]);
        
        setAllEvents(upcoming);
        setFeaturedEvents(featured);
        setCategories([...new Set(upcoming.map(event => event.category))]);
        setDisplayEvents(upcoming);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter events based on selected category
  useEffect(() => {
    if (activeCategory === "all") {
      setDisplayEvents(allEvents);
    } else {
      setDisplayEvents(allEvents.filter(event => event.category === activeCategory));
    }
  }, [activeCategory, allEvents]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Navigation />
      
      {/* Enhanced Hero Section with Background Image */}
      <section className="relative h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/events/hero-image.jpg" 
            alt="CustomK9 dog events and activities"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1 bg-sky-500/80 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-4 shadow-md">
              Join Our Community
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Dog Events & Workshops
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-2xl">
              Join our vibrant community of dog lovers at our specialized events, workshops, competitions, and social gatherings designed for dogs of all ages and abilities.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#featured-events" 
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-md"
              >
                Explore Events
              </a>
              <Link 
                href="/events/calendar" 
                className="px-6 py-3 bg-white text-sky-700 hover:bg-sky-50 font-semibold rounded-full transition-colors shadow-md flex items-center"
              >
                <span>View Calendar</span>
                <ChevronRightIcon className="w-5 h-5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Events with Improved Visual Design */}
      {featuredEvents.length > 0 && (
        <section id="featured-events" className="py-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <span className="text-sky-600 font-semibold">Don't Miss Out</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">Featured Events</h2>
              </div>
              <p className="text-gray-600 max-w-xl mt-2 md:mt-0">
                Our special selection of upcoming events that you won't want to miss. Early registration is recommended as these events tend to fill up quickly.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                <Link 
                  key={event.id} 
                  href={`/events/${event.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
                >
                  <div className="relative h-64">
                    <Image 
                      src={event.image} 
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-sky-600 text-white text-sm font-semibold py-1 px-3 rounded-full">
                      {event.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-sky-600 transition-colors">{event.title}</h3>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="h-5 w-5 mr-2 text-sky-600" />
                        <span>{event.date}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="h-5 w-5 mr-2 text-sky-600" />
                        <span>{event.time.split(' - ')[0]}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-6 text-gray-600">
                      <MapPinIcon className="h-5 w-5 mr-2 text-sky-600 mt-0.5 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-6 flex-grow">
                      {event.description.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center text-gray-600">
                        <UserGroupIcon className="h-5 w-5 mr-2 text-sky-600" />
                        <span>{event.attending} attending</span>
                      </div>
                      
                      <span className="inline-flex items-center justify-center text-sky-600 font-medium group-hover:text-sky-700">
                        View Details
                        <ChevronRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Category Filters with Tabs */}
      <section className="py-8 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <FunnelIcon className="h-5 w-5 text-sky-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Filter by Category:</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-full transition-colors text-sm font-medium ${
                  activeCategory === "all" 
                    ? "bg-sky-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Events
              </button>
              
              {categories.map((category) => (
                <button 
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full transition-colors text-sm font-medium ${
                    activeCategory === category 
                      ? "bg-sky-600 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* All Upcoming Events with Improved Grid Layout */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-sky-600 font-semibold">Coming Up</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                {activeCategory === "all" ? "All Upcoming Events" : `${activeCategory} Events`}
              </h2>
            </div>
            
            <Link 
              href="/events/calendar" 
              className="text-sky-600 hover:text-sky-800 font-medium flex items-center"
            >
              View Calendar
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {displayEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayEvents.map((event) => (
                <Link 
                  key={event.id} 
                  href={`/events/${event.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
                >
                  <div className="relative h-52">
                    <Image 
                      src={event.image} 
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-sky-600 text-white text-xs font-semibold py-1 px-2 rounded-full">
                      {event.category}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-20"></div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-sky-600 transition-colors line-clamp-2">{event.title}</h3>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <CalendarIcon className="h-4 w-4 mr-2 text-sky-600" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <ClockIcon className="h-4 w-4 mr-2 text-sky-600" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    
                    <div className="flex items-start text-gray-600 mb-4">
                      <MapPinIcon className="h-4 w-4 mr-2 text-sky-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex items-center text-gray-600">
                        <UserGroupIcon className="h-4 w-4 mr-1 text-sky-600" />
                        <span className="text-xs">{event.attending} attending</span>
                      </div>
                      
                      <span className="text-sky-600 text-sm font-medium group-hover:text-sky-700 flex items-center">
                        View Details
                        <ChevronRightIcon className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-10 text-center shadow-sm">
              <p className="text-lg text-gray-600 mb-4">No events found in this category.</p>
              <button 
                onClick={() => setActiveCategory("all")}
                className="px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
              >
                View All Events
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Signup / Call to Action */}
      <section className="py-16 bg-sky-600 text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stay Updated on Dog Events</h2>
            <p className="text-xl mb-8 text-white/90">
              Subscribe to our newsletter to receive regular updates about upcoming events, training workshops, and community gatherings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/client-area" 
                className="px-8 py-3 bg-white text-sky-600 hover:bg-sky-100 font-bold rounded-full transition-colors shadow-lg"
              >
                Subscribe Now
              </Link>
              <Link 
                href="/contact"
                className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold rounded-full transition-colors"
              >
                Host Your Event
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 