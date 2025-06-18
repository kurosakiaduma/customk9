"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ServiceFactory from "@/services/ServiceFactory";

// Dog profile detail component
const DogDetailCard = ({ dog }: { dog: any }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'training' | 'intake'>('overview');
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
      {/* Header with image and basic info */}
      <div className="relative">
        <div className="h-48 w-full relative">
          <Image
            src={imageError ? "/images/dog-placeholder.jpg" : dog.image}
            alt={dog.name}
            fill
            sizes="100%"
            style={{ objectFit: "cover" }}
            onError={() => setImageError(true)}
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
                <p className="text-gray-500 text-xs">Gender</p>
                <p className="font-medium">{dog.gender}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Training Level</p>
                <p className="font-medium">{dog.level}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Progress</p>
                <p className="font-medium">{dog.progress}%</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Training Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-sky-600 h-2.5 rounded-full" 
                  style={{ width: `${dog.progress}%` }}
                ></div>
              </div>
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

        {/* Intake Form Tab */}
        {activeTab === 'intake' && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-sky-800">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Source</p>
                  <p className="font-medium">{dog.dogInfo?.dogSource || 'Not specified'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Time with Dog</p>
                  <p className="font-medium">{dog.dogInfo?.timeWithDog || 'Not specified'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Sterilized</p>
                  <p className="font-medium">{dog.dogInfo?.sterilized === 'Y' ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-sky-800">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Medications</p>
                  <p className="font-medium">{dog.dogInfo?.medications || 'None'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Current Deworming</p>
                  <p className="font-medium">{dog.dogInfo?.currentDeworming === 'Y' ? 'Yes' : 'No'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Tick/Flea Preventative</p>
                  <p className="font-medium">{dog.dogInfo?.tickFleaPreventative || 'None'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Medical Issues</p>
                  <p className="font-medium">{dog.dogInfo?.medicalIssues || 'None'}</p>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Veterinary Information</h4>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Clinic:</span> {dog.dogInfo?.vetClinic}</p>
                  <p><span className="text-gray-500">Vet:</span> {dog.dogInfo?.vetName}</p>
                  <p><span className="text-gray-500">Phone:</span> {dog.dogInfo?.vetPhone}</p>
                </div>
              </div>
            </div>

            {/* Lifestyle */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-sky-800">Lifestyle</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Home Environment</h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Home Alone Location:</span> {dog.lifestyle?.homeAloneLocation}</p>
                    <p><span className="text-gray-500">Sleep Location:</span> {dog.lifestyle?.sleepLocation}</p>
                    <p><span className="text-gray-500">Hours Alone:</span> {dog.lifestyle?.hoursAlone}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Crate Information</h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Has Crate:</span> {dog.lifestyle?.hasCrate === 'Y' ? 'Yes' : 'No'}</p>
                    <p><span className="text-gray-500">Likes Crate:</span> {dog.lifestyle?.likesCrate === 'Y' ? 'Yes' : 'No'}</p>
                    <p><span className="text-gray-500">Crate Location:</span> {dog.lifestyle?.crateLocation}</p>
                    <p><span className="text-gray-500">Chews Crate:</span> {dog.lifestyle?.chewsCrate === 'Y' ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Feeding</h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Food Brand:</span> {dog.lifestyle?.foodBrand}</p>
                    <p><span className="text-gray-500">Schedule:</span> {dog.lifestyle?.feedingSchedule}</p>
                    <p><span className="text-gray-500">Food Left Out:</span> {dog.lifestyle?.foodLeftOut === 'Y' ? 'Yes' : 'No'}</p>
                    <p><span className="text-gray-500">Allergies:</span> {dog.lifestyle?.allergies}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Exercise & Play</h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Walk Frequency:</span> {dog.lifestyle?.walkFrequency}</p>
                    <p><span className="text-gray-500">Walk Duration:</span> {dog.lifestyle?.walkDuration}</p>
                    <p><span className="text-gray-500">Other Exercise:</span> {dog.lifestyle?.otherExercise}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Training History */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-sky-800">Training History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Previous Training</h4>
                  <p>{dog.history?.previousTraining}</p>
                  <p className="mt-2"><span className="text-gray-500">Tools Used:</span> {dog.history?.toolsUsed}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Behavior History</h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Has Growled:</span> {dog.history?.growled === 'Y' ? 'Yes' : 'No'}</p>
                    <p><span className="text-gray-500">Has Bitten:</span> {dog.history?.bitten === 'Y' ? 'Yes' : 'No'}</p>
                    <p><span className="text-gray-500">Is Fearful:</span> {dog.history?.fearful === 'Y' ? 'Yes' : 'No'}</p>
                    {dog.history?.fearDetails && (
                      <p><span className="text-gray-500">Fear Details:</span> {dog.history.fearDetails}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Training Goals */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-sky-800">Training Goals</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Training Goals</h4>
                    <p>{dog.goals?.trainingGoals}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Ideal Dog Behavior</h4>
                    <p>{dog.goals?.idealDogBehavior}</p>
                  </div>
                  {dog.behaviorChecklist && dog.behaviorChecklist.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Behavior Checklist</h4>
                      <ul className="list-disc list-inside">
                        {dog.behaviorChecklist.map((behavior: string, index: number) => (
                          <li key={index}>{behavior}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function DogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dogs, setDogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const odooService = ServiceFactory.getInstance().getOdooService();
        const fetchedDogs = await odooService.getDogs();
        setDogs(fetchedDogs);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching dogs:', err);
        setError('Failed to load dogs. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchDogs();
  }, []);
  
  // Filter dogs based on search term
  const filteredDogs = dogs.filter((dog) => 
    dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-800">My Dogs</h1>
        <Link 
          href="/client-area/dashboard/intake" 
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
        {isLoading ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : filteredDogs.length > 0 ? (
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
                  href="/client-area/dashboard/intake" 
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