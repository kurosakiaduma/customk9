"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";

export default function ClientAreaPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Client Area */}
      <div className="relative h-[50vh] bg-sky-800 overflow-hidden">
        <Navigation />
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-08.jpg"
            alt="Dog with owner"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/70 via-sky-800/60 to-sky-700/50"></div>
          
          {/* Abstract Decorative Elements */}
          <div className="absolute -right-28 -top-28 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -left-28 -bottom-28 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 h-full flex items-center relative z-10">
          <div className="max-w-md animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
              Client Portal
            </h1>
            <p className="text-xl text-white/90 mb-8 drop-shadow-md max-w-xl">
              Access your personalized training plans, progress reports, and book additional services.
            </p>
            
            <div className="flex items-center space-x-6 mt-6">
              <div className="flex -space-x-4">
                <div className="w-10 h-10 rounded-full bg-sky-300 flex items-center justify-center border-2 border-white text-sky-800 font-bold">JM</div>
                <div className="w-10 h-10 rounded-full bg-sky-400 flex items-center justify-center border-2 border-white text-white font-bold">KO</div>
                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center border-2 border-white text-white font-bold">SN</div>
                <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center border-2 border-white text-white font-bold">+52</div>
              </div>
              <p className="text-white/90 text-sm">Join our community of dog owners</p>
            </div>
          </div>
        </div>
      </div>
      
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto bg-white/70 backdrop-blur-md p-8 rounded-lg shadow-lg">
            <div className="flex border-b border-gray-200 mb-6">
              <button 
                className={`pb-4 px-4 text-lg font-medium ${isLogin ? 'text-sky-600 border-b-2 border-sky-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button 
                className={`pb-4 px-4 text-lg font-medium ${!isLogin ? 'text-sky-600 border-b-2 border-sky-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>
            
            {isLogin ? (
              // Login Form
              <form className="space-y-6">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                  <input type="password" id="password" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input type="checkbox" id="remember" className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded" />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
                  </div>
                  <a href="#" className="text-sm text-sky-600 hover:text-sky-700">Forgot password?</a>
                </div>
                <div>
                  <button type="submit" className="w-full px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md transition-colors text-center">
                    Sign In
                  </button>
                </div>
              </form>
            ) : (
              // Registration Form
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" id="firstName" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" id="lastName" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                </div>
                <div>
                  <label htmlFor="regEmail" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" id="regEmail" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <div>
                  <label htmlFor="regPassword" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                  <input type="password" id="regPassword" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                  <input type="password" id="confirmPassword" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="terms" className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded" />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">I agree to the <a href="#" className="text-sky-600 hover:text-sky-700">Terms and Conditions</a></label>
                </div>
                <div>
                  <button type="submit" className="w-full px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md transition-colors text-center">
                    Create Account
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 