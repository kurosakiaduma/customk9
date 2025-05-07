"use client";

import { useEffect } from "react";
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
      <div className="h-[30vh] bg-gradient-to-b from-sky-700 to-sky-500 relative">
        <Navigation />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">References</h1>
        </div>
      </div>
      
      {/* Client Testimonials Section */}
      <TestimonialsSection />
      
      {/* Professional References Section */}
      <section className="py-16 bg-gradient-to-b from-sky-100 to-white">
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