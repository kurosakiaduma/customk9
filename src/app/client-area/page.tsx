"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";
import ServiceFactory from "@/services/ServiceFactory";

export default function ClientAreaPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState("");  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const router = useRouter();
  const authService = ServiceFactory.getInstance().getAuthService();
  // Check user authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setCheckingAuth(true);
      const urlParams = new URLSearchParams(window.location.search);
      
      if (urlParams.get('logout') === 'true') {
        console.log('User explicitly logged out, clearing session.');
        await authService.logout();
        setIsAuthenticated(false);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // Use the synchronous check against our custom cookie
        const isAuthenticated = authService.isAuthenticated();
        console.log('Session check, user is authenticated:', isAuthenticated);
        setIsAuthenticated(isAuthenticated);
        
        // If not authenticated via cookie, try a full session restore as a fallback
        if (!isAuthenticated) {
          console.log('No cookie, attempting full session restore...');
          const user = await authService.getCurrentUser();
          setIsAuthenticated(!!user);
        }
      }
      setCheckingAuth(false);
    };

    checkAuthStatus();

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [authService]);

  // Redirect to dashboard if authenticated (but not if just logged out)
  useEffect(() => {
    if (isAuthenticated && !checkingAuth) {
      // Check for redirect URL in query params
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect');
      
      if (redirectTo) {
        // If we have a redirect URL, use it
        console.log('Redirecting to:', redirectTo);
        router.push(decodeURIComponent(redirectTo));
      } else {
        // Otherwise go to dashboard
        console.log('No redirect URL, going to dashboard');
        router.push("/client-area/dashboard");
      }
    }
  }, [isAuthenticated, checkingAuth, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);

    try {
      // Simple validation
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      console.log('Attempting login for:', email);
      const user = await authService.login(email, password);
      console.log('Login successful for user:', user.email);

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('customk9_remember_me', 'true');
      } else {
        localStorage.removeItem('customk9_remember_me');
      }

      // Set authentication state
      setIsAuthenticated(true);
      // The useEffect will handle the redirect
    } catch (error) {
      console.error('Login error:', error);
      setFormError(error instanceof Error ? error.message : "Login failed. Please try again.");
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);
    try {
      // Simple validation
      if (!email || !password || !firstName || !lastName || !phone) {
        throw new Error("Please fill in all required fields");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (!termsAccepted) {
        throw new Error("You must accept the terms and conditions");
      }
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      // Create user
      const user = await authService.register({
        name: `${firstName} ${lastName}`,
        email,
        phone,
        password
      });
      console.log('Registration successful for user:', user.email);

      // After registration, redirect to login tab and show message
      setActiveTab("login");
      setSuccessMessage("Registration successful! Please log in with your new credentials.");
      setFormError("");
      setIsAuthenticated(false);
      setCheckingAuth(false);
      // Optionally clear registration fields
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTermsAccepted(false);
      return;
    } catch (error) {
      console.error('Registration error:', error);
      setFormError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateGuestLogin = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Store fake auth token for demo
      // ...existing code...
      
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
  };

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
              <button 
                onClick={simulateGuestLogin}
                className="px-6 py-3 bg-sky-700 text-white hover:bg-sky-800 font-semibold rounded-full transition-colors shadow-md flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  "Try Demo"
                )}
              </button>
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
              {/* Form Error Message */}
              {formError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6 flex items-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{formError}</span>
                </div>
              )}
              
              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 text-green-700 p-3 rounded-md mb-6 flex items-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{successMessage}</span>
                </div>
              )}
              
              {activeTab === "login" ? (
                /* Login Form */
                <div>
                  <h2 className="text-2xl font-bold text-sky-700 mb-6">Welcome Back</h2>
                  <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                      <input 
                        type="username" 
                        id="email" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="remember" 
                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={isLoading}
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md transition-colors shadow-md flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Don&apos;t have an account?{" "}
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
                <div>
                  <h2 className="text-2xl font-bold text-sky-700 mb-6">Create Account</h2>
                  <form className="space-y-6" onSubmit={handleRegister}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                        <input 
                          type="text" 
                          id="firstName" 
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                          placeholder="Your first name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                        <input 
                          type="text" 
                          id="lastName" 
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                          placeholder="Your last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        placeholder="Your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="regEmail" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                      <input 
                        type="email" 
                        id="regEmail" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="regPassword" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                      <input 
                        type="password" 
                        id="regPassword" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        placeholder="Create a password (min. 8 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                      <input 
                        type="password" 
                        id="confirmPassword" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="terms" 
                          className="h-4 w-4 text-sky-600"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)} 
                          disabled={isLoading}
                          required
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                          I agree to the Terms of Service and Privacy Policy
                        </label>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md transition-colors shadow-md flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
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