"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Type definitions for the form data
interface OtherPet {
  name: string;
  breed: string;
  gender: string;
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
  medicalIssues: string;
  vetName: string;
  vetPhone: string;
  
  // Other Pets
  otherPets: OtherPet[];
  
  // Lifestyle
  sleepLocation: string;
  feedingSchedule: string;
  walkFrequency: string;
  walkEquipment: string[];
  
  // History
  previousTraining: string;
  behaviorConcerns: string;
  fearfulSituations: string;
  
  // Goals
  trainingGoals: string;
}

export default function IntakeFormPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
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
    medicalIssues: "",
    vetName: "",
    vetPhone: "",
    
    // Other Pets
    otherPets: [
      { name: "", breed: "", gender: "" },
    ],
    
    // Lifestyle
    sleepLocation: "",
    feedingSchedule: "",
    walkFrequency: "",
    walkEquipment: [],
    
    // History
    previousTraining: "",
    behaviorConcerns: "",
    fearfulSituations: "",
    
    // Goals
    trainingGoals: ""
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
        { name: "", breed: "", gender: "" }
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
            <div>Behavior</div>
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
                <label className="block text-gray-700 text-sm font-medium mb-1">Breed</label>
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
        
        {/* Page 2: Lifestyle */}
        {currentPage === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-sky-700 border-b pb-2">Lifestyle</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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