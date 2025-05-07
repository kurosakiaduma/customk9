"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

export default function EducationPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Education */}
      <div className="relative h-[50vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-09.jpg"
            alt="Dog training education workshop"
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
              Education Programs
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Workshops, seminars, and educational resources to deepen your understanding of dog behavior and training.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/client-area" 
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-md"
              >
                Register for Events
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
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">Our Educational Offerings</h2>
              
              <div className="prose prose-lg max-w-none">
                <p>
                  Our education programs are designed to empower dog owners, aspiring trainers, and animal professionals with knowledge and skills based on the latest scientific understanding of canine behavior. Whether you're looking to better understand your own dog or pursuing a career in dog training, we offer a variety of learning opportunities to suit your needs.
                </p>
                
                <h3>Types of Educational Programs</h3>
                <ul>
                  <li><strong>Public Workshops:</strong> Single-day events focused on specific topics like understanding body language, managing reactivity, or enrichment activities</li>
                  <li><strong>Seminar Series:</strong> Multi-session deep dives into comprehensive topics like positive reinforcement training or behavior modification</li>
                  <li><strong>Professional Development:</strong> Specialized training for veterinary staff, shelter workers, and professional dog trainers</li>
                  <li><strong>Webinars:</strong> Online learning opportunities with live Q&A sessions</li>
                  <li><strong>School Programs:</strong> Educational visits to schools teaching children about dog safety and responsible pet ownership</li>
                  <li><strong>Corporate Team Building:</strong> Unique workshops that use dog training principles to improve workplace communication</li>
                </ul>
                
                <h3>Upcoming Events</h3>
                <div className="space-y-6">
                  <div className="p-4 bg-white/80 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-sky-700">Understanding Canine Body Language</h4>
                    <p className="text-sm text-gray-500 mb-2">June 15, 2023 • 9:00 AM - 1:00 PM • CustomK9 Training Center</p>
                    <p>Learn to read subtle cues and signals that dogs use to communicate their emotional state. This workshop includes live demonstrations and practice exercises.</p>
                    <p className="mt-2 font-medium">Ksh 3,500 per person • Limited to 20 participants</p>
                  </div>
                  
                  <div className="p-4 bg-white/80 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-sky-700">Positive Reinforcement Training: Beyond the Basics</h4>
                    <p className="text-sm text-gray-500 mb-2">July 8-9, 2023 • 9:00 AM - 4:00 PM • CustomK9 Training Center</p>
                    <p>A comprehensive two-day seminar exploring advanced applications of positive reinforcement training methods. Suitable for trainers and serious enthusiasts.</p>
                    <p className="mt-2 font-medium">Ksh 12,000 per person • Limited to 15 participants</p>
                  </div>
                  
                  <div className="p-4 bg-white/80 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-sky-700">Enrichment for the Modern Dog</h4>
                    <p className="text-sm text-gray-500 mb-2">August 20, 2023 • 2:00 PM - 5:00 PM • CustomK9 Training Center</p>
                    <p>Discover creative ways to provide mental stimulation and enrichment for your dog. Includes hands-on activities and take-home materials.</p>
                    <p className="mt-2 font-medium">Ksh 2,500 per person • Limited to 25 participants</p>
                  </div>
                </div>
                
                <h3>Custom Programs</h3>
                <p>
                  We offer tailored educational programs for organizations, clubs, and businesses. Our experts can develop curriculum specific to your group's needs, including:
                </p>
                <ul>
                  <li>Staff training for veterinary clinics and animal shelters</li>
                  <li>Safety protocols for businesses that welcome dogs</li>
                  <li>Community education for neighborhood associations</li>
                  <li>Specialized topics for dog club members</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">Education Program Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Program Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Expert Instructors:</strong> All programs led by certified professionals with extensive experience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Comprehensive Materials:</strong> Take-home resources included with all workshops</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Hands-On Learning:</strong> Interactive components in all in-person programs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Science-Based Content:</strong> Current, evidence-based information from animal behavior science</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Continuing Education:</strong> CE credits available for qualified programs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Community Building:</strong> Connect with like-minded dog enthusiasts</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Registration Information</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Pre-registration Required:</strong> All events require advance booking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Payment Options:</strong> M-Pesa, credit card, or bank transfer</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Group Discounts:</strong> Available for 3+ participants from same organization</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Cancellation Policy:</strong> Full refund up to 7 days before event, 50% refund within 7 days</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Wait Lists:</strong> Available for sold-out events</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Certificate:</strong> Provided upon completion of multi-day courses</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Request a Custom Program</h3>
                <p className="mb-6">
                  Interested in a tailored educational program for your organization? We can develop custom content for:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Veterinary clinics and staff</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Animal shelter and rescue organizations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Dog clubs and community groups</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Schools and educational institutions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Corporate team-building events</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  href="/client-area" 
                  className="inline-block px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-lg"
                >
                  View Upcoming Programs
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