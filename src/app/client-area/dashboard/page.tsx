"use client";

import { useState, useEffect } from "react";
import { format, isValid } from 'date-fns';
import Image from "next/image";
import Link from "next/link";
import ServiceFactory from "@/services/ServiceFactory";
import { OdooCalendarService } from "@/services/OdooCalendarService";
import { Dog, TrainingPlan } from "@/types/odoo";

// Components
const WelcomeSection = ({ name }: { name: string }) => (
  <div className="mb-8">
    <h1 className="text-2xl md:text-3xl font-bold text-sky-800 mb-2">
      Welcome back, {name}!
    </h1>
    <p className="text-gray-600">
      Here's an overview of your dogs' training progress and upcoming sessions.
    </p>
  </div>
);

const SummaryCard = ({ 
  title, 
  value, 
  icon, 
  color = "sky",
  link = "#"
}: { 
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "sky" | "green" | "amber" | "purple";
  link?: string;
}) => {
  const colorClasses = {
    sky: "bg-sky-100 text-sky-700",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    purple: "bg-purple-100 text-purple-700",
  };
  
  return (
    <Link 
      href={link} 
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    </Link>
  );
};

const DogProfileCard = ({ dog }: { dog: any }) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-32 w-full">
        <Image
          src={imageError ? "/images/dog-placeholder.jpg" : dog.image}
          alt={dog.name}
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
          onError={() => setImageError(true)}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{dog.name}</h3>
          <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs">
            {dog.level}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3">{dog.breed}, {dog.age}</p>
        
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Training Progress</span>
            <span className="font-medium">{dog.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-sky-600 h-2 rounded-full" 
              style={{ width: `${dog.progress}%` }}
            ></div>
          </div>
        </div>
        
        {dog.intakeDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Intake Information</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li><span className="font-medium">Source:</span> {dog.intakeDetails.dogSource}</li>
              <li><span className="font-medium">Time with dog:</span> {dog.intakeDetails.timeWithDog}</li>
              <li><span className="font-medium">Vet:</span> {dog.intakeDetails.vetName}</li>
              <li><span className="font-medium">Walk routine:</span> {dog.intakeDetails.walkFrequency}</li>
            </ul>
          </div>
        )}
        
        <div className="mt-4">
          <Link 
            href={`/client-area/dashboard/dogs/${dog.id}`}
            className="text-sky-600 hover:text-sky-800 text-sm font-medium"
          >
            View Profile →
          </Link>
        </div>
      </div>
    </div>
  );
};

const UpcomingSessionCard = ({ session }: { session: any }) => (
  <div className="flex items-start p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="min-w-12 w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mr-4">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>
    <div>
      <h3 className="font-semibold text-gray-800">{session.title}</h3>
      <p className="text-sm text-gray-600">{session.date}</p>
      <div className="mt-1 flex items-center text-xs text-gray-500">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        {session.location}
      </div>
      <div className="mt-1 flex items-center text-xs text-gray-500">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        {session.trainer}
      </div>
    </div>
  </div>
);

const calculateProgress = (tasks: any[]) => {
  if (!tasks || tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.stage_id[0] === 4).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

const TrainingPlanCard = ({ plan }: { plan: any }) => {
  const tasks = plan.tasks ?? [];
  const progress = calculateProgress(tasks);

  // Helper to check for valid date value
  const getValidDate = (value: any) => {
    if (!value || value === false || value === null || value === undefined || value === '') return null;
    const d = new Date(value);
    return isValid(d) ? d : null;
  };

  const dateStartRaw = plan.create_date;
  const dateEndRaw = plan.date_end;
  const dateStart = getValidDate(dateStartRaw);
  const dateEnd = getValidDate(dateEndRaw);

  // Log the raw values and parsed dates for debugging
  if (!dateStart || !dateEnd) {
    // Only log if one is invalid
    console.log('[TrainingPlanCard] Raw create_date:', dateStartRaw, 'Parsed:', dateStart);
    console.log('[TrainingPlanCard] Raw date_end:', dateEndRaw, 'Parsed:', dateEnd);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{plan.name}</h3>
          <p className="text-sm text-gray-600">
            {dateStart ? format(dateStart, 'MMM d, yyyy') : 'N/A'} -{' '}
            {dateEnd ? format(dateEnd, 'MMM d, yyyy') : 'N/A'}
          </p>
        </div>
        <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs">
          {tasks.length} tasks
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Overall Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-sky-600 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4">
        <Link 
          href="/client-area/dashboard/training"
          className="text-sky-600 hover:text-sky-800 text-sm font-medium"
        >
          View Full Plan →
        </Link>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [userName, setUserName] = useState("Guest");
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);  
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get services from the ServiceFactory
  const odooClientService = ServiceFactory.getInstance().getOdooClientService();

  useEffect(() => {
    // Check for odoo_session in localStorage
    const sessionRaw = localStorage.getItem('odoo_session');
    if (!sessionRaw) {
      window.location.href = '/client-area';
      return;
    }
    try {
      const session = JSON.parse(sessionRaw);
      const isAuthenticated = session.isAuthenticated;
      const expires = session.sessionInfo?.expires || session.currentUser?.expires_at;
      if (!isAuthenticated || !expires || Date.now() > expires) {
        localStorage.removeItem('odoo_session');
        window.location.href = '/client-area';
        return;
      }
      // Set user name from session
      const currentUser = session.currentUser;
      const displayName =
        currentUser.displayName ||
        currentUser.name ||
        currentUser.username ||
        (currentUser.email ? currentUser.email.split('@')[0] : null) ||
        'User';
      setUserName(displayName);
      setIsAuthenticated(true);

      // Now load user-specific data
      const loadUserData = async () => {
        try {
          console.log("🔍 Loading user-specific data...");
          // Load dogs
          try {
            const fetchedDogs = await odooClientService.getDogs();
            console.log(`🐕 Loaded ${fetchedDogs.length} dogs for user`);
            setDogs(fetchedDogs);
          } catch (dogError) {
            console.error("❌ Error fetching dogs:", dogError);
          }
          // Load training plans
          try {
            const fetchedPlans = await odooClientService.getTrainingPlans();
            console.log(`📋 Loaded ${fetchedPlans.length} training plans for user`);
            setTrainingPlans(fetchedPlans);
          } catch (planError) {
            console.error("❌ Error fetching training plans:", planError);
          }
          // Load upcoming calendar sessions
          try {
            const odooCalendarService = new OdooCalendarService(odooClientService);
            const calendarEvents = await odooCalendarService.getUpcomingAppointments();
            let filteredEvents = calendarEvents;
            // Only filter for non-admin users
            if (currentUser && !currentUser.isAdmin && currentUser.partnerId) {
              filteredEvents = (calendarEvents as import('@/services/OdooCalendarService').CalendarEvent[]).filter(event => {
                // @ts-expect-error partner_ids may exist on backend event object for filtering
                if (!event.partner_ids) return true;
                // @ts-expect-error partner_ids may exist on backend event object for filtering
                return Array.isArray(event.partner_ids) && event.partner_ids.includes(currentUser.partnerId);
              });
            }
            // Convert calendar events to session format - keep all for count, but limit display to 3
            const allSessions = filteredEvents.map(event => ({
              id: event.id,
              title: event.name,
              date: new Date(event.start).toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              location: event.location,
              trainer: event.trainer_name,
              start: event.start
            }));
            setUpcomingSessions(allSessions);
          } catch (sessionError) {
            console.error("❌ Error fetching upcoming sessions:", sessionError);
            setUpcomingSessions([]);
          }
        } catch (error) {
          console.error("❌ Error in loadUserData:", error);
          throw error;
        }
      };
      loadUserData();
    } catch {
      localStorage.removeItem('odoo_session');
      window.location.href = '/client-area';
      return;
    }
    setIsLoading(false);
  }, [odooClientService]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <WelcomeSection name={userName} />
      
      {/* Notification for Client Intake Form - only show if no dogs */}
      {!isLoading && dogs.length === 0 && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-sky-800">Complete Your Client Intake Form</h3>
              <div className="mt-2 text-sky-700">
                <p>Please fill out our client intake form to help us understand your dog&apos;s needs better.</p>
              </div>
              <div className="mt-4">
                <Link
                  href="/client-area/dashboard/intake"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  Start Intake Form
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}        {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Dogs Card */}
        <Link href="/client-area/dashboard/dogs" className="bg-white rounded-xl border border-gray-100 shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <span className="text-3xl font-bold text-gray-700">{dogs.length}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Your Dogs</h3>
          <p className="text-gray-600">Active training companions</p>
        </Link>

        {/* Training Plans Card */}
        <Link href="/client-area/dashboard/training" className="bg-white rounded-xl border border-gray-100 shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
            </div>
            <span className="text-3xl font-bold text-gray-700">{trainingPlans.length}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Training Plans</h3>
          <p className="text-gray-600">Active training programs</p>
        </Link>

        {/* Appointments Card */}
        <Link href="/client-area/dashboard/calendar" className="bg-white rounded-xl border border-gray-100 shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <span className="text-3xl font-bold text-gray-700">{upcomingSessions.length}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Appointments</h3>
          <p className="text-gray-600">Upcoming training sessions</p>
        </Link>
      </div>
      
      {/* Two Column Layout for Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dog Profiles Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-sky-800">Your Dogs</h2>
              <Link 
                href="/client-area/dashboard/dogs" 
                className="text-sky-600 hover:text-sky-800 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sky-600 border-r-transparent"></div>
                <p className="mt-2 text-gray-600">Loading your dogs...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : dogs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No dogs registered yet. Please complete the intake form to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dogs.map((dog: Dog) => (
                  <DogProfileCard key={dog.id} dog={dog} />
                ))}
              </div>
            )}
          </div>
          
          {/* Training Plans Section - Always visible */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-sky-800">Training Plans</h2>
              <Link 
                href="/client-area/dashboard/training" 
                className="text-sky-600 hover:text-sky-800 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainingPlans.length > 0 ? (
                trainingPlans.map((plan: TrainingPlan) => (
                  <TrainingPlanCard key={plan.id} plan={plan} />
                ))
              ) : (
                <div className="col-span-2 text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No training plans available.</p>
                  <Link 
                    href="/client-area/dashboard/training/new"
                    className="text-sky-600 hover:text-sky-800 text-sm font-medium mt-2 inline-block"
                  >
                    Request a Training Plan →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column (1/3 width on large screens) */}
        <div className="space-y-6">
          {/* Upcoming Sessions Section - Always visible */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-sky-800">Upcoming Sessions</h2>
              <Link 
                href="/client-area/dashboard/calendar" 
                className="text-sky-600 hover:text-sky-800 text-sm font-medium"
              >
                View Calendar →
              </Link>
            </div>            <div className="space-y-3">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.slice(0, 3).map((session: { id: number; title: string; date: string; location: string; trainer: string; start: string }) => (
                  <UpcomingSessionCard key={session.id} session={session} />
                ))
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">No upcoming sessions.</p>
                  <Link 
                    href="/client-area/dashboard/calendar"
                    className="text-sky-600 hover:text-sky-800 text-sm font-medium mt-2 inline-block"
                  >
                    Book a Session →
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Actions - Always visible */}
          <div>
            <h2 className="text-xl font-semibold text-sky-800 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link 
                href="/client-area/dashboard/calendar?new=true" 
                className="flex items-center p-3 bg-sky-50 rounded-lg text-sky-700 hover:bg-sky-100 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Book New Training Session
              </Link>
              <Link 
                href="/client-area/dashboard/dogs/add" 
                className="flex items-center p-3 bg-sky-50 rounded-lg text-sky-700 hover:bg-sky-100 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"></path>
                </svg>
                Register New Dog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}