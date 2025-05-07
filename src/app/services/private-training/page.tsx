"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

export default function PrivateTrainingPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Private Training */}
      <div className="relative h-[50vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-05.jpg"
            alt="Private dog training session"
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
              Private Training
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Personalized one-on-one training sessions designed specifically for your dog's unique needs and learning style.
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
                  Our Private Training sessions offer personalized instruction tailored to your dog's specific needs and your lifestyle. Whether you're working with a new puppy, addressing specific behaviors, or advancing your dog's skills, these one-on-one sessions provide focused attention and customized training plans.
                </p>
                
                <h3>Benefits of Private Training</h3>
                <ul>
                  <li>Personalized curriculum focused on your specific goals</li>
                  <li>Flexible scheduling to accommodate your availability</li>
                  <li>Training in your home environment where many behaviors occur</li>
                  <li>Ability to address multiple training goals in one program</li>
                  <li>Faster progress through focused, distraction-controlled sessions</li>
                  <li>Immediate feedback and adjustments to your handling technique</li>
                </ul>
                
                <h3>Common Training Topics</h3>
                <p>
                  Private training can address virtually any training need, including:
                </p>
                <ul>
                  <li>Basic manners and obedience (sit, stay, come, leash walking)</li>
                  <li>Polite greetings and door manners</li>
                  <li>Addressing jumping, mouthing, or pulling behaviors</li>
                  <li>House training and crate training</li>
                  <li>Recall training and off-leash reliability</li>
                  <li>Advanced obedience and trick training</li>
                  <li>Preparation for therapy dog work or specific activities</li>
                </ul>
                
                <h3>How It Works</h3>
                <p>
                  Our private training process is designed for effective skill building:
                </p>
                <ul>
                  <li>Initial consultation to assess needs and establish goals</li>
                  <li>Development of a customized training plan</li>
                  <li>Hands-on coaching during each session</li>
                  <li>Homework assignments to practice between sessions</li>
                  <li>Regular progress assessments and plan adjustments</li>
                  <li>Written summaries and video demonstrations as needed</li>
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
                      <span><strong>Single Session:</strong> Ksh 6,000 (75 minutes)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>4-Session Package:</strong> Ksh 20,000 (saves Ksh 4,000)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>8-Session Package:</strong> Ksh 36,000 (saves Ksh 12,000)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Location:</strong> In-home or CustomK9 Training Facility</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Note:</strong> Travel fees may apply for locations beyond 15km</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">What to Expect</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Initial session includes assessment and goal setting</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Hands-on training with both you and your dog</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Written training plan and homework assignments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Email support between sessions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Flexible scheduling (weekdays, evenings, weekends)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>All training uses positive, force-free methods</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  href="/client-area" 
                  className="inline-block px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-lg"
                >
                  Book Your Private Session
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