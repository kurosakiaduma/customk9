"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

export default function ShowHandlingPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Show Handling / Ring Craft */}
      <div className="relative h-[50vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-04.jpg"
            alt="Dog show handling training"
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
              Show Handling / Ring Craft
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Specialized training to help show dogs and handlers excel in the competition ring.
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
                  Our Show Handling and Ring Craft class is designed for owners who wish to present their dogs in conformation shows, helping both handler and dog develop the skills needed to excel in the competition ring. Whether you're new to showing or looking to refine your technique, our expert trainers provide personalized guidance.
                </p>
                
                <h3>What You'll Learn</h3>
                <ul>
                  <li>Proper stacking and presentation techniques for your breed</li>
                  <li>Effective gaiting patterns and speeds</li>
                  <li>Handling techniques that showcase your dog's best qualities</li>
                  <li>Ring etiquette and show protocols</li>
                  <li>Grooming basics for the show ring</li>
                  <li>Strategies for handling distractions and maintaining focus</li>
                  <li>Understanding breed standards and what judges look for</li>
                </ul>
                
                <h3>Class Structure</h3>
                <p>
                  This is a 6-week course with weekly 90-minute sessions. The class size is limited to ensure each handler-dog team receives individual attention. Each class includes:
                </p>
                <ul>
                  <li>Warm-up and practice of fundamental handling skills</li>
                  <li>Simulated show ring environments with practice judging</li>
                  <li>Individual coaching for your specific breed requirements</li>
                  <li>Troubleshooting for common show ring challenges</li>
                  <li>Video analysis of your handling technique</li>
                  <li>Homework assignments to practice between sessions</li>
                </ul>
                
                <h3>Requirements</h3>
                <ul>
                  <li>Dogs should be at least 4 months old</li>
                  <li>Basic obedience training recommended (sit, stay, etc.)</li>
                  <li>Up-to-date on vaccinations</li>
                  <li>Show lead/collar appropriate for your breed</li>
                  <li>Grooming supplies relevant to your breed</li>
                  <li>Comfortable clothes and shoes for handling</li>
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
                      <span><strong>Class Size:</strong> Maximum 6 handler-dog teams</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Price:</strong> Ksh 18,000 for the full course</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Location:</strong> CustomK9 Training Center, Nairobi</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">What to Bring</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Show lead and collar appropriate for your breed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Bait/treats (if used in showing your breed)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Grooming supplies for your breed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Vaccination records</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Water and bowl for your dog</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Comfortable shoes for gaiting</span>
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