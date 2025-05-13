"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// Demo data for training plans
const trainingPlansData = [
  {
    id: 1,
    title: "Basic Obedience",
    dogId: 1,
    dogName: "Max",
    dogImage: "/images/dog-01.jpg",
    progress: 65,
    startDate: "February 15, 2024",
    endDate: "May 15, 2024",
    trainerId: 1,
    trainerName: "Sarah Johnson",
    nextSession: "Tomorrow, 10:00 AM",
    description: "A comprehensive program focused on basic commands and behaviors that every well-mannered dog should know.",
    skills: [
      { id: 1, name: "Sit", status: "completed", completedDate: "February 20, 2024" },
      { id: 2, name: "Stay", status: "completed", completedDate: "March 5, 2024" },
      { id: 3, name: "Come", status: "in-progress", completedDate: null },
      { id: 4, name: "Heel", status: "not-started", completedDate: null },
      { id: 5, name: "Down", status: "in-progress", completedDate: null },
      { id: 6, name: "Leave it", status: "not-started", completedDate: null },
    ],
    sessions: [
      { 
        id: 1, 
        date: "February 15, 2024", 
        title: "Introduction to Basic Commands",
        status: "completed",
        notes: "Max showed great enthusiasm and focus. Introduced 'sit' command with excellent response. Homework: Practice 'sit' 10 times per day in different locations."
      },
      { 
        id: 2, 
        date: "February 22, 2024", 
        title: "Stay Command and Reinforcing Sit", 
        status: "completed",
        notes: "Reinforced sit command and began work on 'stay'. Max tends to break the stay after about 10 seconds. Homework: Practice stay, gradually increasing duration."
      },
      { 
        id: 3, 
        date: "March 1, 2024", 
        title: "Introduction to Come Command", 
        status: "completed",
        notes: "Max is now holding a stay for 20 seconds reliably. Introduced 'come' command with a long lead. Responds well in low-distraction environments."
      },
      { 
        id: 4, 
        date: "March 8, 2024", 
        title: "Introduction to Down Command", 
        status: "completed",
        notes: "Max is making good progress with 'come' command. Started work on 'down' command, which he finds more challenging. Homework: Practice down command with lure 5 times per day."
      },
      { 
        id: 5, 
        date: "March 15, 2024", 
        title: "Reinforcing Down and Come Commands", 
        status: "completed",
        notes: "Max is improving with 'down' command but still needs work. Come command is solid in moderate distraction environments. Introduced 'leave it' concept."
      },
      { 
        id: 6, 
        date: "March 22, 2024", 
        title: "Introduction to Heel", 
        status: "upcoming",
        notes: ""
      },
    ]
  },
  {
    id: 2,
    title: "Puppy Socialization",
    dogId: 2,
    dogName: "Bella",
    dogImage: "/images/dog-02.jpg",
    progress: 30,
    startDate: "March 1, 2024",
    endDate: "May 30, 2024",
    trainerId: 2,
    trainerName: "Michael Clark",
    nextSession: "Friday, 2:00 PM",
    description: "A specialized program designed for puppies to develop proper social skills with other dogs and people.",
    skills: [
      { id: 1, name: "Meeting new dogs", status: "completed", completedDate: "March 10, 2024" },
      { id: 2, name: "Handling exercises", status: "in-progress", completedDate: null },
      { id: 3, name: "Environmental exposure", status: "in-progress", completedDate: null },
      { id: 4, name: "Play behavior", status: "not-started", completedDate: null },
      { id: 5, name: "Focus around distractions", status: "not-started", completedDate: null },
    ],
    sessions: [
      { 
        id: 1, 
        date: "March 1, 2024", 
        title: "Introduction to Socialization", 
        status: "completed",
        notes: "Bella showed excellent social temperament with both people and dogs. Very curious and outgoing. Introduced gentle handling exercises."
      },
      { 
        id: 2, 
        date: "March 8, 2024", 
        title: "Structured Dog Interactions", 
        status: "completed",
        notes: "Bella did well with controlled interactions with calm adult dogs. Started work on appropriate play behavior. Homework: Practice handling exercises daily."
      },
      { 
        id: 3, 
        date: "March 15, 2024", 
        title: "Environmental Enrichment", 
        status: "completed",
        notes: "Introduced Bella to various surfaces, sounds, and novel objects. She was initially startled by loud noises but recovered quickly. Homework: Exposure to one new environment this week."
      },
      { 
        id: 4, 
        date: "March 22, 2024", 
        title: "Focus Work and Handling", 
        status: "upcoming",
        notes: ""
      },
    ]
  },
];

// Components
const TrainingPlanCard = ({ plan, isActive = false }: { plan: any, isActive?: boolean }) => (
  <Link 
    href={`/client-area/dashboard/training?plan=${plan.id}`}
    className={`block p-4 rounded-xl border transition-all ${
      isActive 
        ? "border-sky-600 bg-sky-50 shadow-md" 
        : "border-gray-200 bg-white hover:border-sky-300 hover:shadow-sm"
    }`}
  >
    <div className="flex items-center space-x-4">
      <div className="relative h-14 w-14 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={plan.dogImage}
          alt={plan.dogName}
          fill
          sizes="56px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-800">{plan.title}</h3>
        <p className="text-sm text-gray-600">{plan.dogName}</p>
        <div className="flex justify-between items-center mt-2">
          <div>
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Next: {plan.nextSession}
            </div>
          </div>
          <span className="text-xs font-medium">{plan.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
          <div 
            className="bg-sky-600 h-1.5 rounded-full" 
            style={{ width: `${plan.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  </Link>
);

// Component for displaying the skill status
const SkillStatus = ({ status }: { status: string }) => {
  switch (status) {
    case "completed":
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
          Completed
        </span>
      );
    case "in-progress":
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
          In Progress
        </span>
      );
    case "not-started":
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
          Not Started
        </span>
      );
    default:
      return null;
  }
};

// Component for the session card
const SessionCard = ({ session }: { session: any }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 className="font-medium">{session.title}</h4>
        <p className="text-sm text-gray-600">{session.date}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${
        session.status === "completed" 
          ? "bg-green-100 text-green-700" 
          : session.status === "upcoming" 
            ? "bg-blue-100 text-blue-700" 
            : "bg-gray-100 text-gray-700"
      }`}>
        {session.status === "completed" ? "Completed" : session.status === "upcoming" ? "Upcoming" : "Scheduled"}
      </span>
    </div>
    {session.notes && (
      <p className="text-sm text-gray-700 mt-2">{session.notes}</p>
    )}
  </div>
);

// Component for the detailed view of a training plan
const TrainingPlanDetail = ({ plan }: { plan: any }) => {
  const completedSkills = plan.skills.filter((s: any) => s.status === "completed").length;
  const totalSkills = plan.skills.length;
  
  const upcomingSessions = plan.sessions.filter((s: any) => s.status === "upcoming");
  const completedSessions = plan.sessions.filter((s: any) => s.status === "completed");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <div className="relative h-14 w-14 rounded-full overflow-hidden mr-4">
              <Image
                src={plan.dogImage}
                alt={plan.dogName}
                fill
                sizes="56px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-sky-800">{plan.title}</h2>
              <p className="text-gray-600">for {plan.dogName}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{plan.startDate} - {plan.endDate}</p>
          <p className="text-sm text-gray-600">Trainer: {plan.trainerName}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Overall Progress</h3>
          <div className="text-right">
            <p className="text-sm font-medium">{plan.progress}% Complete</p>
            <p className="text-xs text-gray-600">{completedSkills} of {totalSkills} skills mastered</p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className="bg-sky-600 h-2.5 rounded-full" 
            style={{ width: `${plan.progress}%` }}
          ></div>
        </div>
        
        <p className="text-gray-700 mb-4">{plan.description}</p>
        
        <div className="mt-4">
          <h4 className="font-medium text-gray-800 mb-2">Skills & Behaviors</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {plan.skills.map((skill: any) => (
              <div key={skill.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{skill.name}</span>
                <SkillStatus status={skill.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-lg font-semibold mb-4">Training Sessions</h3>
        
        {upcomingSessions.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Upcoming Sessions</h4>
            <div className="space-y-3">
              {upcomingSessions.map((session: any) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </div>
        )}
        
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Completed Sessions</h4>
          <div className="space-y-3">
            {completedSessions.length > 0 ? (
              completedSessions.map((session: any) => (
                <SessionCard key={session.id} session={session} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No completed sessions yet.</p>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex space-x-3">
          <Link 
            href={`/client-area/dashboard/calendar?dog=${plan.dogId}`}
            className="px-4 py-2 bg-sky-100 text-sky-700 rounded-md text-sm font-medium hover:bg-sky-200 transition-colors"
          >
            Book Next Session
          </Link>
          <Link 
            href={`/client-area/dashboard/training/progress-log?plan=${plan.id}`}
            className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700 transition-colors"
          >
            Update Progress Log
          </Link>
        </div>
      </div>
    </div>
  );
};

// TrainingContent is a client component that uses useSearchParams
const TrainingContent = () => {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  const dogId = searchParams.get('dog');
  
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  
  // Set the selected plan based on the URL parameters
  useEffect(() => {
    if (planId) {
      const plan = trainingPlansData.find(p => p.id.toString() === planId);
      if (plan) {
        setSelectedPlan(plan);
      }
    } else if (dogId) {
      const plan = trainingPlansData.find(p => p.dogId.toString() === dogId);
      if (plan) {
        setSelectedPlan(plan);
      }
    } else if (trainingPlansData.length > 0) {
      setSelectedPlan(trainingPlansData[0]);
    }
  }, [planId, dogId]);
  
  return (
    <div className="space-y-8">
      {!selectedPlan && (
        <h1 className="text-2xl md:text-3xl font-bold text-sky-800">Training Plans</h1>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar with plan list */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Your Plans</h2>
            <Link 
              href="/client-area/dashboard/training/new"
              className="text-sky-600 hover:text-sky-800 text-sm font-medium"
            >
              Request New Plan
            </Link>
          </div>
          
          <div className="space-y-3">
            {trainingPlansData.map((plan) => (
              <TrainingPlanCard 
                key={plan.id} 
                plan={plan} 
                isActive={selectedPlan && selectedPlan.id === plan.id}
              />
            ))}
            
            {trainingPlansData.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No training plans available.</p>
                <Link 
                  href="/client-area/dashboard/training/new"
                  className="text-sky-600 hover:text-sky-800 text-sm font-medium mt-2 inline-block"
                >
                  Request a Training Plan
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Right side with plan details */}
        <div className="lg:col-span-2">
          {selectedPlan ? (
            <TrainingPlanDetail plan={selectedPlan} />
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No plan selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a training plan from the list or create a new one.
              </p>
              <div className="mt-6">
                <Link 
                  href="/client-area/dashboard/training/new"
                  className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700 transition-colors inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"></path>
                  </svg>
                  Request New Training Plan
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main page component that wraps the client component in a Suspense boundary
export default function TrainingPage() {
  return (
    <Suspense fallback={
      <div className="space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-800">Training Plans</h1>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-600"></div>
        </div>
      </div>
    }>
      <TrainingContent />
    </Suspense>
  );
} 