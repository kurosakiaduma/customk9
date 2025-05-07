"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";

export default function ClientAreaPage() {
  const [activeTab, setActiveTab] = useState("login");
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Client Area */}
      <div className="relative h-[50vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-with-owner.jpg"
            alt="Dog with owner accessing training resources"
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
              Client Portal
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Access your personalized training plans, track progress, and connect with our community of dog owners.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setActiveTab("login")}
                className="px-6 py-3 bg-white text-sky-700 hover:bg-sky-50 font-semibold rounded-full transition-colors shadow-md"
              >
                Login
              </button>
              <button 
                onClick={() => setActiveTab("register")}
                className="px-6 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold rounded-full transition-colors shadow-md"
              >
                Register
              </button>
              <a 
                href="/booking" 
                className="px-6 py-3 bg-yellow-500 text-white hover:bg-yellow-400 font-bold rounded-full transition-colors shadow-xl animate-pulse hover:animate-none transform hover:scale-105 flex items-center"
              >
                <span className="mr-2">Book Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-sky-50 to-transparent z-10"></div>
      </div>
      
      {/* Login/Register Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-full p-1 bg-gray-100">
                <button
                  className={`px-6 py-2 rounded-full text-sm md:text-base font-medium transition-colors ${
                    activeTab === "login" ? "bg-sky-600 text-white" : "text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>
                <button
                  className={`px-6 py-2 rounded-full text-sm md:text-base font-medium transition-colors ${
                    activeTab === "register" ? "bg-sky-600 text-white" : "text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("register")}
                >
                  Register
                </button>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              {activeTab === "login" ? (
                /* Login Form */
                <div>
                  <h2 className="text-2xl font-bold text-sky-700 mb-6">Welcome Back</h2>
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                        <a href="#" className="text-sm text-sky-600 hover:text-sky-800">Forgot password?</a>
                      </div>
                      <input 
                        type="password" 
                        id="password" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        placeholder="Enter your password"
                      />
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="remember" 
                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded" 
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md transition-colors shadow-md"
                    >
                      Sign In
                    </button>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <button 
                        className="text-sky-600 hover:text-sky-800 font-medium"
                        onClick={() => setActiveTab("register")}
                      >
                        Register
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <div>
                  <h2 className="text-2xl font-bold text-sky-700 mb-6">Create an Account</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                        <input 
                          type="text" 
                          id="firstName" 
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                        <input 
                          type="text" 
                          id="lastName" 
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="regEmail" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                      <input 
                        type="email" 
                        id="regEmail" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label htmlFor="regPassword" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                      <input 
                        type="password" 
                        id="regPassword" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        placeholder="Create a password"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Password must be at least 8 characters long with a mix of letters, numbers and symbols.
                      </p>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                      <input 
                        type="password" 
                        id="confirmPassword" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        placeholder="Confirm your password"
                      />
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center">
                        <input type="checkbox" id="terms" className="h-4 w-4 text-sky-600" />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                          I agree to the Terms of Service and Privacy Policy
                        </label>
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md transition-colors shadow-md"
                    >
                      Create Account
                    </button>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <button 
                        className="text-sky-600 hover:text-sky-800 font-medium"
                        onClick={() => setActiveTab("login")}
                      >
                        Login
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Client Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-sky-700 mb-12 text-center">
            Client Portal Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Training Plans</h3>
              <p className="text-gray-600">
                Access your personalized training plans, track progress, and review session notes from your trainer.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Bookings & Scheduling</h3>
              <p className="text-gray-600">
                Easily schedule new training sessions, view upcoming appointments, and manage your bookings.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Community Forum</h3>
              <p className="text-gray-600">
                Connect with other dog owners, share experiences, and get advice from our community of trainers and pet parents.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 