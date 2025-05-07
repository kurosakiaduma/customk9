"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

export default function SupervisedPlaytimePage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Supervised Playtime */}
      <div className="relative h-[50vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-03.jpg"
            alt="Dogs playing together under supervision"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          {/* Light text shadow container for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/15 to-transparent"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 h-full flex items-center relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Supervised Playtime
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Safe, monitored socialization sessions where your dog can play and interact with other dogs under expert supervision.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/client-area" 
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-md"
              >
                Book a Session
              </Link>
              <Link 
                href="/services" 
                className="px-6 py-3 bg-white text-sky-700 hover:bg-sky-50 font-semibold rounded-full transition-colors shadow-md"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">About This Service</h2>
              
              <div className="prose prose-lg max-w-none">
                <p>
                  Our Supervised Playtime sessions provide a controlled environment where your dog can socialize, exercise, and have fun with other compatible dogs. Unlike dog parks where play can sometimes become too rough or inappropriate, our sessions are actively monitored by trained professionals who understand dog body language and can ensure all interactions remain positive and beneficial.
                </p>
                
                <h3>Benefits of Supervised Playtime</h3>
                <ul>
                  <li>Socialization with carefully matched playmates</li>
                  <li>Physical exercise and mental stimulation</li>
                  <li>Development of appropriate play skills and manners</li>
                  <li>Reduction in isolation-related behaviors</li>
                  <li>Opportunity to practice social cues and communication with other dogs</li>
                  <li>Relief from boredom and excess energy</li>
                  <li>Low-pressure environment to build confidence</li>
                </ul>
                
                <h3>How It Works</h3>
                <p>
                  Before joining our playtime sessions, all dogs undergo a temperament assessment to ensure they're a good fit for group play. We carefully match dogs based on size, play style, and energy level to create the most positive experience for everyone.
                </p>
                <ul>
                  <li>Sessions are limited to small groups (maximum 8 dogs)</li>
                  <li>Dogs are separated into appropriate playgroups</li>
                  <li>2-3 trained supervisors monitor all interactions</li>
                  <li>Regular play breaks are enforced to prevent over-arousal</li>
                  <li>Indoor and outdoor play areas available</li>
                  <li>Water and rest areas accessible at all times</li>
                </ul>
                
                <h3>Requirements</h3>
                <ul>
                  <li>Dogs must be at least 4 months old and fully vaccinated</li>
                  <li>Completion of temperament assessment (one-time, 30-minute evaluation)</li>
                  <li>Free from contagious conditions</li>
                  <li>Spayed/neutered if over 8 months old (exceptions considered case-by-case)</li>
                  <li>Comfortable with being handled by staff</li>
                  <li>Able to be safely removed from play if necessary</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">Session Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Schedule & Pricing</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Single Session:</strong> Ksh 1,500 (1 hour)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>5-Session Package:</strong> Ksh 6,000 (save Ksh 1,500)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>10-Session Package:</strong> Ksh 10,000 (save Ksh 5,000)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Session Times:</strong><br />
                        Monday-Friday: 10am, 2pm, 6pm<br />
                        Saturday: 9am, 11am, 2pm<br />
                        Sunday: 10am, 2pm
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Temperament Assessment:</strong> Ksh 1,000 (one-time)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">What to Know</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Pre-booking required (24 hours in advance)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Dogs should arrive 10 minutes before session starts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Bring your dog's favorite toys (if they share well)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>We provide water, but feel free to bring your dog's water bowl</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Owners can observe sessions but are not required to stay</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Session packages expire after 6 months</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  href="/client-area" 
                  className="inline-block px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-lg"
                >
                  Book a Playtime Session
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 