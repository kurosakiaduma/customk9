"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

export default function BehaviorModificationPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Behavior Modification */}
      <div className="relative h-[50vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-07.jpg"
            alt="Dog behavior modification training"
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
              Behavior Modification
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Address challenging behaviors with personalized, science-based approaches that bring positive change.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/client-area" 
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-md"
              >
                Book Consultation
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
                  Our Behavior Modification program addresses challenging behaviors through personalized, force-free methods. We focus on understanding the root causes of unwanted behaviors while developing practical strategies to modify them, always prioritizing your dog's wellbeing and your relationship.
                </p>
                
                <h3>Common Behaviors We Address</h3>
                <ul>
                  <li>Reactivity (barking, lunging) towards people or other dogs</li>
                  <li>Separation anxiety and isolation distress</li>
                  <li>Resource guarding of food, toys, or locations</li>
                  <li>Fear-based behaviors and phobias</li>
                  <li>Excessive barking or vocalization</li>
                  <li>Destructive behaviors when alone</li>
                  <li>Handling sensitivity or aggression</li>
                </ul>
                
                <h3>Our Approach</h3>
                <p>
                  We begin with a comprehensive assessment to understand your dog's behavior in context. Our process includes:
                </p>
                <ul>
                  <li>Detailed history gathering and behavior evaluation</li>
                  <li>Identification of triggers and environmental factors</li>
                  <li>Development of a customized behavior modification plan</li>
                  <li>Step-by-step guidance for implementation</li>
                  <li>Ongoing support and plan adjustments as needed</li>
                  <li>Coordination with veterinarians when medical factors may be involved</li>
                </ul>
                
                <h3>What to Expect</h3>
                <p>
                  Behavior modification is a journey that requires patience and consistency. Our program typically includes:
                </p>
                <ul>
                  <li>An initial 90-minute consultation and assessment</li>
                  <li>A comprehensive written behavior modification plan</li>
                  <li>Follow-up sessions to monitor progress and adjust techniques</li>
                  <li>Email support between sessions</li>
                  <li>Clear, achievable homework assignments</li>
                  <li>Management strategies to prevent rehearsal of unwanted behaviors</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">Service Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Package Options & Pricing</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Initial Consultation:</strong> Ksh 8,000 (90 minutes)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Follow-up Sessions:</strong> Ksh 5,000 (60 minutes)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>4-Session Package:</strong> Ksh 20,000 (saves Ksh 3,000)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>6-Session Package:</strong> Ksh 28,000 (saves Ksh 7,000)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Location:</strong> In-home or CustomK9 Training Facility, Nairobi</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Comprehensive behavioral assessment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Customized behavior modification plan</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Hands-on training demonstrations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Management strategies for immediate implementation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Email support between sessions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Video analysis for remote feedback (as needed)</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  href="/client-area" 
                  className="inline-block px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-lg"
                >
                  Schedule a Consultation
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