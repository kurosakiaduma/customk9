"use client";

import { useEffect } from "react";
import Image from "next/image";
import ServicesSection from "../components/sections/ServicesSection";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";

export default function ServicesPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Services */}
      <div className="relative h-[60vh] bg-sky-700 overflow-hidden">
        <Navigation />
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/behavior-consultation.jpg"
            alt="Dog services background"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/80 to-sky-700/40"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 h-full flex items-center relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
              Professional Dog Services
            </h1>
            <p className="text-xl text-white/90 mb-8 drop-shadow-md max-w-xl">
              From behavior consultations to training classes and welfare assessments, we provide comprehensive services for you and your canine companion.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#services" className="px-6 py-3 bg-white text-sky-700 hover:bg-sky-50 font-semibold rounded-full transition-colors shadow-md">
                View All Services
              </a>
              <a href="/booking" className="px-6 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold rounded-full transition-colors shadow-md">
                Book a Session
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div id="services">
        <ServicesSection />
      </div>
      
      <Footer />
    </div>
  );
} 