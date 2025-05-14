"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Type definitions for the form data
interface OtherPet {
  name: string;
  age: string;
  ageUnit: string;
  breed: string;
  gender: string;
  sterilized: string;
}

interface FormData {
  // Dog Information
  dogName: string;
  dogAge: string;
  breed: string;
  gender: string;
  sterilized: string;
  dogSource: string;
  timeWithDog: string;
  medications: string;
  currentDeworming: string;
  tickFleaPreventative: string;
  vetClinic: string;
  vetName: string;
  vetAddress: string;
  vetPhone: string;
  medicalIssues: string;
  
  // Other Pets
  otherPets: OtherPet[];
  
  // Lifestyle
  homeAloneLocation: string;
  sleepLocation: string;
  hasCrate: string;
  likesCrate: string;
  crateLocation: string;
  chewsCrate: string;
  hoursAlone: string;
  foodBrand: string;
  feedingSchedule: string;
  foodLeftOut: string;
  allergies: string;
  toyTypes: string;
  toyPlayTime: string;
  toyStorage: string;
  walkFrequency: string;
  walkPerson: string;
  walkDuration: string;
  otherExercise: string;
  walkEquipment: string;
  offLeash: string;
  forestVisits: string;
  pulling: string;
  pullingPrevention: string;
  
  // History
  previousTraining: string;
  growled: string;
  growlDetails: string;
  bitten: string;
  biteDetails: string;
  biteInjury: string;
  fearful: string;
  fearDetails: string;
  newPeopleResponse: string;
  groomingResponse: string;
  ignoreReaction: string;
  previousServices: string;
  toolsUsed: string;
  
  // Likes/Dislikes & Goals
  likesAboutDog: string[];
  dislikesAboutDog: string[];
  whyTraining: string;
  trainingGoals: string;
  idealDogBehavior: string;
  
  // Behavior Checklist
  behaviorChecklist: string[];
  behaviorDetails: string;
  fearDescription: string;
}

export default function IntakeFormPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const [isLoading, setIsLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    // Dog Information
    dogName: "",
    dogAge: "",
    breed: "",
    gender: "",
    sterilized: "",
    dogSource: "",
    timeWithDog: "",
    medications: "",
    currentDeworming: "",
    tickFleaPreventative: "",
    vetClinic: "",
    vetName: "",
    vetAddress: "",
    vetPhone: "",
    medicalIssues: "",
    
    // Other Pets
    otherPets: [
      { name: "", age: "", ageUnit: "Y", breed: "", gender: "", sterilized: "" },
    ],
    
    // Lifestyle
    homeAloneLocation: "",
    sleepLocation: "",
    hasCrate: "",
    likesCrate: "",
    crateLocation: "",
    chewsCrate: "",
    hoursAlone: "",
    foodBrand: "",
    feedingSchedule: "",
    foodLeftOut: "",
    allergies: "",
    toyTypes: "",
    toyPlayTime: "",
    toyStorage: "",
    walkFrequency: "",
    walkPerson: "",
    walkDuration: "",
    otherExercise: "",
    walkEquipment: "",
    offLeash: "",
    forestVisits: "",
    pulling: "",
    pullingPrevention: "",
    
    // History
    previousTraining: "",
    growled: "",
    growlDetails: "",
    bitten: "",
    biteDetails: "",
    biteInjury: "",
    fearful: "",
    fearDetails: "",
    newPeopleResponse: "",
    groomingResponse: "",
    ignoreReaction: "",
    previousServices: "",
    toolsUsed: "",
    
    // Likes/Dislikes & Goals
    likesAboutDog: ["", "", "", "", ""],
    dislikesAboutDog: ["", "", "", "", ""],
    whyTraining: "",
    trainingGoals: "",
    idealDogBehavior: "",
    
    // Behavior Checklist
    behaviorChecklist: [],
    behaviorDetails: "",
    fearDescription: "",
  });
  
  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle checkbox changes for multi-select options
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        [name]: [...(formData[name as keyof FormData] as string[]), value]
      });
    } else {
      setFormData({
        ...formData,
        [name]: (formData[name as keyof FormData] as string[]).filter(item => item !== value)
      });
    }
  };
  
  // Handle likes/dislikes arrays
  const handleArrayItemChange = (arrayName: 'likesAboutDog' | 'dislikesAboutDog', index: number, value: string) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [arrayName]: newArray
    });
  };
  
  // Handle other pets form
  const handleOtherPetChange = (index: number, field: keyof OtherPet, value: string) => {
    const newPets = [...formData.otherPets];
    newPets[index] = { ...newPets[index], [field]: value };
    setFormData({
      ...formData,
      otherPets: newPets
    });
  };
  
  // Add another pet to the form
  const addAnotherPet = () => {
    if (formData.otherPets.length < 3) {
      setFormData({
        ...formData,
        otherPets: [
          ...formData.otherPets,
          { name: "", age: "", ageUnit: "Y", breed: "", gender: "", sterilized: "" }
        ]
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    
    // In a real application, we would send this data to a backend API
    // For now, we'll save it to localStorage to simulate persistence
    try {
      // Store the intake form data
      localStorage.setItem("customk9_intake_data", JSON.stringify(formData));
      
      // Mark the intake form as completed
      localStorage.setItem("customk9_intake_completed", "true");
      
      // Show success message
      setSubmissionStatus({
        success: true,
        message: "Your intake form has been submitted successfully!"
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/client-area/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error saving form data:", error);
      setSubmissionStatus({
        success: false,
        message: "There was an error submitting your form. Please try again."
      });
      setIsLoading(false);
    }
  };
  
  // Navigation between form pages
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-800 mb-2">Client Intake Form</h1>
        <p className="text-gray-600">
          Please provide information about your dog to help us create a personalized training plan.
        </p>
        
        {/* Progress indicator */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <div key={index} className="text-sm">
                {index + 1}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-sky-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentPage / totalPages) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
            <div>Dog Information</div>
            <div>Lifestyle</div>
            <div>History</div>
            <div>Goals</div>
            <div>Behavior</div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-8">
        {/* Submission status message */}
        {submissionStatus && (
          <div className={`mb-6 p-4 rounded-md ${
            submissionStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <div className="flex items-start">
              {submissionStatus.success ? (
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
              <span>{submissionStatus.message}</span>
            </div>
          </div>
        )}
        
        {/* Page 1: Dog Information */}
        {currentPage === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-sky-700 border-b pb-2">Dog Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Dog's Name</label>
                <input
                  type="text"
                  name="dogName"
                  value={formData.dogName}
                  onChange={handleInputChange}
                  placeholder="Your Dog's Name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Dog's Age</label>
                <input
                  type="text"
                  name="dogAge"
                  value={formData.dogAge}
                  onChange={handleInputChange}
                  placeholder="Age (Years / Months)"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Breed (or mix)</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  placeholder="Dog's Breed"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Female or Male? Is your dog sterilized?</label>
                <div className="flex space-x-4 mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-gray-700">Female</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-gray-700">Male</span>
                  </label>
                </div>
                <div className="flex space-x-4 mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sterilized"
                      value="Y"
                      checked={formData.sterilized === "Y"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-gray-700">Sterilized: Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sterilized"
                      value="N"
                      checked={formData.sterilized === "N"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-gray-700">Sterilized: No</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Where did you get your dog?</label>
                <input
                  type="text"
                  name="dogSource"
                  value={formData.dogSource}
                  onChange={handleInputChange}
                  placeholder="Breeder, Shelter, Friend, etc."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">How long have you had your dog?</label>
                <input
                  type="text"
                  name="timeWithDog"
                  value={formData.timeWithDog}
                  onChange={handleInputChange}
                  placeholder="Time period"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  List all medications your dog is currently taking.
                </label>
                <textarea
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="List current medications"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Is your dog current on deworming?</label>
                <div className="flex space-x-4 mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="currentDeworming"
                      value="Y"
                      checked={formData.currentDeworming === "Y"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="currentDeworming"
                      value="N"
                      checked={formData.currentDeworming === "N"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Is your dog on any tick/Flea preventative?</label>
                <input
                  type="text"
                  name="tickFleaPreventative"
                  value={formData.tickFleaPreventative}
                  onChange={handleInputChange}
                  placeholder="Yes/No and type if applicable"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Vet Clinic</label>
                <input
                  type="text"
                  name="vetClinic"
                  value={formData.vetClinic}
                  onChange={handleInputChange}
                  placeholder="Vet Clinic Name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Vet's Name</label>
                <input
                  type="text"
                  name="vetName"
                  value={formData.vetName}
                  onChange={handleInputChange}
                  placeholder="Veterinarian's Name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Vet's Address</label>
                <input
                  type="text"
                  name="vetAddress"
                  value={formData.vetAddress}
                  onChange={handleInputChange}
                  placeholder="Clinic Address"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Vet's Phone</label>
                <input
                  type="tel"
                  name="vetPhone"
                  value={formData.vetPhone}
                  onChange={handleInputChange}
                  placeholder="Clinic Phone Number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Please list any current or past medical issues including surgeries, infections, tick fever, etc.
                </label>
                <textarea
                  name="medicalIssues"
                  value={formData.medicalIssues}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe any medical issues, surgeries, etc."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-sky-700 mt-6 mb-3">Other Pets In The Home</h3>
            {formData.otherPets.map((pet, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={pet.name}
                      onChange={(e) => handleOtherPetChange(index, 'name', e.target.value)}
                      placeholder="Pet's Name"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Age</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={pet.age}
                        onChange={(e) => handleOtherPetChange(index, 'age', e.target.value)}
                        placeholder="Age"
                        className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                      <select
                        value={pet.ageUnit}
                        onChange={(e) => handleOtherPetChange(index, 'ageUnit', e.target.value)}
                        className="p-2 border border-l-0 border-gray-300 rounded-r-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      >
                        <option value="Y">Y</option>
                        <option value="M">M</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Breed</label>
                    <input
                      type="text"
                      value={pet.breed}
                      onChange={(e) => handleOtherPetChange(index, 'breed', e.target.value)}
                      placeholder="Pet's Breed"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-1">F/M, Sterilized?</label>
                    <div className="flex space-x-2">
                      <select
                        value={pet.gender}
                        onChange={(e) => handleOtherPetChange(index, 'gender', e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="F">F</option>
                        <option value="M">M</option>
                      </select>
                      <select
                        value={pet.sterilized}
                        onChange={(e) => handleOtherPetChange(index, 'sterilized', e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      >
                        <option value="">Sterilized?</option>
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {formData.otherPets.length < 3 && (
              <div className="mt-4">
                <button 
                  type="button" 
                  onClick={addAnotherPet}
                  className="text-sky-600 hover:text-sky-800 font-medium"
                >
                  + Add Another Pet
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Page 2: Lifestyle */}
        {currentPage === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-sky-700 border-b pb-2">About Your Dog's Lifestyle</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Where is your dog when he is home alone?</label>
                <input
                  type="text"
                  name="homeAloneLocation"
                  value={formData.homeAloneLocation}
                  onChange={handleInputChange}
                  placeholder="Crate, specific room, etc."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Where does your dog sleep at night?</label>
                <input
                  type="text"
                  name="sleepLocation"
                  value={formData.sleepLocation}
                  onChange={handleInputChange}
                  placeholder="Your bed, Dog bed, Crate, etc."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Does your dog have a crate?</label>
                <input
                  type="text"
                  name="hasCrate"
                  value={formData.hasCrate}
                  onChange={handleInputChange}
                  placeholder="Yes/No"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Does your dog like the crate?</label>
                <input
                  type="text"
                  name="likesCrate"
                  value={formData.likesCrate}
                  onChange={handleInputChange}
                  placeholder="Yes/No"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Where is the crate located?</label>
                <input
                  type="text"
                  name="crateLocation"
                  value={formData.crateLocation}
                  onChange={handleInputChange}
                  placeholder="Location in home"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Does your dog chew or destroy the crate?</label>
                <input
                  type="text"
                  name="chewsCrate"
                  value={formData.chewsCrate}
                  onChange={handleInputChange}
                  placeholder="Yes/No"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">How many hours does your dog spend alone each day?</label>
                <input
                  type="text"
                  name="hoursAlone"
                  value={formData.hoursAlone}
                  onChange={handleInputChange}
                  placeholder="Number of hours"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">What kind/brand of food do your feed your dog?</label>
                <input
                  type="text"
                  name="foodBrand"
                  value={formData.foodBrand}
                  onChange={handleInputChange}
                  placeholder="Brand and type"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">How much and how often does your dog eat?</label>
                <input
                  type="text"
                  name="feedingSchedule"
                  value={formData.feedingSchedule}
                  onChange={handleInputChange}
                  placeholder="Amount and frequency"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Is food left out during the day for your dog to eat?</label>
                <input
                  type="text"
                  name="foodLeftOut"
                  value={formData.foodLeftOut}
                  onChange={handleInputChange}
                  placeholder="Yes/No"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Dog's allergies:</label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="List any known allergies"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">What kind of toys does your dog have daily access to?</label>
                <input
                  type="text"
                  name="toyTypes"
                  value={formData.toyTypes}
                  onChange={handleInputChange}
                  placeholder="Types of toys"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">How long does your dog play with toys?</label>
                <input
                  type="text"
                  name="toyPlayTime"
                  value={formData.toyPlayTime}
                  onChange={handleInputChange}
                  placeholder="Duration"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Where are the toys kept when not in use?</label>
                <input
                  type="text"
                  name="toyStorage"
                  value={formData.toyStorage}
                  onChange={handleInputChange}
                  placeholder="Storage location"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">How often does your dog go on a walk?</label>
                <input
                  type="text"
                  name="walkFrequency"
                  value={formData.walkFrequency}
                  onChange={handleInputChange}
                  placeholder="Frequency"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Who walks your dog?</label>
                <input
                  type="text"
                  name="walkPerson"
                  value={formData.walkPerson}
                  onChange={handleInputChange}
                  placeholder="Person responsible"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">How long is the walk?</label>
                <input
                  type="text"
                  name="walkDuration"
                  value={formData.walkDuration}
                  onChange={handleInputChange}
                  placeholder="Duration"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Does your dog have any other exercise activities?</label>
                <input
                  type="text"
                  name="otherExercise"
                  value={formData.otherExercise}
                  onChange={handleInputChange}
                  placeholder="Other activities"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  What does your dog wear on a walk? (Harness, Buckle Collar, No-Pull Harness, Choke Chain, Prong/Choke Collar, HeadHalter)
                </label>
                <input
                  type="text"
                  name="walkEquipment"
                  value={formData.walkEquipment}
                  onChange={handleInputChange}
                  placeholder="Equipment used"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Do you ever walk your dog off leash?</label>
                <div className="flex space-x-4 mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="offLeash"
                      value="Y"
                      checked={formData.offLeash === "Y"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="offLeash"
                      value="N"
                      checked={formData.offLeash === "N"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Do you take your dog to the Forest?</label>
                <input
                  type="text"
                  name="forestVisits"
                  value={formData.forestVisits}
                  onChange={handleInputChange}
                  placeholder="Yes/No, frequency"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Does your dog pull on walks?</label>
                <div className="flex space-x-4 mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="pulling"
                      value="Y"
                      checked={formData.pulling === "Y"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="pulling"
                      value="N"
                      checked={formData.pulling === "N"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  If your dog pulls, what have you tried to change his behavior?
                </label>
                <textarea
                  name="pullingPrevention"
                  value={formData.pullingPrevention}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Describe methods tried"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>
          </div>
        )}
        
        {/* Page 3: Behavior */}
        {currentPage === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-sky-700 border-b pb-2">Behavior & History</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Has your dog had previous training?
                </label>
                <textarea
                  name="previousTraining"
                  value={formData.previousTraining}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Describe any previous training experience"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Are there any behavior concerns you have?
                </label>
                <textarea
                  name="behaviorConcerns"
                  value={formData.behaviorConcerns}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Describe any behavior issues or concerns"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Are there any situations where your dog seems fearful?
                </label>
                <textarea
                  name="fearfulSituations"
                  value={formData.fearfulSituations}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Describe situations that cause fear"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>
          </div>
        )}
        
        {/* Page 4: Goals */}
        {currentPage === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-sky-700 border-b pb-2">Training Goals</h2>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                What training goals do you have for your dog?
              </label>
              <textarea
                name="trainingGoals"
                value={formData.trainingGoals}
                onChange={handleInputChange}
                rows={5}
                placeholder="Describe your specific training goals, what behaviors you want to improve, and what you hope to achieve from training."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              ></textarea>
            </div>
          </div>
        )}
        
        {/* Form navigation buttons */}
        <div className="flex justify-between mt-8">
          {currentPage > 1 ? (
            <button
              type="button"
              onClick={prevPage}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              Previous
            </button>
          ) : (
            <Link 
              href="/client-area/dashboard" 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
          )}
          
          {currentPage < totalPages ? (
            <button
              type="button"
              onClick={nextPage}
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
              disabled={isLoading}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 