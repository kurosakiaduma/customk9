"use client";

import { useEffect } from "react";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";

export default function BookingPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      <div className="h-[30vh] bg-gradient-to-b from-sky-700 to-sky-500 relative">
        <Navigation />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">Class Booking</h1>
        </div>
      </div>
      
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-sky-700">Register for an Upcoming Class</h2>
            <p className="mb-8 text-gray-700">
              Complete the form below to register for one of our upcoming training classes. We'll contact you with confirmation and details.
            </p>
            
            <form className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-sky-600">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" id="firstName" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" id="lastName" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" id="phone" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                </div>
              </div>
              
              {/* Dog Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-sky-600">Dog Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dogName" className="block mb-2 text-sm font-medium text-gray-700">Dog's Name</label>
                    <input type="text" id="dogName" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label htmlFor="dogBreed" className="block mb-2 text-sm font-medium text-gray-700">Breed</label>
                    <input type="text" id="dogBreed" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label htmlFor="dogAge" className="block mb-2 text-sm font-medium text-gray-700">Age</label>
                    <input type="text" id="dogAge" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label htmlFor="dogGender" className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
                    <select id="dogGender" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Class Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-sky-600">Class Selection</h3>
                <div>
                  <label htmlFor="classType" className="block mb-2 text-sm font-medium text-gray-700">Class Type</label>
                  <select id="classType" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="">Select a Class</option>
                    <option value="puppy">Puppy Basics (8-16 weeks)</option>
                    <option value="beginner">Beginner Obedience</option>
                    <option value="intermediate">Intermediate Training</option>
                    <option value="advanced">Advanced Skills</option>
                    <option value="behavior">Behavior Modification</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label htmlFor="additionalInfo" className="block mb-2 text-sm font-medium text-gray-700">Additional Information</label>
                  <textarea id="additionalInfo" rows={4} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"></textarea>
                </div>
              </div>
              
              <div>
                <button type="submit" className="w-full md:w-auto px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors text-center shadow-lg">
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 