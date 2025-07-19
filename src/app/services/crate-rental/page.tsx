"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

export default function CrateRentalPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Crate Rental */}
      <div className="relative h-[50vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-01.jpg"
            alt="Dog crate and training equipment"
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
              Crate Rental Service
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Quality crates and training equipment available for rent to support your dog's training and comfort needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/client-area" 
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-md"
              >
                Reserve Equipment
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
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">About Our Rental Service</h2>
              
              <div className="prose prose-lg max-w-none">
                <p>
                  Our Crate Rental service provides high-quality, sanitized crates and training equipment on a flexible rental basis. This service is perfect for owners who need temporary equipment for travel, training, recovery after surgery, or to try before purchasing their own. All rentals include guidance on proper use and setup.
                </p>
                
                <h3>Equipment Available for Rent</h3>
                <ul>
                  <li><strong>Wire Crates:</strong> Various sizes from small (for puppies) to extra-large (for giant breeds)</li>
                  <li><strong>Plastic Travel Crates:</strong> Airline-approved options for safe travel</li>
                  <li><strong>Exercise Pens:</strong> Adjustable containment for puppies or recovery</li>
                  <li><strong>Baby Gates:</strong> For doorways and stairways</li>
                  <li><strong>Long Lines:</strong> For recall training and outdoor exploration</li>
                  <li><strong>Training Equipment:</strong> Including gentle leaders, no-pull harnesses, and training leashes</li>
                  <li><strong>Enrichment Tools:</strong> Puzzle feeders and interactive toys</li>
                </ul>
                
                <h3>Why Rent Instead of Buy?</h3>
                <ul>
                  <li>Try before you invest in permanent equipment</li>
                  <li>Short-term needs (travel, visitors, recovery)</li>
                  <li>Growing puppies who quickly outgrow equipment</li>
                  <li>Storage limitations in your home</li>
                  <li>Budget-friendly alternative to purchasing</li>
                  <li>Access to professional-grade equipment</li>
                  <li>Environmentally conscious choice (reuse vs. new purchase)</li>
                </ul>
                
                <h3>How It Works</h3>
                <ol>
                  <li>Browse our available equipment online or in person</li>
                  <li>Select the items you need and your rental period</li>
                  <li>Pay a security deposit and first rental period fee</li>
                  <li>Pick up your cleaned and sanitized equipment</li>
                  <li>Receive instructions on proper setup and use</li>
                  <li>Return equipment clean and in good condition</li>
                  <li>Receive your deposit back (minus any damages)</li>
                </ol>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">Rental Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Pricing & Terms</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Small Crate:</strong> Ksh 500/week or Ksh 1,500/month</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Medium Crate:</strong> Ksh 700/week or Ksh 2,000/month</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Large Crate:</strong> Ksh 900/week or Ksh 2,500/month</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>XL Crate:</strong> Ksh 1,200/week or Ksh 3,000/month</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Exercise Pen:</strong> Ksh 800/week or Ksh 2,200/month</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Training Equipment:</strong> Ksh 300-800/week depending on item</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Security Deposit:</strong> Equal to one week's rental</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Rental Periods:</strong> Weekly or monthly options</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Extensions:</strong> Available with 24-hour notice</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Pickup/Return:</strong> During business hours at our facility</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Delivery:</strong> Available within Nairobi for Ksh 500</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Purchase Option:</strong> Rental fees can be applied to purchase</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Client Discount:</strong> 20% off for current training clients</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Crate Training Support</h3>
                <p className="mb-6">
                  All rentals include:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Setup instructions and demonstration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Basic crate training guide</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Email support for questions during rental period</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2">•</span>
                    <span>Option to add a 30-minute crate training consultation (Ksh 1,500)</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  href="/client-area" 
                  className="inline-block px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-lg"
                >
                  Reserve Equipment Now
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