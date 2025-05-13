"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Type definitions for the form data
interface OtherPet {
  name: string;
  age: string;
  ageUnit: 'Y' | 'M';
  breed: string;
  gender: string;
  sterilized: string;
}

interface FormData {
  // Client Information
  date: string;
  clientName: string;
  clientOccupation: string;
  coOwnerName: string;
  coOwnerOccupation: string;
  phone: string;
  email: string;
  address: string;
  childrenAndAges: string;
  referralSource: string;
  recentMove: string;
  recentPetChange: string;
  recentFamilyChange: string;
  
  // Dog Information
  dogName: string;
  dogAge: string;
  breed: string;
  gender: string;
  sterilized: string;
  dogSource: string;
  timeWithDog: string;
  medications: string;
  dewormingStatus: string;
  tickFleaPrevention: string;
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
  destroysCrate: string;
  hoursAlone: string;
  foodBrand: string;
  feedingSchedule: string;
  foodLeftOut: string;
  allergies: string;
  toys: string;
  toyPlayDuration: string;
  toyStorage: string;
  walkFrequency: string;
  walkPerson: string;
  walkDuration: string;
  otherExercise: string;
  walkEquipment: string[];
  offLeash: string;
  forestVisits: string;
  pulling: string;
  pullingPrevention: string;
  
  // History
  previousTraining: string;
  growled: string;
  growlingIncidents: string;
  bitten: string;
  bitingIncidents: string;
  injuryType: string;
  fearfulSituations: string;
  responseToNewPeople: string;
  responseToGrooming: string;
  reactionToIgnoring: string;
  previousServices: string;
  trainingTools: string[];
  
  // Goals
  positiveTraits: string[];
  traitsToChange: string[];
  reasonForTraining: string;
  trainingGoals: string;
  idealDogBehavior: string;
  
  // Behavior Issues
  behaviorIssues: string[];
  otherBehaviorIssues: string;
  fearSpecifics: string;
}

export default function ClientRegistrationPage() {
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
    // Client Information
    date: "",
    clientName: "",
    clientOccupation: "",
    coOwnerName: "",
    coOwnerOccupation: "",
    phone: "",
    email: "",
    address: "",
    childrenAndAges: "",
    referralSource: "",
    recentMove: "",
    recentPetChange: "",
    recentFamilyChange: "",
    
    // Dog Information
    dogName: "",
    dogAge: "",
    breed: "",
    gender: "",
    sterilized: "",
    dogSource: "",
    timeWithDog: "",
    medications: "",
    dewormingStatus: "",
    tickFleaPrevention: "",
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
    destroysCrate: "",
    hoursAlone: "",
    foodBrand: "",
    feedingSchedule: "",
    foodLeftOut: "",
    allergies: "",
    toys: "",
    toyPlayDuration: "",
    toyStorage: "",
    walkFrequency: "",
    walkPerson: "",
    walkDuration: "",
    otherExercise: "",
    walkEquipment: [],
    offLeash: "",
    forestVisits: "",
    pulling: "",
    pullingPrevention: "",
    
    // History
    previousTraining: "",
    growled: "",
    growlingIncidents: "",
    bitten: "",
    bitingIncidents: "",
    injuryType: "",
    fearfulSituations: "",
    responseToNewPeople: "",
    responseToGrooming: "",
    reactionToIgnoring: "",
    previousServices: "",
    trainingTools: [],
    
    // Goals
    positiveTraits: ["", "", "", "", ""],
    traitsToChange: ["", "", "", "", ""],
    reasonForTraining: "",
    trainingGoals: "",
    idealDogBehavior: "",
    
    // Behavior Issues
    behaviorIssues: [],
    otherBehaviorIssues: "",
    fearSpecifics: ""
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
  
  // Handle array inputs (like 5 things you like about your dog)
  const handleArrayInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const newArray = [...(formData[name as keyof FormData] as string[])];
    newArray[index] = value;
    setFormData({
      ...formData,
      [name]: newArray
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
    setFormData({
      ...formData,
      otherPets: [
        ...formData.otherPets,
        { name: "", age: "", ageUnit: "Y", breed: "", gender: "", sterilized: "" }
      ]
    });
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
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sky-800 mb-2">New Client Intake Form</h1>
          <p className="text-gray-600">
            Please complete this form to help us better understand you and your dog's needs.
            This information will help us create a personalized training plan.
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
              <div>Client Information</div>
              <div>Dog Information</div>
              <div>Lifestyle</div>
              <div>History</div>
              <div>Goals</div>
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
          
          {/* Page 1: Client Information */}
          {currentPage === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-sky-700 border-b pb-2">Client Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Client Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Occupation</label>
                  <input
                    type="text"
                    name="clientOccupation"
                    value={formData.clientOccupation}
                    onChange={handleInputChange}
                    placeholder="Your Occupation"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Co-Owner's Name</label>
                  <input
                    type="text"
                    name="coOwnerName"
                    value={formData.coOwnerName}
                    onChange={handleInputChange}
                    placeholder="Co-Owner's Full Name (if applicable)"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Co-Owner's Occupation</label>
                  <input
                    type="text"
                    name="coOwnerOccupation"
                    value={formData.coOwnerOccupation}
                    onChange={handleInputChange}
                    placeholder="Co-Owner's Occupation"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Your Phone Number"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email Address"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Address (Physical Location)</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Your Home Address"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Children & Ages</label>
                  <input
                    type="text"
                    name="childrenAndAges"
                    value={formData.childrenAndAges}
                    onChange={handleInputChange}
                    placeholder="Names and Ages of Children in the Home"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">How/where did you hear of The Custom Made Canine?</label>
                  <input
                    type="text"
                    name="referralSource"
                    value={formData.referralSource}
                    onChange={handleInputChange}
                    placeholder="Referral Source"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Have you moved with your dog within the last 12 months?</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="recentMove"
                        value="Y"
                        checked={formData.recentMove === "Y"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="recentMove"
                        value="N"
                        checked={formData.recentMove === "N"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Have you added or lost any pets within the last 12 months?</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="recentPetChange"
                        value="Y"
                        checked={formData.recentPetChange === "Y"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="recentPetChange"
                        value="N"
                        checked={formData.recentPetChange === "N"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Have you added or lost any family members within the last 12 months?</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="recentFamilyChange"
                        value="Y"
                        checked={formData.recentFamilyChange === "Y"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="recentFamilyChange"
                        value="N"
                        checked={formData.recentFamilyChange === "N"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
                    
          {/* Page 2: Dog Information */}
          {currentPage === 2 && (
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
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Breed</label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    placeholder="Dog's Breed"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Gender</label>
                  <div className="flex space-x-4 mt-2">
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
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Sterilized</label>
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
                      <span className="ml-2 text-gray-700">Yes</span>
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
                      <span className="ml-2 text-gray-700">No</span>
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
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Current Medications</label>
                  <input
                    type="text"
                    name="medications"
                    value={formData.medications}
                    onChange={handleInputChange}
                    placeholder="List any medications your dog is taking"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Deworming Status (Last date)</label>
                  <input
                    type="text"
                    name="dewormingStatus"
                    value={formData.dewormingStatus}
                    onChange={handleInputChange}
                    placeholder="Last deworming date"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Tick and Flea Prevention (Last date)</label>
                  <input
                    type="text"
                    name="tickFleaPrevention"
                    value={formData.tickFleaPrevention}
                    onChange={handleInputChange}
                    placeholder="Last prevention treatment date"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-sky-700 mt-6 mb-3">Veterinarian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Name of Clinic</label>
                  <input
                    type="text"
                    name="vetClinic"
                    value={formData.vetClinic}
                    onChange={handleInputChange}
                    placeholder="Veterinary Clinic Name"
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
                    Any medical issues we should be aware of?
                  </label>
                  <textarea
                    name="medicalIssues"
                    value={formData.medicalIssues}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe any medical issues, allergies, or special needs"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-sky-700 mt-6 mb-3">Other Pets in Household</h3>
              {formData.otherPets.map((pet, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={pet.name}
                        onChange={(e) => handleOtherPetChange(index, 'name', e.target.value)}
                        placeholder="Pet's Name"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className="w-2/3">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Age</label>
                        <input
                          type="text"
                          value={pet.age}
                          onChange={(e) => handleOtherPetChange(index, 'age', e.target.value)}
                          placeholder="Age"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Unit</label>
                        <select
                          value={pet.ageUnit}
                          onChange={(e) => handleOtherPetChange(index, 'ageUnit', e.target.value as 'Y' | 'M')}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        >
                          <option value="Y">Years</option>
                          <option value="M">Months</option>
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
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Gender</label>
                      <div className="flex space-x-4 mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={pet.gender === "male"}
                            onChange={(e) => handleOtherPetChange(index, 'gender', "male")}
                            className="form-radio h-4 w-4 text-sky-600"
                          />
                          <span className="ml-2 text-gray-700">Male</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={pet.gender === "female"}
                            onChange={(e) => handleOtherPetChange(index, 'gender', "female")}
                            className="form-radio h-4 w-4 text-sky-600"
                          />
                          <span className="ml-2 text-gray-700">Female</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Sterilized</label>
                      <div className="flex space-x-4 mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={pet.sterilized === "Y"}
                            onChange={(e) => handleOtherPetChange(index, 'sterilized', "Y")}
                            className="form-radio h-4 w-4 text-sky-600"
                          />
                          <span className="ml-2 text-gray-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={pet.sterilized === "N"}
                            onChange={(e) => handleOtherPetChange(index, 'sterilized', "N")}
                            className="form-radio h-4 w-4 text-sky-600"
                          />
                          <span className="ml-2 text-gray-700">No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {index === formData.otherPets.length - 1 && (
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
              ))}
            </div>
          )}
                    
          {/* Page 3: Lifestyle */}
          {currentPage === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-sky-700 border-b pb-2">Lifestyle</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Where does your dog stay when home alone?</label>
                  <input
                    type="text"
                    name="homeAloneLocation"
                    value={formData.homeAloneLocation}
                    onChange={handleInputChange}
                    placeholder="Crate, Kitchen, Bedroom, etc."
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
              </div>
              
              <h3 className="text-lg font-medium text-sky-700 mt-6 mb-3">Crate Training</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Do you have a crate?</label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="hasCrate"
                        value="Y"
                        checked={formData.hasCrate === "Y"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="hasCrate"
                        value="N"
                        checked={formData.hasCrate === "N"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Does your dog like the crate?</label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="likesCrate"
                        value="Y"
                        checked={formData.likesCrate === "Y"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="likesCrate"
                        value="N"
                        checked={formData.likesCrate === "N"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Where is the crate located?</label>
                  <input
                    type="text"
                    name="crateLocation"
                    value={formData.crateLocation}
                    onChange={handleInputChange}
                    placeholder="Living room, Bedroom, etc."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Does your dog destroy the crate?</label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="destroysCrate"
                        value="Y"
                        checked={formData.destroysCrate === "Y"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="destroysCrate"
                        value="N"
                        checked={formData.destroysCrate === "N"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">How many hours a day is your dog left alone?</label>
                  <input
                    type="text"
                    name="hoursAlone"
                    value={formData.hoursAlone}
                    onChange={handleInputChange}
                    placeholder="Number of hours"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-sky-700 mt-6 mb-3">Feeding</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">What brand of food do you feed?</label>
                  <input
                    type="text"
                    name="foodBrand"
                    value={formData.foodBrand}
                    onChange={handleInputChange}
                    placeholder="Brand name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Feeding schedule</label>
                  <input
                    type="text"
                    name="feedingSchedule"
                    value={formData.feedingSchedule}
                    onChange={handleInputChange}
                    placeholder="Once a day, Twice a day, etc."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Do you leave food out all day?</label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="foodLeftOut"
                        value="Y"
                        checked={formData.foodLeftOut === "Y"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="foodLeftOut"
                        value="N"
                        checked={formData.foodLeftOut === "N"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Does your dog have any food allergies?</label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="List any allergies"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-sky-700 mt-6 mb-3">Play and Exercise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">What toys does your dog play with?</label>
                  <input
                    type="text"
                    name="toys"
                    value={formData.toys}
                    onChange={handleInputChange}
                    placeholder="List favorite toys"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">How long do they play with toys?</label>
                  <input
                    type="text"
                    name="toyPlayDuration"
                    value={formData.toyPlayDuration}
                    onChange={handleInputChange}
                    placeholder="Duration"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Where are toys kept?</label>
                  <input
                    type="text"
                    name="toyStorage"
                    value={formData.toyStorage}
                    onChange={handleInputChange}
                    placeholder="Toy box, Around the house, etc."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">How often do you walk your dog?</label>
                  <input
                    type="text"
                    name="walkFrequency"
                    value={formData.walkFrequency}
                    onChange={handleInputChange}
                    placeholder="Daily, Twice daily, etc."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Who walks the dog?</label>
                  <input
                    type="text"
                    name="walkPerson"
                    value={formData.walkPerson}
                    onChange={handleInputChange}
                    placeholder="You, Spouse, Children, etc."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">How long are your walks?</label>
                  <input
                    type="text"
                    name="walkDuration"
                    value={formData.walkDuration}
                    onChange={handleInputChange}
                    placeholder="Duration (minutes/hours)"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">What other exercise does your dog get?</label>
                  <textarea
                    name="otherExercise"
                    value={formData.otherExercise}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Describe other forms of exercise"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">What equipment do you use when walking your dog?</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="walkEquipment"
                        value="flat-collar"
                        checked={formData.walkEquipment.includes("flat-collar")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Flat Collar</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="walkEquipment"
                        value="harness"
                        checked={formData.walkEquipment.includes("harness")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Harness</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="walkEquipment"
                        value="slip-collar"
                        checked={formData.walkEquipment.includes("slip-collar")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Slip Collar</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="walkEquipment"
                        value="head-halter"
                        checked={formData.walkEquipment.includes("head-halter")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Head Halter</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="walkEquipment"
                        value="prong-collar"
                        checked={formData.walkEquipment.includes("prong-collar")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Prong Collar</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="walkEquipment"
                        value="electronic-collar"
                        checked={formData.walkEquipment.includes("electronic-collar")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Electronic Collar</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Do you let your dog off leash?</label>
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
                  <label className="block text-gray-700 text-sm font-medium mb-1">Do you go to forest/bush areas?</label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="forestVisits"
                        value="Y"
                        checked={formData.forestVisits === "Y"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="forestVisits"
                        value="N"
                        checked={formData.forestVisits === "N"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Does your dog pull on leash?</label>
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
                  <label className="block text-gray-700 text-sm font-medium mb-1">What have you done to stop pulling?</label>
                  <textarea
                    name="pullingPrevention"
                    value={formData.pullingPrevention}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Describe techniques you've tried"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>
            </div>
          )}
                    
          {/* Page 4: History */}
          {currentPage === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-sky-700 border-b pb-2">History and Behavior</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
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
                  <label className="block text-gray-700 text-sm font-medium mb-1">Has your dog ever growled at anyone?</label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="growled"
                        value="Y"
                        checked={formData.growled === "Y"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="growled"
                        value="N"
                        checked={formData.growled === "N"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    If yes, describe the incidents:
                  </label>
                  <textarea
                    name="growlingIncidents"
                    value={formData.growlingIncidents}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Describe when and why your dog growled"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Has your dog ever bitten anyone?</label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="bitten"
                        value="Y"
                        checked={formData.bitten === "Y"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="bitten"
                        value="N"
                        checked={formData.bitten === "N"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    If yes, describe the incidents:
                  </label>
                  <textarea
                    name="bitingIncidents"
                    value={formData.bitingIncidents}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Describe when and why your dog bit someone"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    If your dog has bitten, what was the nature of the injury?
                  </label>
                  <input
                    type="text"
                    name="injuryType"
                    value={formData.injuryType}
                    onChange={handleInputChange}
                    placeholder="Describe the severity of the injury"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
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
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    How does your dog respond to new people?
                  </label>
                  <textarea
                    name="responseToNewPeople"
                    value={formData.responseToNewPeople}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Describe typical reactions"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    How does your dog respond to grooming, nail trimming, etc.?
                  </label>
                  <textarea
                    name="responseToGrooming"
                    value={formData.responseToGrooming}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Describe reactions to handling and grooming"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    How does your dog respond when you ignore them?
                  </label>
                  <textarea
                    name="reactionToIgnoring"
                    value={formData.reactionToIgnoring}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Describe behavior when ignored"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    What pet dog services have you used in the past?
                  </label>
                  <input
                    type="text"
                    name="previousServices"
                    value={formData.previousServices}
                    onChange={handleInputChange}
                    placeholder="Daycare, Boarding, Grooming, etc."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Which training tools have you used?</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="trainingTools"
                        value="clicker"
                        checked={formData.trainingTools.includes("clicker")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Clicker</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="trainingTools"
                        value="treats"
                        checked={formData.trainingTools.includes("treats")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Treats/Food</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="trainingTools"
                        value="prong-collar"
                        checked={formData.trainingTools.includes("prong-collar")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Prong Collar</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="trainingTools"
                        value="slip-collar"
                        checked={formData.trainingTools.includes("slip-collar")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Slip/Choke Collar</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="trainingTools"
                        value="electronic-collar"
                        checked={formData.trainingTools.includes("electronic-collar")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Electronic Collar</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="trainingTools"
                        value="head-halter"
                        checked={formData.trainingTools.includes("head-halter")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Head Halter</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="trainingTools"
                        value="harness"
                        checked={formData.trainingTools.includes("harness")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Harness</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="trainingTools"
                        value="citronella-collar"
                        checked={formData.trainingTools.includes("citronella-collar")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-sky-600"
                      />
                      <span className="ml-2 text-gray-700">Citronella Collar</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
                    
          {/* Page 5: Goals */}
          {currentPage === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-sky-700 border-b pb-2">Goals</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    What positive traits do you want your dog to have?
                  </label>
                  <textarea
                    name="positiveTraits"
                    value={formData.positiveTraits.join(", ")}
                    onChange={(e) => setFormData({
                      ...formData,
                      positiveTraits: e.target.value.split(",").map(t => t.trim())
                    })}
                    rows={2}
                    placeholder="List positive traits"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    What traits do you want to change in your dog?
                  </label>
                  <textarea
                    name="traitsToChange"
                    value={formData.traitsToChange.join(", ")}
                    onChange={(e) => setFormData({
                      ...formData,
                      traitsToChange: e.target.value.split(",").map(t => t.trim())
                    })}
                    rows={2}
                    placeholder="List traits to change"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Why are you training your dog?
                  </label>
                  <textarea
                    name="reasonForTraining"
                    value={formData.reasonForTraining}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Describe the reason for training"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    What training goals do you have for your dog?
                  </label>
                  <textarea
                    name="trainingGoals"
                    value={formData.trainingGoals}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Describe training goals"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    What ideal dog behavior do you want for your dog?
                  </label>
                  <textarea
                    name="idealDogBehavior"
                    value={formData.idealDogBehavior}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Describe ideal dog behavior"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  ></textarea>
                </div>
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
                href="/client-area" 
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
    </div>
  );
} 