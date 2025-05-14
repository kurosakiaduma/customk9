"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// Demo data for the dashboard
const dummyUserData = {
  name: "John",
  dogs: [
    {
      id: 1,
      name: "Max",
      breed: "German Shepherd",
      age: "2 years",
      image: "/images/dog-01.jpg",
      level: "Intermediate",
      progress: 65,
      // Additional details from intake form
      intakeDetails: {
        dogSource: "Rescue Shelter",
        timeWithDog: "1 year 5 months",
        medicalIssues: "None",
        vetClinic: "Central Vet Hospital",
        vetName: "Dr. Amanda Williams",
        vetPhone: "+254 712 345 678",
        previousTraining: "Basic obedience class at local pet store",
        behaviorNotes: "Some reactivity to loud noises, good with other dogs",
        sleepLocation: "Dog bed in bedroom",
        feedingSchedule: "Twice daily - morning and evening",
        walkFrequency: "Twice daily - 30 minutes each",
        walkEquipment: ["harness", "flat-collar"],
      }
    },
    {
      id: 2,
      name: "Bella",
      breed: "Labrador Retriever",
      age: "1 year",
      image: "/images/dog-02.jpg",
      level: "Beginner",
      progress: 30,
      // Additional details from intake form
      intakeDetails: {
        dogSource: "Reputable Breeder",
        timeWithDog: "10 months",
        medicalIssues: "Mild hip dysplasia - monitored by vet",
        vetClinic: "PetCare Veterinary Center",
        vetName: "Dr. James Peterson",
        vetPhone: "+254 723 456 789", 
        previousTraining: "Puppy socialization classes",
        behaviorNotes: "Very food motivated, some excitability with guests",
        sleepLocation: "Crate in the living room",
        feedingSchedule: "Three times daily - small portions",
        walkFrequency: "Three times daily - short walks",
        walkEquipment: ["head-halter", "harness"],
      }
    },
  ],
  upcomingSessions: [
    {
      id: 1,
      title: "Group Obedience Training",
      date: "Tomorrow, 10:00 AM",
      location: "Central Park",
      trainer: "Sarah Johnson"
    },
    {
      id: 2,
      title: "Private Behavior Consultation",
      date: "Friday, 2:00 PM",
      location: "Your Home",
      trainer: "Michael Clark"
    }
  ],
  trainingPlans: [
    {
      id: 1,
      title: "Basic Obedience",
      dog: "Max",
      progress: 65,
      nextSession: "Tomorrow",
      milestones: [
        { name: "Sit", completed: true },
        { name: "Stay", completed: true },
        { name: "Come", completed: false },
        { name: "Heel", completed: false },
      ]
    },
    {
      id: 2,
      title: "Puppy Socialization",
      dog: "Bella",
      progress: 30,
      nextSession: "Friday",
      milestones: [
        { name: "Meeting new dogs", completed: true },
        { name: "Handling exercises", completed: false },
        { name: "Environmental exposure", completed: false },
        { name: "Play behavior", completed: false },
      ]
    }
  ]
};

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

const DogProfileCard = ({ dog }: { dog: any }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <div className="relative h-32 w-full">
      <Image
        src={dog.image}
        alt={dog.name}
        fill
        sizes="100%"
        style={{ objectFit: "cover" }}
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

const TrainingPlanCard = ({ plan }: { plan: any }) => {
  // Count completed milestones
  const completedCount = plan.milestones.filter((m: any) => m.completed).length;
  const totalCount = plan.milestones.length;
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{plan.title}</h3>
          <p className="text-sm text-gray-600">
            {plan.dog} • Next session: {plan.nextSession}
          </p>
        </div>
        <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs">
          {completedCount}/{totalCount} complete
        </span>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Overall Progress</span>
          <span className="font-medium">{plan.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-sky-600 h-2 rounded-full" 
            style={{ width: `${plan.progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-2 mt-4">
        <h4 className="text-sm font-medium text-gray-700">Current Milestones:</h4>
        {plan.milestones.map((milestone: any, index: number) => (
          <div key={index} className="flex items-center">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
              milestone.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
            }`}>
              {milestone.completed ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
            </div>
            <span className={`text-sm ${milestone.completed ? 'text-gray-700' : 'text-gray-500'}`}>
              {milestone.name}
            </span>
          </div>
        ))}
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
  const { name, dogs, upcomingSessions, trainingPlans } = dummyUserData;
  const [hasFilledIntakeForm, setHasFilledIntakeForm] = useState<boolean>(false);
  
  // Check if the user has filled the intake form
  useEffect(() => {
    // In a real app, this would check if the user has submitted an intake form
    const intakeFormCompleted = localStorage.getItem("customk9_intake_completed");
    if (intakeFormCompleted) {
      setHasFilledIntakeForm(true);
    }
  }, []);
  
  return (
    <div className="space-y-8">
      <WelcomeSection name={name} />
      
      {/* Intake Form Alert - always show but with different message depending on completed status */}
      <div className={`bg-${hasFilledIntakeForm ? 'sky' : 'amber'}-50 border-2 border-${hasFilledIntakeForm ? 'sky' : 'amber'}-300 rounded-lg p-6 mb-8`}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 w-12 h-12 bg-${hasFilledIntakeForm ? 'sky' : 'amber'}-100 rounded-full flex items-center justify-center mr-5`}>
            <svg className={`w-7 h-7 text-${hasFilledIntakeForm ? 'sky' : 'amber'}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {hasFilledIntakeForm ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              )}
            </svg>
          </div>
          <div>
            <h3 className={`text-${hasFilledIntakeForm ? 'sky' : 'amber'}-800 text-xl font-bold mb-2`}>
              {hasFilledIntakeForm ? "Client Intake Form" : "Complete Your Client Intake Form"}
            </h3>
            <p className={`text-${hasFilledIntakeForm ? 'sky' : 'amber'}-700 mb-4`}>
              {hasFilledIntakeForm 
                ? "Thank you for completing your intake form. You can review or update your information at any time to ensure we have the most current details about your dog."
                : "Your training experience with CustomK9 starts with our comprehensive intake form. This is a required first step that helps us understand your dog's specific needs, behavior patterns, and your training goals. Without this information, we cannot create an effective training plan."
              }
            </p>
            <Link 
              href="/client-area/dashboard/intake" 
              className={`inline-block px-6 py-3 bg-${hasFilledIntakeForm ? 'sky' : 'amber'}-600 hover:bg-${hasFilledIntakeForm ? 'sky' : 'amber'}-700 text-white rounded-md font-medium text-base transition-colors shadow-md`}
            >
              {hasFilledIntakeForm ? "Review or Update Intake Form" : "Start Intake Process Now"}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard 
          title="Upcoming Sessions" 
          value={upcomingSessions.length}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          }
          link="/client-area/dashboard/calendar"
        />
        <SummaryCard 
          title="Active Dogs" 
          value={dogs.length}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z"></path>
            </svg>
          }
          color="purple"
          link="/client-area/dashboard/dogs"
        />
        <SummaryCard 
          title="Training Plans" 
          value={trainingPlans.length}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          }
          color="green"
          link="/client-area/dashboard/training"
        />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dogs.map((dog: any) => (
                <DogProfileCard key={dog.id} dog={dog} />
              ))}
            </div>
          </div>
          
          {/* Training Plans Section */}
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
              {trainingPlans.map((plan: any) => (
                <TrainingPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column (1/3 width on large screens) */}
        <div className="space-y-6">
          {/* Upcoming Sessions Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-sky-800">Upcoming Sessions</h2>
              <Link 
                href="/client-area/dashboard/calendar" 
                className="text-sky-600 hover:text-sky-800 text-sm font-medium"
              >
                View Calendar →
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingSessions.map((session: any) => (
                <UpcomingSessionCard key={session.id} session={session} />
              ))}
              
              {upcomingSessions.length === 0 && (
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
          
          {/* Quick Actions */}
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