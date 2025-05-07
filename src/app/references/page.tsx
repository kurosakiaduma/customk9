"use client";

import { useEffect } from "react";
import Image from "next/image";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";
import TestimonialsSection from "../components/sections/TestimonialsSection";

export default function ReferencesPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for References */}
      <div className="relative h-[60vh] bg-sky-800 overflow-hidden">
        <Navigation />
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-10.jpg"
            alt="Happy dogs with owners"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/80 to-sky-600/50"></div>
          
          {/* Decorative Quote Marks */}
          <div className="absolute top-[20%] left-[10%] text-[200px] text-white/10 font-serif leading-none">
            "
          </div>
          <div className="absolute bottom-[20%] right-[10%] text-[200px] text-white/10 font-serif leading-none rotate-180">
            "
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 h-full flex items-center relative z-10">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
              What Our Clients Say
            </h1>
            <p className="text-xl text-white/90 mb-8 drop-shadow-md max-w-xl mx-auto italic">
              "We're proud to share the experiences of our clients and the professional organizations that endorse our work."
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#testimonials" className="px-6 py-3 bg-white text-sky-700 hover:bg-sky-50 font-semibold rounded-full transition-colors shadow-md">
                Read Testimonials
              </a>
              <a href="#professional-references" className="px-6 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold rounded-full transition-colors shadow-md">
                Professional References
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Client Testimonials Section */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      
      {/* Professional References Section */}
      <section id="professional-references" className="py-16 bg-gradient-to-b from-sky-100 to-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-sky-700">Professional References</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Professional Reference Card 1 */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-sky-100">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 bg-sky-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-sky-700">KV</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-sky-800">Kenya Veterinary Association</h3>
                  <p className="mb-4 text-gray-700">"CustomK9 Kenya has consistently demonstrated high standards in animal welfare education and training methods."</p>
                  <p className="text-sm text-gray-600 italic">Dr. John Mwangi, President</p>
                </div>
              </div>
            </div>
            
            {/* Professional Reference Card 2 */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-sky-100">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 bg-sky-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-sky-700">KK</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-sky-800">Kennel Club of Kenya</h3>
                  <p className="mb-4 text-gray-700">"We highly recommend their training approaches which are both effective and humane, focusing on building strong dog-owner relationships."</p>
                  <p className="text-sm text-gray-600 italic">Sarah Nyanjui, Director</p>
                </div>
              </div>
            </div>
            
            {/* Professional Reference Card 3 */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-sky-100">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 bg-sky-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-sky-700">NP</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-sky-800">Nairobi Pet Expo</h3>
                  <p className="mb-4 text-gray-700">"Their educational seminars are always among the most popular and well-received at our annual events."</p>
                  <p className="text-sm text-gray-600 italic">Michael Omondi, Event Coordinator</p>
                </div>
              </div>
            </div>
            
            {/* Professional Reference Card 4 */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-sky-100">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 bg-sky-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-sky-700">KC</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-sky-800">Karen Canine Center</h3>
                  <p className="mb-4 text-gray-700">"We've collaborated on several training programs and can attest to their professionalism and excellence in dog behavior and welfare education."</p>
                  <p className="text-sm text-gray-600 italic">Elizabeth Wangari, Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 