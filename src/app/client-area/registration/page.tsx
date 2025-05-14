"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SimplifiedRegistrationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Here in a real application, you would send the form data to your backend
    
    // For this demo, we'll redirect to the dashboard after a short delay
    try {
      // Simulate successful registration/login
      localStorage.setItem("customk9_auth_token", "demo_token_12345");
      
      // Mark the user as needing to complete the intake form
      localStorage.setItem("customk9_intake_completed", "false");
      
      // Show success message
      setSubmissionStatus({
        success: true,
        message: "Your account has been created successfully! Redirecting to dashboard..."
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/client-area/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error creating account:", error);
      setSubmissionStatus({
        success: false,
        message: "There was an error creating your account. Please try again."
      });
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-sky-800 mb-2">Registration Complete</h1>
        <p className="text-gray-600">
          Thank you for registering with CustomK9! Your account registration is complete, but we still need some information about your dog to provide you with the best training experience.
        </p>
        <p className="text-gray-600 mt-4">
          After logging in to your dashboard, you'll be prompted to complete a dog intake form. This will help us understand your dog's needs and create a personalized training plan.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-sky-700 mb-4">What Happens Next?</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Login to your dashboard using your new account</li>
            <li>Complete the dog intake form to tell us about your dog</li>
            <li>Browse available training programs and schedules</li>
            <li>Book your first training session</li>
          </ol>
          
          <div className="mt-6">
            <Link 
              href="/client-area" 
              className="inline-block px-4 py-2 bg-sky-600 text-white font-medium rounded-md hover:bg-sky-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-sky-700 mb-4">Benefits of Your Account</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Access to personalized training plans</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Book and manage training sessions online</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Track your dog's progress over time</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Access to exclusive training resources</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Connect with our community of dog owners</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Submission status message */}
      {submissionStatus && (
        <div className={`p-4 rounded-md ${
          submissionStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <div className="flex items-start">
            {submissionStatus.success ? (
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
            <span>{submissionStatus.message}</span>
          </div>
        </div>
      )}
    </div>
  );
} 