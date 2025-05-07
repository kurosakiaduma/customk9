"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import { CalendarIcon, MapPinIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import { getUpcomingEvents, getFeaturedEvents } from '../data/eventsData';

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
  const featuredEvents = getFeaturedEvents();
  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-events.jpg" 
            alt="Dog events and workshops" 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Events & Workshops
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto mb-8">
            Join our community events, workshops, and competitions designed for dogs and their owners.
          </p>
        </div>
      </section>
      
      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Featured Events</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] duration-300">
                  <div className="relative h-64">
                    <Image 
                      src={event.image} 
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-sky-600 text-white text-sm font-semibold py-1 px-3 rounded-full">
                      {event.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{event.title}</h3>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="h-5 w-5 mr-2 text-sky-600" />
                        <span>{event.date}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="h-5 w-5 mr-2 text-sky-600" />
                        <span>{event.time.split(' - ')[0]}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-5 w-5 mr-2 text-sky-600" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                      {event.description.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <UserGroupIcon className="h-5 w-5 mr-2 text-sky-600" />
                        <span>{event.attending} attending</span>
                      </div>
                      
                      <Link 
                        href={`/events/${event.id}`}
                        className="inline-flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* All Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Upcoming Events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Link 
                key={event.id} 
                href={`/events/${event.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image 
                    src={event.image} 
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-sky-600 text-white text-xs font-semibold py-1 px-2 rounded-full">
                    {event.category}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-1">
                    <CalendarIcon className="h-4 w-4 mr-2 text-sky-600" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPinIcon className="h-4 w-4 mr-2 text-sky-600" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-gray-600">
                      <UserGroupIcon className="h-4 w-4 mr-1 text-sky-600" />
                      <span className="text-xs">{event.attending} attending</span>
                    </div>
                    
                    <span className="text-sky-600 text-sm font-medium">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-sky-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Want to Host a Dog Event?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            CustomK9 provides venue and professional support for dog-related events. 
            Contact us to discuss your event needs.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-3 px-6 rounded-md transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 