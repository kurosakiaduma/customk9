"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Demo data for dogs
const dogData = [
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
    behaviorNotes: "Max is showing great progress with recall training, but still has some reactivity to other male dogs. Working on controlled exposure and positive reinforcement."
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
    behaviorNotes: "Bella is very friendly and sociable with both humans and other dogs. Training focus is on basic commands and leash manners. Excels at food motivation but can be easily distracted in new environments."
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
const DogDetailCard = ({ dog }: { dog: any }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'training'>('overview');
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
      {/* Header with image and basic info */}
      <div className="relative">
        <div className="h-48 w-full relative">
          <Image
            src={dog.image}
            alt={dog.name}
            fill
            sizes="100%"
            style={{ objectFit: "cover" }}
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
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'overview'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`py-4 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'health'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Health Records
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`py-4 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'training'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Training
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
      </div>
    </div>
  );
};

export default function DogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter dogs based on search term
  const filteredDogs = dogData.filter((dog) => 
    dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-800">My Dogs</h1>
        <Link 
          href="/client-area/dashboard/dogs/add" 
          className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"></path>
          </svg>
          Register New Dog
        </Link>
      </div>
      
      {/* Search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="search"
          className="block w-full p-3 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-sky-500 focus:border-sky-500"
          placeholder="Search by dog name or breed..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Dogs List */}
      <div className="space-y-6">
        {filteredDogs.length > 0 ? (
          filteredDogs.map((dog) => (
            <DogDetailCard key={dog.id} dog={dog} />
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No dogs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try a different search term or clear the search.' : 'You haven\'t registered any dogs yet.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Link 
                  href="/client-area/dashboard/dogs/add" 
                  className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700 transition-colors inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"></path>
                  </svg>
                  Register Your First Dog
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 