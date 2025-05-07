"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

export default function LooseLeashWalkingPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Loose Leash Walking */}
      <div className="relative h-[50vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-05.jpg"
            alt="Dog walking on loose leash"
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
              Loose Leash Walking
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Transform frustrating walks into enjoyable experiences with effective loose leash training.
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
                  Our Loose Leash Walking class specifically targets one of the most common challenges dog owners face – pulling on the leash. This focused training will teach you and your dog how to walk calmly together without tension, making daily walks enjoyable rather than stressful.
                </p>
                
                <h3>What You'll Learn</h3>
                <ul>
                  <li>Understanding why dogs pull and how to address the root causes</li>
                  <li>Proper leash handling techniques and body mechanics</li>
                  <li>Methods to gain and maintain your dog's attention during walks</li>
                  <li>Positive reinforcement strategies to reward good walking behavior</li>
                  <li>How to gradually build duration of loose leash walking</li>
                  <li>Techniques for managing distractions in various environments</li>
                  <li>Troubleshooting common loose leash walking challenges</li>
                </ul>
                
                <h3>Class Structure</h3>
                <p>
                  This is a 4-week course with weekly 60-minute sessions. Each class builds upon the previous one to gradually develop your dog's loose leash walking skills. We begin in a controlled environment and progressively introduce more challenging scenarios.
                </p>
                <ul>
                  <li>Week 1: Foundations of loose leash walking and engagement</li>
                  <li>Week 2: Building duration and introducing minor distractions</li>
                  <li>Week 3: Handling common challenges and environmental distractions</li>
                  <li>Week 4: Generalizing skills to new environments and handlers</li>
                </ul>
                
                <h3>Requirements</h3>
                <ul>
                  <li>Dogs should be at least 4 months old</li>
                  <li>Up-to-date on vaccinations</li>
                  <li>A properly fitted flat collar, harness, or gentle leader</li>
                  <li>6-foot leash (no retractable leashes)</li>
                  <li>High-value treats for reinforcement</li>
                  <li>Comfortable walking shoes for handler</li>
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
                      <span><strong>Duration:</strong> 4 weeks</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Session Length:</strong> 60 minutes per week</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Class Size:</strong> Maximum 8 dogs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Price:</strong> Ksh 12,000 for the full course</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Location:</strong> CustomK9 Training Center and surrounding areas for practice</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>More enjoyable walks for both you and your dog</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Reduced risk of injury from pulling</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Increased confidence in walking in various environments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Stronger bond between you and your dog</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Foundation for more advanced training activities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Practical skills that transfer to everyday situations</span>
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