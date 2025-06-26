"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ServiceFactory from "@/services/ServiceFactory";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Use the proper AuthService logout which handles both Odoo and local storage
      const authService = ServiceFactory.getInstance().getAuthService();
      await authService.logout();
      
      console.log("✅ User logged out successfully from settings");
      
      // Redirect with logout parameter to prevent immediate redirect back
      window.location.href = "/client-area?logout=true";
    } catch (error) {
      console.error("❌ Error during logout:", error);
      // Force redirect even if logout API fails, with logout parameter
      window.location.href = "/client-area?logout=true";
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-sky-800">Account Settings</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-6">Profile & Preferences</h2>
        
        <div className="space-y-6 mb-8">
          <p className="text-gray-600">
            Settings management is currently under development. 
            Soon you'll be able to update your profile information, change notification preferences, 
            and manage your account settings.
          </p>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium mb-4">Account Actions</h3>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors flex items-center"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging Out...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 