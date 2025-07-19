"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ServiceFactory from "@/services/ServiceFactory";
import { Dog } from "@/types/dog";
import styles from "./dogs.module.css";

// Dog profile detail component
const DogDetailCard = ({ dog }: { dog: Dog }) => {
  const [imageError, setImageError] = useState(false);

  // Since data is now stored flat in Odoo, we access it directly from the dog object
  // Convert behavior_checklist string back to array if needed
  const behaviorChecklist = typeof dog.behavior_checklist === 'string' 
    ? dog.behavior_checklist.split(', ').filter(item => item.trim()) 
    : (dog.behaviorChecklist || []);

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
            {dog.level || 'Beginner'}
          </span>
        </div>
        <p className="text-black text-base mb-4">
          {dog.breed || 'Mixed Breed'}, {dog.age || 'Unknown Age'}, {dog.gender || 'Unknown Gender'}
        </p>

        {/* Overall Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-black">Overall Training Progress</span>
            <span className="font-medium text-black">{dog.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`bg-sky-600 h-2 rounded-full ${styles.progressBarInner}`}
              style={{ '--progress-width': `${dog.progress || 0}%` } as React.CSSProperties}
            ></div>
          </div>
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-black">General Info</h3>
            <div className="space-y-2">
              <p><span className="text-black font-medium">Source:</span> <span className="text-black">{dog.dog_source || 'Not specified'}</span></p>
              <p><span className="text-black font-medium">Time with you:</span> <span className="text-black">{dog.time_with_dog || 'Not specified'}</span></p>
              <p><span className="text-black font-medium">Sterilized:</span> <span className="text-black">{dog.sterilized ? 'Yes' : 'No'}</span></p>
              <p><span className="text-black font-medium">Medications:</span> <span className="text-black">{dog.medications || 'None'}</span></p>
              <p><span className="text-black font-medium">Current Deworming:</span> <span className="text-black">{dog.current_deworming || 'Not specified'}</span></p>
              <p><span className="text-black font-medium">Tick/Flea Preventative:</span> <span className="text-black">{dog.tick_flea_preventative || 'Not specified'}</span></p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-black">Veterinary Details</h3>
            <div className="space-y-2">
              <p><span className="text-black font-medium">Clinic:</span> <span className="text-black">{dog.vet_clinic || 'Not specified'}</span></p>
              <p><span className="text-black font-medium">Vet Name:</span> <span className="text-black">{dog.vet_name || 'Not specified'}</span></p>
              <p><span className="text-black font-medium">Vet Phone:</span> <span className="text-black">{dog.vet_phone || 'Not specified'}</span></p>
              <p><span className="text-black font-medium">Medical Issues:</span> <span className="text-black">{dog.medical_issues || 'None'}</span></p>
            </div>
          </div>
        </div>

        {/* Lifestyle Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-sky-800">Lifestyle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-black">Daily Routine</h4>
              <div className="space-y-2">
                <p><span className="text-black font-medium">Home Alone:</span> <span className="text-black">{dog.home_alone_location || 'Not specified'}</span></p>
                <p><span className="text-black font-medium">Sleep Location:</span> <span className="text-black">{dog.sleep_location || 'Not specified'}</span></p>
                <p><span className="text-black font-medium">Has Crate:</span> <span className="text-black">{dog.has_crate === 'Y' ? 'Yes' : 'No'}</span></p>
                {dog.has_crate === 'Y' && (
                  <>
                    <p><span className="text-black font-medium">Likes Crate:</span> <span className="text-black">{dog.likes_crate === 'Y' ? 'Yes' : 'No'}</span></p>
                    <p><span className="text-black font-medium">Crate Location:</span> <span className="text-black">{dog.crate_location || 'Not specified'}</span></p>
                    <p><span className="text-black font-medium">Chews Crate:</span> <span className="text-black">{dog.chews_crate === 'Y' ? 'Yes' : 'No'}</span></p>
                  </>
                )}
                <p><span className="text-black font-medium">Hours Alone:</span> <span className="text-black">{dog.hours_alone || 'Not specified'}</span></p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-black">Feeding & Play</h4>
              <div className="space-y-2">
                <p><span className="text-black font-medium">Food Brand:</span> <span className="text-black">{dog.food_brand || 'Not specified'}</span></p>
                <p><span className="text-black font-medium">Schedule:</span> <span className="text-black">{dog.feeding_schedule || 'Not specified'}</span></p>
                <p><span className="text-black font-medium">Food Left Out:</span> <span className="text-black">{dog.food_left_out === 'Y' ? 'Yes' : 'No'}</span></p>
                <p><span className="text-black font-medium">Allergies:</span> <span className="text-black">{dog.allergies || 'None'}</span></p>
                <p><span className="text-black font-medium">Toy Types:</span> <span className="text-black">{dog.toy_types || 'Not specified'}</span></p>
                <p><span className="text-black font-medium">Toy Play Time:</span> <span className="text-black">{dog.toy_play_time || 'Not specified'}</span></p>
                <p><span className="text-black font-medium">Toy Storage:</span> <span className="text-black">{dog.toy_storage || 'Not specified'}</span></p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-black">Exercise & Walks</h4>
              <div className="space-y-2">
                <p><span className="text-black font-medium">Walk Frequency:</span> <span className="text-black">{dog.walk_frequency || 'Not specified'}</span></p>
                <p><span className="text-black font-medium">Walk Person:</span> <span className="text-black">{dog.walk_person || 'Not specified'}</span></p>
                <p><span className="text-black font-medium">Walk Duration:</span> <span className="text-black">{dog.walk_duration || 'Not specified'}</span></p>
                <p><span className="text-black font-medium">Other Exercise:</span> <span className="text-black">{dog.other_exercise || 'Not specified'}</span></p>
                <p><span className="text-black font-medium">Walk Equipment:</span> <span className="text-black">{dog.walk_equipment || 'Not specified'}</span></p>
                <p><span className="text-black font-medium">Off Leash:</span> <span className="text-black">{dog.off_leash === 'Y' ? 'Yes' : 'No'}</span></p>
                <p><span className="text-black font-medium">Forest Visits:</span> <span className="text-black">{dog.forest_visits || 'Not specified'}</span></p>
                <p><span className="text-black font-medium">Pulling:</span> <span className="text-black">{dog.pulling === 'Y' ? 'Yes' : 'No'}</span></p>
                {dog.pulling === 'Y' && (
                  <p><span className="text-black font-medium">Pulling Prevention:</span> <span className="text-black">{dog.pulling_prevention || 'Not specified'}</span></p>
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
              <h4 className="font-medium mb-2 text-black">Previous Training</h4>
              <p className="text-black">{dog.previous_training || 'No previous training'}</p>
              <p className="mt-2"><span className="text-black font-medium">Tools Used:</span> <span className="text-black">{dog.tools_used || 'None'}</span></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-black">Behavior History</h4>
              <div className="space-y-2">
                <p><span className="text-black font-medium">Has Growled:</span> <span className="text-black">{dog.growled === 'Y' ? 'Yes' : 'No'}</span></p>
                {dog.growled === 'Y' && (
                  <p><span className="text-black font-medium">Growl Details:</span> <span className="text-black">{dog.growl_details}</span></p>
                )}
                <p><span className="text-black font-medium">Has Bitten:</span> <span className="text-black">{dog.bitten === 'Y' ? 'Yes' : 'No'}</span></p>
                {dog.bitten === 'Y' && (
                  <p><span className="text-black font-medium">Bite Details:</span> <span className="text-black">{dog.bite_details}</span></p>
                )}
                <p><span className="text-black font-medium">Is Fearful:</span> <span className="text-black">{dog.fearful === 'Y' ? 'Yes' : 'No'}</span></p>
                {dog.fearful === 'Y' && (
                  <p><span className="text-black font-medium">Fear Details:</span> <span className="text-black">{dog.fear_details}</span></p>
                )}
                <p><span className="text-black font-medium">Response to New People:</span> <span className="text-black">{dog.new_people_response || 'Not specified'}</span></p>
                <p><span className="text-black font-medium">Grooming Response:</span> <span className="text-black">{dog.grooming_response || 'Not specified'}</span></p>
                <p><span className="text-black font-medium">Ignore Reaction:</span> <span className="text-black">{dog.ignore_reaction || 'Not specified'}</span></p>
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
                <h4 className="font-medium mb-2 text-black">Training Goals</h4>
                <p className="text-black">{dog.training_goals || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-black">Ideal Dog Behavior</h4>
                <p className="text-black">{dog.ideal_dog_behavior || 'Not specified'}</p>
              </div>
              {behaviorChecklist && behaviorChecklist.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-black">Current Behavior Checklist</h4>
                  <ul className="list-disc list-inside">
                    {behaviorChecklist.map((behavior: string, index: number) => (
                      <li key={index} className="text-black">{behavior}</li>
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
        const currentUser = await odooClientService.getCurrentUser();
        if (currentUser && currentUser.partner_id) {
                    const partnerId = Array.isArray(currentUser.partner_id) ? currentUser.partner_id[0] : currentUser.partner_id;
          const fetchedDogs = await odooClientService.getDogs(partnerId);
          console.log("Fetched dogs in DogsPage:", fetchedDogs);
          setDogs(fetchedDogs);
        } else {
          console.warn("Could not fetch dogs: No current user or partner ID found.");
          setDogs([]); // Ensure dog list is empty if no user is found
        }
      } catch (err: unknown) {
        console.error('Error fetching dogs:', err);
        let errorMessage = 'Unable to connect to server. Please check your connection and try again.';
        if (err instanceof Error) {
          if (err.message?.includes('authentication') || err.message?.includes('Access Denied')) {
            errorMessage = 'Unable to access dog data. Please try logging in again.';
          }
        }
        setError(errorMessage);
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
              You haven&apos;t registered any dogs yet. Start your training journey by registering your first furry friend!
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
              No dogs match &quot;{searchTerm}&quot;. Try a different search term or clear the search.
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