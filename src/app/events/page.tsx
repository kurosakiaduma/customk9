"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import { CalendarIcon, MapPinIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

// This would typically be fetched from an API or CMS
const eventsData = [
  {
    id: 1,
    title: "Annual Dog Show Competition",
    date: "August 15, 2023",
    time: "9:00 AM - 4:00 PM",
    location: "Nairobi Arboretum",
    image: "/images/events/dog-show.jpg",
    description: "Join us for our annual dog show where dogs of all breeds compete for Best in Show. Categories include obedience, agility, and conformation.",
    category: "Competition",
    attending: 152,
    featured: true,
  },
  {
    id: 2,
    title: "Puppy Socialization Workshop",
    date: "September 5, 2023",
    time: "10:00 AM - 12:00 PM",
    location: "CustomK9 Training Center",
    image: "/images/events/puppy-workshop.jpg",
    description: "A workshop designed to help puppy owners understand the importance of early socialization and how to properly socialize their puppies.",
    category: "Workshop",
    attending: 45,
    featured: true,
  },
  {
    id: 3,
    title: "Agility Course Open Day",
    date: "September 20, 2023",
    time: "2:00 PM - 5:00 PM",
    location: "Karura Forest Dog Park",
    image: "/images/events/agility-course.jpg",
    description: "Try out our agility course with your dog. Trainers will be available to guide you through obstacles and provide tips.",
    category: "Open Day",
    attending: 78,
    featured: false,
  },
  {
    id: 4,
    title: "Dog First Aid Training",
    date: "October 8, 2023",
    time: "9:00 AM - 1:00 PM",
    location: "Karen Veterinary Center",
    image: "/images/events/first-aid.jpg",
    description: "Learn essential first aid techniques for dogs including CPR, wound care, and how to handle common emergencies.",
    category: "Training",
    attending: 32,
    featured: false,
  },
  {
    id: 5,
    title: "Rescue Dog Adoption Day",
    date: "October 22, 2023",
    time: "10:00 AM - 3:00 PM",
    location: "Westlands Shopping Mall",
    image: "/images/events/adoption-day.jpg",
    description: "Meet dogs available for adoption from local shelters and rescue organizations. Find your perfect furry companion!",
    category: "Adoption",
    attending: 214,
    featured: true,
  },
  {
    id: 6,
    title: "Advanced Obedience Competition",
    date: "November 12, 2023",
    time: "8:00 AM - 2:00 PM",
    location: "Ngong Racecourse",
    image: "/images/events/obedience-competition.jpg",
    description: "Test your dog's obedience skills in this competitive event featuring advanced commands and off-leash work.",
    category: "Competition",
    attending: 96,
    featured: false,
  }
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const [searchQuery, setSearchQuery] = useState('');

  // Get all unique categories
  const categories = ['All', ...new Set(eventsData.map(event => event.category))];
  
  // Featured events for the carousel
  const featuredEvents = eventsData.filter(event => event.featured);

  // Handle filtering
  useEffect(() => {
    let filtered = eventsData;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredEvents(filtered);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/events/hero-image.jpg" 
            alt="Dogs at an event gathering"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-white text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
            Upcoming Dog Events
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
            Join our community for competitions, workshops, adoption days, and more events for dog lovers across Kenya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#featured-events" 
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-md transition-colors shadow-lg"
            >
              View Featured Events
            </Link>
            <Link 
              href="#all-events" 
              className="bg-white text-sky-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-md transition-colors shadow-lg"
            >
              Browse All Events
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Events Section */}
      <section id="featured-events" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Featured Events</h2>
          <div className="w-20 h-1 bg-sky-500 mb-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map(event => (
              <div 
                key={event.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48">
                  <Image 
                    src={event.image} 
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-sky-600 text-white text-sm font-semibold py-1 px-3 rounded-bl-lg">
                    {event.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
                  <div className="flex items-center mb-2 text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center mb-2 text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center mb-4 text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sky-600">
                      <UserGroupIcon className="h-5 w-5 mr-1" />
                      <span className="text-sm font-semibold">{event.attending} attending</span>
                    </div>
                    <Link 
                      href={`/events/${event.id}`} 
                      className="text-sky-600 hover:text-sky-800 font-semibold"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* All Events Section with Filtering */}
      <section id="all-events" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">All Events</h2>
          <div className="w-20 h-1 bg-sky-500 mb-10"></div>
          
          {/* Search and Filters */}
          <div className="mb-10 flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  className="absolute right-3 top-3 h-6 w-6 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <div 
                  key={event.id} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-48">
                    <Image 
                      src={event.image} 
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-sky-600 text-white text-sm font-semibold py-1 px-3 rounded-bl-lg">
                      {event.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
                    <div className="flex items-center mb-2 text-gray-600">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center mb-2 text-gray-600">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center mb-4 text-gray-600">
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sky-600">
                        <UserGroupIcon className="h-5 w-5 mr-1" />
                        <span className="text-sm font-semibold">{event.attending} attending</span>
                      </div>
                      <Link 
                        href={`/events/${event.id}`} 
                        className="text-sky-600 hover:text-sky-800 font-semibold"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-xl mb-4">No events found matching your criteria</p>
              <button
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Call-to-Action Section */}
      <section className="py-16 bg-sky-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Host Your Own Dog Event</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Do you have a dog-related event you'd like to organize? We can help you plan, promote, and host your event with our expertise.
          </p>
          <Link
            href="/contact" 
            className="bg-white text-sky-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-md transition-colors shadow-lg inline-block"
          >
            Contact Us to Get Started
          </Link>
        </div>
      </section>
      
      {/* Upcoming Calendar Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Events Calendar</h2>
          <div className="w-20 h-1 bg-sky-500 mb-10"></div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-center text-gray-600 mb-8">
              View our upcoming events at a glance and plan your schedule accordingly.
            </p>
            
            <div className="flex justify-center">
              <Link
                href="/events/calendar" 
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-8 rounded-md transition-colors"
              >
                View Full Calendar
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 