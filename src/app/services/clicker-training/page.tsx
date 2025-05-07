"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

export default function ClickerTrainingPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Clicker Training */}
      <div className="relative h-[50vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-02.jpg"
            alt="Dog training with clicker"
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
              Clicker Training
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Master precise timing and clear communication with your dog through positive reinforcement clicker training.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/client-area" 
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-md"
              >
                Book This Class
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
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">About This Class</h2>
              
              <div className="prose prose-lg max-w-none">
                <p>
                  Our Clicker Training workshop introduces you to one of the most effective and scientifically-backed training methods. Clicker training is a positive reinforcement technique that uses a distinct clicking sound to mark the exact moment your dog performs a desired behavior. This precise communication helps dogs learn faster and with greater enthusiasm.
                </p>
                
                <h3>What You'll Learn</h3>
                <ul>
                  <li>The science behind clicker training and operant conditioning</li>
                  <li>Proper clicker mechanics and timing</li>
                  <li>How to "charge" the clicker and establish its value</li>
                  <li>Using the clicker to shape new behaviors</li>
                  <li>Capturing and marking naturally occurring behaviors</li>
                  <li>Luring and fading food lures in conjunction with the clicker</li>
                  <li>Chaining behaviors to create complex sequences</li>
                  <li>Troubleshooting common clicker training challenges</li>
                </ul>
                
                <h3>Workshop Structure</h3>
                <p>
                  This workshop is offered as a one-day intensive session or as a 3-week course with weekly 90-minute sessions. The format includes both demonstrations and hands-on practice to help you develop your clicker skills.
                </p>
                <ul>
                  <li>Introduction to clicker training principles and equipment</li>
                  <li>Hands-on practice with clicker mechanics and timing</li>
                  <li>Working on basic behaviors using the clicker</li>
                  <li>Advancing to shaping new behaviors</li>
                  <li>Problem-solving and troubleshooting session</li>
                  <li>Creating a training plan for continued practice at home</li>
                </ul>
                
                <h3>Requirements</h3>
                <ul>
                  <li>Dogs of any age welcome (puppies should be at least 10 weeks old)</li>
                  <li>No prior training experience necessary</li>
                  <li>Up-to-date on vaccinations</li>
                  <li>A clicker (provided if you don't have one)</li>
                  <li>Small, soft, high-value treats</li>
                  <li>Treat pouch for easy access to rewards</li>
                  <li>6-foot leash and flat collar or harness</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">Workshop Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Schedule & Pricing</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>One-Day Intensive:</strong> 6 hours (with breaks)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Weekly Format:</strong> 3 weeks, 90 minutes per week</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Class Size:</strong> Maximum 8 dogs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Price:</strong> Ksh 8,000 for one-day intensive</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Price:</strong> Ksh 10,000 for 3-week course</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span><strong>Location:</strong> CustomK9 Training Center, Nairobi</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Benefits of Clicker Training</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Clear, precise communication with your dog</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Faster learning and stronger retention of behaviors</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Increased engagement and enthusiasm from your dog</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Versatile tool that works for dogs of all ages and breeds</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Force-free method that builds confidence and trust</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-600 mr-2">•</span>
                      <span>Foundation for teaching complex behaviors and tricks</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  href="/client-area" 
                  className="inline-block px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors shadow-lg"
                >
                  Book Your Spot Now
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