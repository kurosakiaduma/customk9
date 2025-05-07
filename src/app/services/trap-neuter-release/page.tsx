"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

export default function TrapNeuterReleasePage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for TNR */}
      <div className="relative h-[50vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-08.jpg"
            alt="Trap, Neuter, Release program for community animals"
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
              Trap, Neuter and Release (TNR)
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Humane population management for community animals to improve welfare and reduce overpopulation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/client-area" 
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-md"
              >
                Request TNR Service
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
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">About Our TNR Program</h2>
              
              <div className="prose prose-lg max-w-none">
                <p>
                  Our Trap, Neuter, and Release (TNR) program is a humane and effective approach to managing community animal populations. By sterilizing community animals and returning them to their familiar environment, we help reduce overpopulation while respecting the animals' established territories and caretakers.
                </p>
                
                <h3>How TNR Works</h3>
                <p>
                  Our TNR process follows these essential steps:
                </p>
                <ul>
                  <li><strong>Trap:</strong> Humanely capture community animals using specialized traps designed to minimize stress</li>
                  <li><strong>Neuter:</strong> Transport animals to partnering veterinary facilities for spay/neuter surgery, vaccination, and ear tipping (for identification)</li>
                  <li><strong>Release:</strong> Return animals to their original location after recovery, where they can continue their lives without contributing to population growth</li>
                  <li><strong>Monitor:</strong> Provide ongoing support to community caregivers for long-term welfare monitoring</li>
                </ul>
                
                <h3>Benefits of TNR</h3>
                <ul>
                  <li>Humanely reduces community animal populations over time</li>
                  <li>Decreases nuisance behaviors associated with mating (fighting, roaming, spraying)</li>
                  <li>Improves the health and lifespan of community animals</li>
                  <li>Reduces the number of animals entering overcrowded shelters</li>
                  <li>Creates safer, healthier neighborhoods for both animals and residents</li>
                  <li>Provides a sustainable, long-term solution to overpopulation</li>
                </ul>
                
                <h3>Community Involvement</h3>
                <p>
                  Community engagement is essential to the success of TNR programs. We work closely with:
                </p>
                <ul>
                  <li>Neighborhood residents and caretakers of community animals</li>
                  <li>Apartment complexes and property managers</li>
                  <li>Business owners with animals on their property</li>
                  <li>Local government and municipal agencies</li>
                  <li>Schools, churches, and community centers</li>
                  <li>Volunteer networks who help with trapping and transportation</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">Program Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Services & Pricing</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Basic TNR Package:</strong> Ksh 3,500 per animal</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Includes:</strong> Trapping, transportation, spay/neuter surgery, rabies vaccination, ear tipping, and post-operative care</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Trap Rental:</strong> Ksh 500 deposit (refundable upon return)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Colony Management Consultation:</strong> Ksh 2,000</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Subsidized Programs:</strong> Available for large colonies or low-income areas (please inquire)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">How to Request TNR Service</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">1.</span>
                      <span>Complete our online request form or call our office</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">2.</span>
                      <span>Our coordinator will contact you to assess the situation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">3.</span>
                      <span>We'll develop a TNR plan specific to your community</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">4.</span>
                      <span>Our team will schedule and implement the TNR process</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">5.</span>
                      <span>We provide follow-up support and education for continued care</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Volunteer & Support Opportunities</h3>
                <p className="mb-6">
                  Our TNR program relies on community support. Here's how you can help:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Volunteer as a trapper or transporter</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Sponsor TNR for a colony in need</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Donate supplies (traps, carriers, blankets)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Become a colony caretaker in your neighborhood</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Advocate for TNR in your community</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  href="/client-area" 
                  className="inline-block px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-lg"
                >
                  Request TNR Service Now
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