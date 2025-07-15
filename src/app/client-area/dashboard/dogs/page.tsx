"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ServiceFactory from "@/services/ServiceFactory";
import { Dog } from "@/types/dog";

// Dog profile detail component
const DogDetailCard = ({ dog }: { dog: Dog }) => {
  const [imageError, setImageError] = useState(false);

  // Accessing nested properties directly from the structured Dog object
  const dogInfo = dog.dogInfo || {};
  const lifestyle = dog.lifestyle || {};
  const history = dog.history || {};
  const goals = dog.goals || {};
  const behaviorChecklist = dog.behaviorChecklist || [];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={imageError ? "/images/dog-placeholder.jpg" : dog.image}
          alt={dog.name}
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
          onError={() => setImageError(true)}
        />
      </div>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-sky-800">{dog.name}</h2>
          <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
            {dogInfo.level || 'Beginner'}
          </span>
        </div>
        <p className="text-gray-600 text-base mb-4">
          {dog.breed || 'Mixed Breed'}, {dog.age || 'Unknown Age'}, {dog.gender || 'Unknown Gender'}
        </p>

        {/* Overall Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Overall Training Progress</span>
            <span className="font-medium">{dogInfo.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-sky-600 h-2 rounded-full"
              style={{ width: `${dogInfo.progress || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">General Info</h3>
            <div className="space-y-2">
              <p><span className="text-gray-500">Source:</span> {dogInfo.dogSource || 'Not specified'}</p>
              <p><span className="text-gray-500">Time with you:</span> {dogInfo.timeWithDog || 'Not specified'}</p>
              <p><span className="text-gray-500">Sterilized:</span> {dogInfo.sterilized === 'Y' ? 'Yes' : 'No'}</p>
              <p><span className="text-gray-500">Medications:</span> {dogInfo.medications || 'None'}</p>
              <p><span className="text-gray-500">Current Deworming:</span> {dogInfo.currentDeworming || 'Not specified'}</p>
              <p><span className="text-gray-500">Tick/Flea Preventative:</span> {dogInfo.tickFleaPreventative || 'Not specified'}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Veterinary Details</h3>
            <div className="space-y-2">
              <p><span className="text-gray-500">Clinic:</span> {dogInfo.vetClinic || 'Not specified'}</p>
              <p><span className="text-gray-500">Vet Name:</span> {dogInfo.vetName || 'Not specified'}</p>
              <p><span className="text-gray-500">Vet Phone:</span> {dogInfo.vetPhone || 'Not specified'}</p>
              <p><span className="text-gray-500">Medical Issues:</span> {dogInfo.medicalIssues || 'None'}</p>
            </div>
          </div>
        </div>

        {/* Lifestyle Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-sky-800">Lifestyle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Daily Routine</h4>
              <div className="space-y-2">
                <p><span className="text-gray-500">Home Alone:</span> {lifestyle.homeAloneLocation || 'Not specified'}</p>
                <p><span className="text-gray-500">Sleep Location:</span> {lifestyle.sleepLocation || 'Not specified'}</p>
                <p><span className="text-gray-500">Has Crate:</span> {lifestyle.hasCrate === 'Y' ? 'Yes' : 'No'}</p>
                {lifestyle.hasCrate === 'Y' && (
                  <>
                    <p><span className="text-gray-500">Likes Crate:</span> {lifestyle.likesCrate === 'Y' ? 'Yes' : 'No'}</p>
                    <p><span className="text-gray-500">Crate Location:</span> {lifestyle.crateLocation || 'Not specified'}</p>
                    <p><span className="text-gray-500">Chews Crate:</span> {lifestyle.chewsCrate === 'Y' ? 'Yes' : 'No'}</p>
                  </>
                )}
                <p><span className="text-gray-500">Hours Alone:</span> {lifestyle.hoursAlone || 'Not specified'}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Feeding & Play</h4>
              <div className="space-y-2">
                <p><span className="text-gray-500">Food Brand:</span> {lifestyle.foodBrand || 'Not specified'}</p>
                <p><span className="text-gray-500">Schedule:</span> {lifestyle.feedingSchedule || 'Not specified'}</p>
                <p><span className="text-gray-500">Food Left Out:</span> {lifestyle.foodLeftOut === 'Y' ? 'Yes' : 'No'}</p>
                <p><span className="text-gray-500">Allergies:</span> {lifestyle.allergies || 'None'}</p>
                <p><span className="text-gray-500">Toy Types:</span> {lifestyle.toyTypes || 'Not specified'}</p>
                <p><span className="text-gray-500">Toy Play Time:</span> {lifestyle.toyPlayTime || 'Not specified'}</p>
                <p><span className="text-gray-500">Toy Storage:</span> {lifestyle.toyStorage || 'Not specified'}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Exercise & Walks</h4>
              <div className="space-y-2">
                <p><span className="text-gray-500">Walk Frequency:</span> {lifestyle.walkFrequency || 'Not specified'}</p>
                <p><span className="text-gray-500">Walk Person:</span> {lifestyle.walkPerson || 'Not specified'}</p>
                <p><span className="text-gray-500">Walk Duration:</span> {lifestyle.walkDuration || 'Not specified'}</p>
                <p><span className="text-gray-500">Other Exercise:</span> {lifestyle.otherExercise || 'Not specified'}</p>
                <p><span className="text-gray-500">Walk Equipment:</span> {lifestyle.walkEquipment || 'Not specified'}</p>
                <p><span className="text-gray-500">Off Leash:</span> {lifestyle.offLeash === 'Y' ? 'Yes' : 'No'}</p>
                <p><span className="text-gray-500">Forest Visits:</span> {lifestyle.forestVisits || 'Not specified'}</p>
                <p><span className="text-gray-500">Pulling:</span> {lifestyle.pulling === 'Y' ? 'Yes' : 'No'}</p>
                {lifestyle.pulling === 'Y' && (
                  <p><span className="text-gray-500">Pulling Prevention:</span> {lifestyle.pullingPrevention || 'Not specified'}</p>
                )}
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
              <p>{history.previousTraining || 'No previous training'}</p>
              <p className="mt-2"><span className="text-gray-500">Tools Used:</span> {history.toolsUsed || 'None'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Behavior History</h4>
              <div className="space-y-2">
                <p><span className="text-gray-500">Has Growled:</span> {history.growled === 'Y' ? 'Yes' : 'No'}</p>
                {history.growled === 'Y' && (
                  <p><span className="text-gray-500">Growl Details:</span> {history.growlDetails}</p>
                )}
                <p><span className="text-gray-500">Has Bitten:</span> {history.bitten === 'Y' ? 'Yes' : 'No'}</p>
                {history.bitten === 'Y' && (
                  <p><span className="text-gray-500">Bite Details:</span> {history.biteDetails}</p>
                )}
                <p><span className="text-gray-500">Is Fearful:</span> {history.fearful === 'Y' ? 'Yes' : 'No'}</p>
                {history.fearful === 'Y' && (
                  <p><span className="text-gray-500">Fear Details:</span> {history.fearDetails}</p>
                )}
                <p><span className="text-gray-500">Response to New People:</span> {history.newPeopleResponse || 'Not specified'}</p>
                <p><span className="text-gray-500">Grooming Response:</span> {history.groomingResponse || 'Not specified'}</p>
                <p><span className="text-gray-500">Ignore Reaction:</span> {history.ignoreReaction || 'Not specified'}</p>
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
                <p>{goals.trainingGoals || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Ideal Dog Behavior</h4>
                <p>{goals.idealDogBehavior || 'Not specified'}</p>
              </div>
              {behaviorChecklist && behaviorChecklist.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Current Behavior Checklist</h4>
                  <ul className="list-disc list-inside">
                    {behaviorChecklist.map((behavior: string, index: number) => (
                      <li key={index} className="text-gray-700">{behavior}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const odooClientService = ServiceFactory.getInstance().getOdooClientService();
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedDogs = await odooClientService.getDogs();
        console.log("Fetched dogs in DogsPage:", fetchedDogs);
        setDogs(fetchedDogs);
      } catch (err: any) {
        console.error('Error fetching dogs:', err);
        // Only show error for authentication issues, not for empty results
        if (err.message?.includes('authentication') || err.message?.includes('Access Denied')) {
          setError('Unable to access dog data. Please try logging in again.');
        } else {
          setError('Unable to connect to server. Please check your connection and try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDogs();
  }, [odooClientService]);

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
          </div>        ) : filteredDogs.length > 0 ? (
          filteredDogs.map((dog) => (
            <DogDetailCard key={dog.id} dog={dog} />
          ))
        ) : dogs.length === 0 && !searchTerm ? (
          // No dogs registered yet - friendly empty state
          <div className="text-center py-12 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border border-sky-100">            <div className="mx-auto w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 6.5h15a2 2 0 012 2v7a2 2 0 01-2 2h-15a2 2 0 01-2-2v-7a2 2 0 012-2zm8.25 4.5c0-.69.56-1.25 1.25-1.25s1.25.56 1.25 1.25-.56 1.25-1.25 1.25-1.25-.56-1.25-1.25zm-4.5 0c0-.69.56-1.25 1.25-1.25s1.25.56 1.25 1.25-.56 1.25-1.25 1.25-1.25-.56-1.25-1.25zm1.5-6.5s-1.5 3-3 3 3-3 3-3zm6 0s1.5 3 3 3-3-3-3-3z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to CustomK9!</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't registered any dogs yet. Start your training journey by registering your first furry friend!
            </p>
            <Link 
              href="/client-area/dashboard/intake" 
              className="px-6 py-3 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-all duration-200 hover:shadow-lg inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Register Your First Dog
            </Link>
          </div>
        ) : (
          // Search returned no results
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No dogs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No dogs match "{searchTerm}". Try a different search term or clear the search.
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 