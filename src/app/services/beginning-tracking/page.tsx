"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

export default function BeginningTrackingPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Beginning Tracking */}
      <div className="relative h-[50vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-07.jpg"
            alt="Dog tracking in field"
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
              Beginning Tracking For Fun
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Discover your dog's natural scenting abilities while building confidence and having fun together.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/client-area" 
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-md"
              >
                Book This Class
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
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">About This Class</h2>
              
              <div className="prose prose-lg max-w-none">
                <p>
                  Our Beginning Tracking for Fun class taps into your dog's natural scenting abilities, providing mental stimulation and a fun bonding activity. Dogs have an incredible sense of smell, and tracking allows them to use this ability in a structured and rewarding way. This introductory class is perfect for dogs of all ages and breeds who enjoy using their nose.
                </p>
                
                <h3>What You'll Learn</h3>
                <ul>
                  <li>Understanding how dogs use their sense of smell</li>
                  <li>Setting up beginner tracking exercises</li>
                  <li>Reading your dog's body language during tracking</li>
                  <li>Introducing scent articles and tracking equipment</li>
                  <li>Techniques for encouraging focus and motivation</li>
                  <li>How to progress from simple to more complex tracks</li>
                  <li>Skills for tracking in different environments and weather conditions</li>
                </ul>
                
                <h3>Class Structure</h3>
                <p>
                  This is a 6-week course that combines classroom learning with practical field sessions. We'll meet at different outdoor locations to provide varied tracking experiences for your dog.
                </p>
                <ul>
                  <li>Week 1: Introduction to tracking concepts and equipment</li>
                  <li>Week 2: Starting with simple straight-line tracks</li>
                  <li>Week 3: Introducing corners and turns</li>
                  <li>Week 4: Working with different tracking surfaces</li>
                  <li>Week 5: Adding scent articles and aged tracks</li>
                  <li>Week 6: Putting it all together - longer tracks with challenges</li>
                </ul>
                
                <h3>Requirements</h3>
                <ul>
                  <li>Dogs should be at least 6 months old</li>
                  <li>Basic obedience skills (sit, stay, recall)</li>
                  <li>Up-to-date on vaccinations</li>
                  <li>A tracking harness or flat collar</li>
                  <li>10-foot tracking leash (we can recommend equipment)</li>
                  <li>Weather-appropriate clothing for handlers (classes run rain or shine)</li>
                  <li>High-value treats or favorite toy for rewarding success</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">Class Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Schedule & Pricing</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Duration:</strong> 6 weeks</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Session Length:</strong> 90 minutes per week</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Class Size:</strong> Maximum 6 dogs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Price:</strong> Ksh 15,000 for the full course</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Location:</strong> Various outdoor locations around Nairobi</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Mental stimulation and enrichment for your dog</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Increased confidence and focus</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Strengthened bond between dog and handler</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Low-impact activity suitable for dogs of all ages</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Foundation for competitive tracking sports if desired</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Fun outdoor activity to enjoy with your dog</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  href="/client-area" 
                  className="inline-block px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-lg"
                >
                  Book Your Spot Now
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