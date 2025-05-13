"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Tab } from "@headlessui/react";
import { format } from "date-fns";

// Demo data for dogs - now as a constant to use as fallback
const defaultDogData = [
  {
    id: 1,
    name: "Max",
    breed: "German Shepherd",
    age: "2 years",
    birthday: "June 15, 2022",
    gender: "Male",
    weight: "32 kg",
    microchip: "985121054367289",
    image: "/images/dog-01.jpg",
    level: "Intermediate",
    progress: 65,
    lastCheckup: "March 10, 2024",
    vaccinations: [
      { name: "Rabies", date: "January 15, 2024", nextDue: "January 15, 2025" },
      { name: "DHPP", date: "February 2, 2024", nextDue: "February 2, 2025" },
      { name: "Bordetella", date: "November 5, 2023", nextDue: "May 5, 2024" },
    ],
    behaviorNotes: "Max is showing great progress with recall training, but still has some reactivity to other male dogs. Working on controlled exposure and positive reinforcement.",
    // Intake form information
    intakeDetails: {
      dogSource: "Rescue Shelter",
      timeWithDog: "1 year 5 months",
      medicalIssues: "None",
      vetClinic: "Central Vet Hospital",
      vetName: "Dr. Amanda Williams",
      vetPhone: "+254 712 345 678",
      previousTraining: "Basic obedience class at local pet store",
      behaviorConcerns: "Some reactivity to loud noises, good with other dogs",
      sleepLocation: "Dog bed in bedroom",
      feedingSchedule: "Twice daily - morning and evening",
      walkFrequency: "Twice daily - 30 minutes each",
      walkEquipment: ["harness", "flat-collar"],
      trainingGoals: "Improve recall reliability, reduce reactivity to other dogs",
      fearfulSituations: "Thunderstorms and fireworks",
      responseToNewPeople: "Initially cautious but warms up quickly",
    }
  },
  {
    id: 2,
    name: "Bella",
    breed: "Labrador Retriever",
    age: "1 year",
    birthday: "April 3, 2023",
    gender: "Female",
    weight: "24 kg",
    microchip: "985121054389012",
    image: "/images/dog-02.jpg",
    level: "Beginner",
    progress: 30,
    lastCheckup: "February 20, 2024",
    vaccinations: [
      { name: "Rabies", date: "December 5, 2023", nextDue: "December 5, 2024" },
      { name: "DHPP", date: "January 10, 2024", nextDue: "January 10, 2025" },
      { name: "Leptospirosis", date: "January 10, 2024", nextDue: "July 10, 2024" },
    ],
    behaviorNotes: "Bella is very friendly and sociable with both humans and other dogs. Training focus is on basic commands and leash manners. Excels at food motivation but can be easily distracted in new environments.",
    // Intake form information
    intakeDetails: {
      dogSource: "Reputable Breeder",
      timeWithDog: "10 months",
      medicalIssues: "Mild hip dysplasia - monitored by vet",
      vetClinic: "PetCare Veterinary Center",
      vetName: "Dr. James Peterson",
      vetPhone: "+254 723 456 789", 
      previousTraining: "Puppy socialization classes",
      behaviorConcerns: "Very food motivated, some excitability with guests",
      sleepLocation: "Crate in the living room",
      feedingSchedule: "Three times daily - small portions",
      walkFrequency: "Three times daily - short walks",
      walkEquipment: ["head-halter", "harness"],
      trainingGoals: "Basic obedience commands, leash manner improvement",
      fearfulSituations: "None observed",
      responseToNewPeople: "Very friendly and sometimes jumps up",
    }
  },
];

// Function to format dates nicely
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Check if a vaccination is due soon (within 30 days)
const isDueSoon = (dueDateString: string) => {
  const dueDate = new Date(dueDateString);
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  return dueDate > today && dueDate <= thirtyDaysFromNow;
};

// Check if a vaccination is overdue
const isOverdue = (dueDateString: string) => {
  const dueDate = new Date(dueDateString);
  const today = new Date();
  
  return dueDate < today;
};

// Dog profile detail component
const DogProfileCard = ({ dog }: { dog: any }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'training' | 'intake'>('overview');
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
      {/* Header with image and basic info */}
      <div className="relative">
        <div className="h-48 w-full relative">
          <Image
            src={dog.image || "/images/dog-placeholder.jpg"}
            alt={dog.name}
            fill
            sizes="100%"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const imgElement = e.target as HTMLImageElement;
              imgElement.src = "/images/dog-placeholder.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 p-5 text-white">
          <h2 className="text-2xl font-bold">{dog.name}</h2>
          <p className="text-white/80">{dog.breed}, {dog.age}</p>
        </div>
        
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white text-sky-700 rounded-full text-sm font-medium shadow-sm">
            {dog.level}
          </span>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="px-4 border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'health'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Health Records
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'training'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Training
          </button>
          <button
            onClick={() => setActiveTab('intake')}
            className={`py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'intake'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Intake Form
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-5">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Age</p>
                <p className="font-medium">{dog.age}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Birthday</p>
                <p className="font-medium">{dog.birthday}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Gender</p>
                <p className="font-medium">{dog.gender}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Weight</p>
                <p className="font-medium">{dog.weight}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Microchip</p>
                <p className="font-medium">{dog.microchip}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Last Checkup</p>
                <p className="font-medium">{dog.lastCheckup}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Behavior Notes</h3>
              <p className="text-gray-700">{dog.behaviorNotes}</p>
            </div>
            
            <div className="flex space-x-3">
              <Link 
                href={`/client-area/dashboard/dogs/${dog.id}/edit`}
                className="px-4 py-2 bg-sky-100 text-sky-700 rounded-md text-sm font-medium hover:bg-sky-200 transition-colors"
              >
                Edit Profile
              </Link>
              <Link 
                href={`/client-area/dashboard/training?dog=${dog.id}`}
                className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700 transition-colors"
              >
                View Training Plan
              </Link>
            </div>
          </div>
        )}
        
        {/* Health Records Tab */}
        {activeTab === 'health' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold mb-3">Vaccination Records</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vaccine
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Date
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Next Due
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dog.vaccinations.map((vaccination: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vaccination.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {vaccination.date}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {vaccination.nextDue}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {isOverdue(vaccination.nextDue) ? (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                              Overdue
                            </span>
                          ) : isDueSoon(vaccination.nextDue) ? (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                              Due Soon
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              Up to Date
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Link 
                href={`/client-area/dashboard/dogs/${dog.id}/medical-records`}
                className="px-4 py-2 bg-sky-100 text-sky-700 rounded-md text-sm font-medium hover:bg-sky-200 transition-colors"
              >
                Full Medical History
              </Link>
              <Link 
                href={`/client-area/dashboard/dogs/${dog.id}/add-vaccination`}
                className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700 transition-colors"
              >
                Add Vaccination
              </Link>
            </div>
          </div>
        )}
        
        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Training Progress</h3>
                <span className="text-sm font-medium">{dog.progress}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-sky-600 h-2.5 rounded-full" 
                  style={{ width: `${dog.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Training Sessions</h3>
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Basic Obedience - Session 3</h4>
                      <p className="text-sm text-gray-600">March 15, 2024</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      Completed
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    Focus on sit-stay duration (up to 30 seconds) and introduction to heel command. Max is showing great progress with staying in place, but needs more work with heeling. Homework: Practice 5-minute sessions twice daily.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Basic Obedience - Session 2</h4>
                      <p className="text-sm text-gray-600">March 8, 2024</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      Completed
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    Worked on recall command from increasing distances. Max responds well but can be distracted. Introduced 'stay' command with moderate success. Homework: Practice recalls in garden with minimal distractions.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Link 
                href={`/client-area/dashboard/calendar?dog=${dog.id}`}
                className="px-4 py-2 bg-sky-100 text-sky-700 rounded-md text-sm font-medium hover:bg-sky-200 transition-colors"
              >
                Schedule Training
              </Link>
              <Link 
                href={`/client-area/dashboard/training?dog=${dog.id}`}
                className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700 transition-colors"
              >
                View Full Training Plan
              </Link>
            </div>
          </div>
        )}

        {/* Intake Form Tab */}
        {activeTab === 'intake' && dog.intakeDetails && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold mb-3">Client Intake Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <h4 className="text-base font-medium text-sky-700 mb-3">Dog Background</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Where did you get your dog?</p>
                    <p className="font-medium">{dog.intakeDetails.dogSource}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">How long have you had your dog?</p>
                    <p className="font-medium">{dog.intakeDetails.timeWithDog}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Previous Training</p>
                    <p className="font-medium">{dog.intakeDetails.previousTraining}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-sky-700 mb-3">Health Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Medical Issues</p>
                    <p className="font-medium">{dog.intakeDetails.medicalIssues}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Veterinarian</p>
                    <p className="font-medium">{dog.intakeDetails.vetName}</p>
                    <p className="text-sm">{dog.intakeDetails.vetClinic}</p>
                    <p className="text-sm">{dog.intakeDetails.vetPhone}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-sky-700 mb-3">Daily Routine</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Sleep Location</p>
                    <p className="font-medium">{dog.intakeDetails.sleepLocation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Feeding Schedule</p>
                    <p className="font-medium">{dog.intakeDetails.feedingSchedule}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Walking Routine</p>
                    <p className="font-medium">{dog.intakeDetails.walkFrequency}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dog.intakeDetails.walkEquipment.map((item: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-sky-50 text-sky-700 rounded-full text-xs">
                          {item.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-sky-700 mb-3">Behavior & Goals</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Behavior Concerns</p>
                    <p className="font-medium">{dog.intakeDetails.behaviorConcerns}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Response to New People</p>
                    <p className="font-medium">{dog.intakeDetails.responseToNewPeople}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fearful Situations</p>
                    <p className="font-medium">{dog.intakeDetails.fearfulSituations}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Training Goals</p>
                    <p className="font-medium">{dog.intakeDetails.trainingGoals}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-5">
              <Link 
                href="/client-area/registration"
                className="px-4 py-2 bg-sky-100 text-sky-700 rounded-md text-sm font-medium hover:bg-sky-200 transition-colors"
              >
                Update Intake Form
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DogsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hasSubmittedIntakeForm, setHasSubmittedIntakeForm] = useState<boolean>(false);
  const [dogData, setDogData] = useState<any[]>([]);

  useEffect(() => {
    // Check if intake form has been submitted - for conditional UI
    const hasCompletedIntake = localStorage.getItem("intakeFormCompleted") === "true";
    setHasSubmittedIntakeForm(hasCompletedIntake);

    // Load dogs from localStorage
    try {
      const storedDogs = localStorage.getItem("dogs");
      if (storedDogs) {
        const parsedDogs = JSON.parse(storedDogs);
        if (Array.isArray(parsedDogs) && parsedDogs.length > 0) {
          setDogData(parsedDogs);
          return;
        }
      }
      // If no dogs in localStorage or parsing error, use default data
      setDogData(defaultDogData);
    } catch (error) {
      console.error("Error loading dogs from localStorage:", error);
      setDogData(defaultDogData);
    }
  }, []);

  // Filter dogs based on search term
  const filteredDogs = dogData.filter(dog =>
    dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Dogs</h1>
          <p className="text-gray-600">Manage your dog profiles and training information</p>
        </div>
        <Link 
          href="/client-area/dashboard/dogs/add" 
          className="mt-4 md:mt-0 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Dog
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="search"
          placeholder="Search dogs by name or breed..."
          className="w-full max-w-md p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Display message if no dogs */}
      {filteredDogs.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No Dogs Found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? `No dogs match your search "${searchTerm}".` : "You haven't added any dogs to your profile yet."}
          </p>
          {!searchTerm && (
            <Link 
              href="/client-area/dashboard/dogs/add"
              className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Register Your First Dog
            </Link>
          )}
        </div>
      )}

      {/* Display dog grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDogs.map((dog) => (
          <DogProfileCard key={dog.id} dog={dog} />
        ))}
      </div>

      {/* Dog detail section (shown when a dog is selected) */}
      {/* ... rest of the component ... */}
    </div>
  );
};

export default DogsPage; 