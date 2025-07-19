"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

export default function PuppyMannersPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-black">
      {/* Custom Hero Section for Puppy Manners */}
      <div className="relative h-[50vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/puppy-training.jpg"
            alt="Puppy training and socialization"
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
              Puppy Manners and Socialization
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Give your puppy the best start in life with our specialized socialization and early manners training.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/booking" 
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
                  Our Puppy Manners and Socialization class is designed for puppies aged 8-16 weeks. This critical period in your puppy&apos;s development is the perfect time to introduce them to new experiences, other dogs, and basic commands in a controlled, positive environment.
                </p>
                
                <h3>What You&apos;ll Learn</h3>
                <ul>
                  <li>Basic puppy manners and commands (sit, stay, come)</li>
                  <li>Positive socialization with other puppies and people</li>
                  <li>How to prevent common behavior problems</li>
                  <li>Proper handling and grooming introduction</li>
                  <li>Housetraining tips and crate training basics</li>
                  <li>Play appropriate games that teach impulse control</li>
                </ul>
                
                <h3>Class Structure</h3>
                <p>
                  This is a 6-week course with weekly 1-hour sessions. The class size is limited to ensure each puppy and owner receives individual attention. Each class includes:
                </p>
                <ul>
                  <li>Structured learning time for basic commands</li>
                  <li>Supervised play sessions with other puppies</li>
                  <li>Introduction to new environments, sounds, and experiences</li>
                  <li>Q&A time with our experienced trainers</li>
                </ul>
                
                <h3>Requirements</h3>
                <ul>
                  <li>Puppies must be 8-16 weeks of age at the start of class</li>
                  <li>Up-to-date on age-appropriate vaccinations</li>
                  <li>A flat collar or harness and 6-foot leash</li>
                  <li>Plenty of small, soft treats for rewards</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">Class Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">Schedule & Pricing</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Duration:</strong> 6 weeks</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Session Length:</strong> 1 hour per week</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Class Size:</strong> Maximum 6 puppies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Price:</strong> Ksh 12,000 for the full course</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Location:</strong> CustomK9 Training Facility, Nairobi</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">What to Bring</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Your puppy on a 6-foot leash (no retractable leashes)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Flat collar or harness</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Plenty of small, soft treats</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Vaccination records</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Water bowl for your puppy</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  href="/booking" 
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