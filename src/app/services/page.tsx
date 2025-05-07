"use client";

import { useEffect } from "react";
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
      <div className="h-[30vh] bg-gradient-to-b from-sky-700 to-sky-500 relative">
        <Navigation />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">Our Services</h1>
        </div>
      </div>
      
      <ServicesSection />
      <Footer />
    </div>
  );
} 