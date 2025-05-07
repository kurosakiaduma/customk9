"use client";

import HeroSection from "./components/sections/HeroSection";
import ServicesSection from "./components/sections/ServicesSection";
import EducationSection from "./components/sections/EducationSection";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import Footer from "./components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      <HeroSection />
      <ServicesSection />
      <EducationSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
