"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthUser } from "@/services/auth/AuthService";
import ServiceFactory from "@/services/ServiceFactory";

// Dashboard navigation links
const dashboardNavLinks = [
  { href: "/client-area/dashboard", label: "Overview", icon: "home" },
  { href: "/client-area/dashboard/dogs", label: "My Dogs", icon: "paw" },
  { href: "/client-area/dashboard/training", label: "Training Plans", icon: "book" },
  { href: "/client-area/dashboard/calendar", label: "Appointments", icon: "calendar" },
  { href: "/client-area/dashboard/settings", label: "Settings", icon: "settings" },
];

// Icons component to render SVG icons
const Icon = ({ name }: { name: string }) => {
  switch (name) {
    case "home":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      );
    case "paw":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
        </svg>
      );
    case "book":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      );
    case "calendar":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      );
    case "message":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
      );
    case "file":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      );
    case "users":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      );
    case "settings":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      );
    case "bell":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
      );
    case "logo":
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path>
        </svg>
      );
    default:
      return null;
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Helper function to get session value from cookie
  const getSessionValue = (): string => {
    try {
      const cookies = document.cookie.split(';').map(c => c.trim());
      const cookie = cookies.find(c => c.startsWith('odoo_session='));
      return cookie ? decodeURIComponent(cookie.substring('odoo_session='.length)) : '';
    } catch (error) {
      console.error('Error getting session from cookie:', error);
      return '';
    }
  };

  // Get current user on mount and check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setAuthError(null);
        
        const authService = ServiceFactory.getInstance().getAuthService();
        const sessionValue = getSessionValue();
        
        console.log('🔍 Checking authentication...');
        console.log('Session value exists:', !!sessionValue);
        
        if (!sessionValue) {
          console.log('❌ No valid session found, redirecting to login');
          router.push('/login?session_expired=true');
          return;
        }
        
        // Get the current user
        const user = authService.getCurrentUser();
        console.log('Current user:', user);
        
        if (!user) {
          console.log('❌ No user data available, redirecting to login');
          router.push('/login?session_expired=true');
          return;
        }
        
        // If we get here, authentication is valid
        console.log('✅ Authentication successful for user:', user.name);
        setCurrentUser(user);
        setIsLoading(false);
        
      } catch (error) {
        console.error('❌ Error checking authentication:', error);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-r-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Don't render the dashboard if not authenticated
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Dashboard Content with Sidebar */}
      <div className="container mx-auto px-4 pt-6 pb-12">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <aside className={`hidden md:block w-64 bg-white rounded-xl shadow-md overflow-hidden sticky top-6 h-fit`}>
            {/* Logo and Brand */}
            <div className="p-6 bg-sky-600 text-white">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="logo" />
                <span className="font-bold text-lg">CustomK9</span>
              </div>
              
              {/* User Profile Summary */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-sky-200 flex items-center justify-center text-sky-600 font-bold text-xl border-2 border-white">
                  {getInitials(currentUser.name || 'User')}
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{currentUser.name || 'User'}</h2>
                  <p className="text-sky-200 text-sm">Premium Member</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="p-4">
              <ul className="space-y-2">
                {dashboardNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full transition-colors ${
                        pathname === link.href
                          ? "bg-sky-100 text-sky-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon name={link.icon} />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          
          {/* Mobile Sidebar Toggle */}
          <div className="md:hidden flex justify-between items-center mb-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2">
              <Icon name="logo" />
              <span className="font-bold text-lg text-sky-700">CustomK9</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg bg-sky-100 text-sky-700"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
          
          {/* Mobile Sidebar */}
          {isSidebarOpen && (
            <div className="md:hidden bg-white rounded-xl shadow-md overflow-hidden mb-4">
              {/* User Profile Summary */}
              <div className="p-4 bg-sky-600 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-sky-200 flex items-center justify-center text-sky-600 font-bold text-sm border-2 border-white">
                    {getInitials(currentUser.name || 'User')}
                  </div>
                  <div>
                    <h2 className="font-semibold">{currentUser.name || 'User'}</h2>
                    <p className="text-sky-200 text-xs">Premium Member</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation Links */}
              <nav className="p-2">
                <ul className="grid grid-cols-2 gap-2">
                  {dashboardNavLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm w-full transition-colors ${
                          pathname === link.href
                            ? "bg-sky-100 text-sky-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <Icon name={link.icon} />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
          
          {/* Main Content Area */}
          <main className="flex-1 bg-white rounded-xl shadow-md p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}