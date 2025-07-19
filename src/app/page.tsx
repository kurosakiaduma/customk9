"use client";

import { useEffect } from "react";
import HeroSection from "./components/sections/HeroSection";
import ServicesSection from "./components/sections/ServicesSection";
import EducationSection from "./components/sections/EducationSection";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import Footer from "./components/layout/Footer";
import Navigation from "./components/layout/Navigation";

export default function Home() {
  // Enable smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.hash && link.hash.startsWith('#') && link.origin === window.location.origin) {
        e.preventDefault();
        
        const targetId = link.hash.slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Account for fixed header
            behavior: 'smooth'
          });
          
          // Update URL without causing a page refresh
          window.history.pushState(null, '', link.hash);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <EducationSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
