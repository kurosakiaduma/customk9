"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define the interface for the new dog form
interface NewDogFormData {
  name: string;
  breed: string;
  age: string;
  ageUnit: string;
  birthday: string;
  gender: string;
  weight: string;
  microchip: string;
  image: string; // URL to the image
}

export default function AddDogPage() {
  const router = useRouter();
  const [hasFilledIntakeForm, setHasFilledIntakeForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  
  // Initialize form data
  const [formData, setFormData] = useState<NewDogFormData>({
    name: "",
    breed: "",
    age: "",
    ageUnit: "years",
    birthday: "",
    gender: "",
    weight: "",
    microchip: "",
    image: "/images/dog-placeholder.jpg", // Default placeholder image
  });
  
  // Check if intake form has been submitted
  useEffect(() => {
    const intakeFormCompleted = localStorage.getItem("customk9_intake_completed");
    if (intakeFormCompleted) {
      setHasFilledIntakeForm(true);
    }
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);
    
    // Simple validation
    if (!formData.name.trim()) {
      setFormError("Dog's name is required");
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.breed.trim()) {
      setFormError("Breed information is required");
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.age.trim()) {
      setFormError("Age information is required");
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.gender) {
      setFormError("Please select your dog's gender");
      setIsSubmitting(false);
      return;
    }
    
    // If we get here, form is valid
    try {
      // In a real app, this would send the data to an API
      // For now, we'll simulate by saving to localStorage
      
      // Get existing dogs or initialize empty array
      const existingDogsJson = localStorage.getItem("customk9_dogs");
      const existingDogs = existingDogsJson ? JSON.parse(existingDogsJson) : [];
      
      // Create new dog with an ID
      const newDog = {
        ...formData,
        id: Date.now(), // Use timestamp as a simple ID
        level: "Beginner", // Default level for new dogs
        progress: 0, // Default progress for new dogs
        intakeDetails: {
          // This would normally come from the intake form
          dogSource: "Added manually",
          timeWithDog: formData.age + " " + formData.ageUnit,
          medicalIssues: "None specified",
          vetClinic: "Not specified",
          vetName: "Not specified",
          vetPhone: "Not specified",
          previousTraining: "None specified",
          behaviorConcerns: "None specified",
          sleepLocation: "Not specified",
          feedingSchedule: "Not specified",
          walkFrequency: "Not specified",
          walkEquipment: ["Not specified"],
          trainingGoals: "Not specified",
          fearfulSituations: "Not specified",
          responseToNewPeople: "Not specified",
        }
      };
      
      // Add new dog to array
      existingDogs.push(newDog);
      
      // Save updated array back to localStorage
      localStorage.setItem("customk9_dogs", JSON.stringify(existingDogs));
      
      // Show success message
      setFormSuccess("Dog added successfully!");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/client-area/dashboard/dogs");
      }, 1500);
      
    } catch (error) {
      console.error("Error saving dog data:", error);
      setFormError("There was an error saving your dog's information. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  // Sample dog images for selection
  const dogImages = [
    { src: "/images/dog-01.jpg", alt: "German Shepherd" },
    { src: "/images/dog-02.jpg", alt: "Labrador" },
    { src: "/images/dog-03.jpg", alt: "Golden Retriever" },
    { src: "/images/dog-04.jpg", alt: "Border Collie" },
    { src: "/images/dog-placeholder.jpg", alt: "Default" }
  ];
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-800">Register New Dog</h1>
        <Link 
          href="/client-area/dashboard/dogs"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Link>
      </div>
      
      {/* Intake Form Warning - show only if not completed */}
      {!hasFilledIntakeForm && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-5">
              <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-amber-800 text-xl font-bold mb-2">Complete Your Client Intake Form First</h3>
              <p className="text-amber-700 mb-4">
                For the best experience, we recommend completing the comprehensive intake form before adding dogs to your profile. 
                This helps us create a more personalized training plan tailored to your dog's specific needs.
              </p>
              <Link 
                href="/client-area/registration" 
                className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium text-base transition-colors shadow-md"
              >
                Complete Intake Form First
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Form Status Messages */}
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {formError}
        </div>
      )}
      
      {formSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {formSuccess}
        </div>
      )}
      
      {/* Dog Registration Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
                Dog's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Your dog's name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="breed" className="block text-gray-700 text-sm font-medium mb-1">
                Breed <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Dog's breed or mix"
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <div className="w-2/3">
                <label htmlFor="age" className="block text-gray-700 text-sm font-medium mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Age"
                  required
                />
              </div>
              <div className="w-1/3">
                <label htmlFor="ageUnit" className="block text-gray-700 text-sm font-medium mb-1">
                  Unit
                </label>
                <select
                  id="ageUnit"
                  name="ageUnit"
                  value={formData.ageUnit}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="birthday" className="block text-gray-700 text-sm font-medium mb-1">
                Birthday (if known)
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4 mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleInputChange}
                    className="form-radio h-4 w-4 text-sky-600"
                    required
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
              <label htmlFor="weight" className="block text-gray-700 text-sm font-medium mb-1">
                Weight (kg)
              </label>
              <input
                type="text"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Dog's weight"
              />
            </div>
            
            <div>
              <label htmlFor="microchip" className="block text-gray-700 text-sm font-medium mb-1">
                Microchip Number (if available)
              </label>
              <input
                type="text"
                id="microchip"
                name="microchip"
                value={formData.microchip}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Microchip number"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-3">
              Select a profile image for your dog
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {dogImages.map((image, index) => (
                <div 
                  key={index}
                  onClick={() => setFormData({...formData, image: image.src})}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 h-24 ${
                    formData.image === image.src 
                      ? 'border-sky-500 ring-2 ring-sky-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image.src})` }}></div>
                  {formData.image === image.src && (
                    <div className="absolute top-1 right-1 bg-sky-500 rounded-full p-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-sky-600 text-white rounded-md font-medium hover:bg-sky-700 transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Register Dog
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 