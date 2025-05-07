"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

export default function DogAndFamilyTrainingPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Dog and Family Training */}
      <div className="relative h-[50vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-06.jpg"
            alt="Family training with dog"
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
              Dog and Family Training
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Involving the whole family in your dog's training for a harmonious household and consistent communication.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/client-area" 
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-md"
              >
                Book This Program
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
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">About This Program</h2>
              
              <div className="prose prose-lg max-w-none">
                <p>
                  Our Dog and Family Training program is specially designed to include all family members in the training process, creating a cohesive approach to your dog's education. This program recognizes that dogs respond best when they receive consistent cues and expectations from everyone in the household, including children (when age-appropriate).
                </p>
                
                <h3>What Your Family Will Learn</h3>
                <ul>
                  <li>Age-appropriate handling and training techniques for each family member</li>
                  <li>Establishing clear and consistent boundaries across all family members</li>
                  <li>Safe interaction protocols between children and dogs</li>
                  <li>Reading and responding to dog body language and stress signals</li>
                  <li>Managing common household challenges (doorbell, visitors, mealtimes)</li>
                  <li>Creating a communication plan that works for the whole family</li>
                  <li>Fun training games that strengthen the bond between dog and family</li>
                </ul>
                
                <h3>Program Structure</h3>
                <p>
                  This is a 6-week program with weekly 75-minute sessions in your home. We believe that training in your home environment provides the most relevant and practical results for family dynamics.
                </p>
                <ul>
                  <li>Week 1: Assessment and foundation skills</li>
                  <li>Week 2: Basic commands and consistency training</li>
                  <li>Week 3: Child-dog interaction and safety protocols</li>
                  <li>Week 4: Household management and boundary setting</li>
                  <li>Week 5: Managing visitors and public outings</li>
                  <li>Week 6: Problem-solving and advanced family integration</li>
                </ul>
                
                <h3>Special Features</h3>
                <ul>
                  <li>Age-appropriate involvement for all family members</li>
                  <li>Child-friendly training materials and visual aids</li>
                  <li>Weekly family training plans with assigned responsibilities</li>
                  <li>Video review of training sessions for family members who can't attend</li>
                  <li>WhatsApp support between sessions</li>
                  <li>Special focus on households with children under 12</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">Program Details</h2>
              
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
                      <span><strong>Session Length:</strong> 75 minutes per week</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Location:</strong> In-home training</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Price:</strong> Ksh 25,000 for the full program</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Includes:</strong> Training materials, family handbook, and training tools</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Benefits for Your Family</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Improved safety between children and dogs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Reduced frustration from inconsistent training</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Teaching children responsibility and empathy</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Clear communication system for the entire family</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>More peaceful household with fewer dog behavior issues</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Stronger bonds between all family members and the dog</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Is This Program Right for Your Family?</h3>
                <p className="mb-6">
                  This program is ideal for:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Families with children who want to safely include them in dog training</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Households where the dog responds differently to different family members</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Families preparing for or adjusting to a new baby or child</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Multi-generational households needing a unified approach</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Families with a new rescue dog who needs consistent guidance</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  href="/client-area" 
                  className="inline-block px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-lg"
                >
                  Schedule Your Family Consultation
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