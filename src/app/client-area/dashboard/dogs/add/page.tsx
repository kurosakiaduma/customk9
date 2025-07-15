'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dog } from "@/types/dog";
import ServiceFactory from "@/services/ServiceFactory";

const defaultDog: Partial<Dog> = {
  name: '',
  breed: '',
  age: '',
  gender: '',
  level: 'Beginner',
  progress: 0,
  image: '/images/dog-placeholder.jpg',
  dogInfo: {
    breed: '',
    age: '',
    gender: '',
    level: 'Beginner',
    progress: 0,
    sterilized: '',
    dogSource: '',
    timeWithDog: '',
    medications: '',
    currentDeworming: '',
    tickFleaPreventative: '',
    vetClinic: '',
    vetName: '',
    vetPhone: '',
    medicalIssues: '',
    vetAddress: '',
  },
  lifestyle: {},
  history: {},
  goals: {},
  behaviorChecklist: [],
  notes: '',
};

export default function AddDogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Dog>>(defaultDog);
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Available dog images with local fallbacks
  const dogImageOptions = [
    '/images/dog-placeholder.jpg',
    '/images/dog-01.jpg',
    '/images/dog-02.jpg',
    '/images/dog-03.jpg',
    '/images/dog-04.jpg',
    // Only use placedog.net if we need more variety
    imageLoadError ? '/images/dog-placeholder.jpg' : 'https://placedog.net/500/400?r=1',
  ];

  // Check if external images load correctly
  useEffect(() => {
    const testImage = new (window.Image || Image)();
    testImage.onerror = () => setImageLoadError(true);
    testImage.src = 'https://placedog.net/500/400?r=1';
  }, []);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = "Dog's name is required";
    }
    
    if (!formData.breed?.trim()) {
      newErrors.breed = "Breed is required";
    }
    
    if (!formData.age?.trim()) {
      newErrors.age = "Age is required";
    }
    
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper to ensure all fields in an object are non-undefined strings
  function fillDefaults<T extends Record<string, string>>(obj: Partial<T>, defaults: T): T {
    const result: Record<string, string> = { ...defaults };
    for (const key in defaults) {
      result[key] = typeof obj[key] === 'undefined' ? '' : obj[key] as string;
    }
    return result as T;
  }

  const defaultLifestyle = {
    homeAloneLocation: '', sleepLocation: '', hasCrate: '', likesCrate: '', crateLocation: '', chewsCrate: '', hoursAlone: '', foodBrand: '', feedingSchedule: '', foodLeftOut: '', allergies: '', toyTypes: '', toyPlayTime: '', toyStorage: '', walkFrequency: '', walkPerson: '', walkDuration: '', otherExercise: '', walkEquipment: '', offLeash: '', forestVisits: '', pulling: '', pullingPrevention: ''
  };
  const defaultHistory = {
    previousTraining: '', growled: '', growlDetails: '', bitten: '', biteDetails: '', biteInjury: '', fearful: '', fearDetails: '', newPeopleResponse: '', groomingResponse: '', ignoreReaction: '', previousServices: '', toolsUsed: ''
  };
  const defaultGoals = {
    trainingGoals: '', idealDogBehavior: ''
  };

  // On submit, call OdooServerService.createDogProfile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      const odooService = ServiceFactory.getInstance().getOdooClientService();
      // Prepare payload matching Odoo model fields
      const dogPayload = {
        name: formData.name || '',
        breed: formData.breed || '',
        age: Number(formData.age) || 1,
        gender: formData.gender || '',
        dog_source: formData.dogInfo?.dogSource || '',
        time_with_dog: formData.dogInfo?.timeWithDog || 1,
        medications: formData.dogInfo?.medications || '',
        current_deworming: formData.dogInfo?.currentDeworming || '',
        tick_flea_preventative: formData.dogInfo?.tickFleaPreventative || '',
        vet_clinic: formData.dogInfo?.vetClinic || '',
        vet_name: formData.dogInfo?.vetName || '',
        vet_phone: formData.dogInfo?.vetPhone || '',
        vet_address: formData.dogInfo?.vetAddress || '',
        medical_issues: formData.dogInfo?.medicalIssues || '',
        // Lifestyle fields
        home_alone_location: formData.lifestyle?.homeAloneLocation || '',
        sleep_location: formData.lifestyle?.sleepLocation || '',
        has_crate: formData.lifestyle?.hasCrate || '',
        likes_crate: formData.lifestyle?.likesCrate || '',
        crate_location: formData.lifestyle?.crateLocation || '',
        chews_crate: formData.lifestyle?.chewsCrate || '',
        hours_alone: formData.lifestyle?.hoursAlone || '',
        food_brand: formData.lifestyle?.foodBrand || '',
        feeding_schedule: formData.lifestyle?.feedingSchedule || '',
        food_left_out: formData.lifestyle?.foodLeftOut || '',
        allergies: formData.lifestyle?.allergies || '',
        toy_types: formData.lifestyle?.toyTypes || '',
        toy_play_time: formData.lifestyle?.toyPlayTime || '',
        toy_storage: formData.lifestyle?.toyStorage || '',
        walk_frequency: formData.lifestyle?.walkFrequency || '',
        walk_person: formData.lifestyle?.walkPerson || '',
        walk_duration: formData.lifestyle?.walkDuration || '',
        other_exercise: formData.lifestyle?.otherExercise || '',
        walk_equipment: formData.lifestyle?.walkEquipment || '',
        off_leash: formData.lifestyle?.offLeash || '',
        forest_visits: formData.lifestyle?.forestVisits || '',
        pulling: formData.lifestyle?.pulling || '',
        pulling_prevention: formData.lifestyle?.pullingPrevention || '',
        // History fields
        previous_training: formData.history?.previousTraining || '',
        growled: formData.history?.growled || '',
        growl_details: formData.history?.growlDetails || '',
        bitten: formData.history?.bitten || '',
        bite_details: formData.history?.biteDetails || '',
        bite_injury: formData.history?.biteInjury || '',
        fearful: formData.history?.fearful || '',
        fear_details: formData.history?.fearDetails || '',
        new_people_response: formData.history?.newPeopleResponse || '',
        grooming_response: formData.history?.groomingResponse || '',
        ignore_reaction: formData.history?.ignoreReaction || '',
        previous_services: formData.history?.previousServices || '',
        tools_used: formData.history?.toolsUsed || '',
        // Goals fields
        training_goals: formData.goals?.trainingGoals || '',
        ideal_dog_behavior: formData.goals?.idealDogBehavior || '',
        // Arrays as comma-separated strings
        behavior_checklist: (formData.behaviorChecklist || []).join(','),
        likes_about_dog: (formData.likesAboutDog || []).join(','),
        dislikes_about_dog: (formData.dislikesAboutDog || []).join(','),
        // Other fields
        behavior_details: formData.behaviorDetails || '',
        undesirable_behavior: formData.undesirableBehavior || '',
        fear_description: formData.fearDescription || '',
        notes: formData.notes || '',
        why_training: formData.whyTraining || '',
      };
      const currentUser = odooService.getCurrentUser();
      let ownerId: number | null = null;
      if (currentUser && currentUser.partner_id) {
        if (Array.isArray(currentUser.partner_id)) {
          ownerId = currentUser.partner_id[0]; // [id, name]
        } else {
          ownerId = typeof currentUser.partner_id === "number" ? currentUser.partner_id : null;
        }
      }
      const sterilizedValue = formData.dogInfo?.sterilized === "Yes" || formData.dogInfo?.sterilized === true ? true : false;
      await odooService.createDogProfile({
        ...dogPayload,
        sterilized: sterilizedValue,
        owner_id: ownerId
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        router.push('/client-area/dashboard/dogs');
      }, 1500);
    } catch (error) {
      setErrors({ submit: (error as Error).message || 'Failed to save dog. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Dog</h1>
        <Link href="/client-area/dashboard/dogs" className="text-sky-600 hover:text-sky-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dogs
        </Link>
      </div>

      {submitSuccess ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Dog added successfully! Redirecting to dogs page...
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Basic information */}
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Dog&apos;s Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
                    Breed <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.breed ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  />
                  {errors.breed && <p className="mt-1 text-sm text-red-500">{errors.breed}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="e.g. 2 years"
                      className={`w-full p-2 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
                    />
                    {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="sterilized" className="block text-sm font-medium text-gray-700 mb-1">
                    Sterilized
                  </label>
                  <select
                    id="sterilized"
                    name="sterilized"
                    value={typeof formData.dogInfo?.sterilized === 'boolean' ? (formData.dogInfo?.sterilized ? 'Yes' : 'No') : (formData.dogInfo?.sterilized || '')}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.sterilized ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {errors.sterilized && <p className="mt-1 text-sm text-red-500">{errors.sterilized}</p>}
                </div>
              </div>
            </div>

            {/* Right column - Profile image & notes */}
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Profile Image & Notes</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Image
                </label>
                <div className="relative h-48 w-full mb-4 bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={formData.image || '/images/dog-placeholder.jpg'}
                    alt="Dog profile"
                    fill
                    sizes="100%"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      imgElement.src = "/images/dog-placeholder.jpg";
                    }}
                  />
                </div>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Profile Image
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {dogImageOptions.map((image, index) => (
                    <div 
                      key={index}
                      className={`relative cursor-pointer rounded-md overflow-hidden h-20 border-2 ${formData.image === image ? 'border-sky-500' : 'border-transparent'}`}
                      onClick={() => setFormData({...formData, image})}
                    >
                      <Image
                        src={image}
                        alt={`Dog option ${index + 1}`}
                        fill
                        sizes="100%"
                        style={{ objectFit: "cover" }}
                        onError={(e) => {
                          const imgElement = e.target as HTMLImageElement;
                          imgElement.src = "/images/dog-placeholder.jpg";
                          // If this is the last image option, mark it as having an error
                          if (index === dogImageOptions.length - 1) {
                            setImageLoadError(true);
                          }
                        }}
                      />
                      {formData.image === image && (
                        <div className="absolute top-1 right-1 bg-sky-500 rounded-full p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes about your dog..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Link 
              href="/client-area/dashboard/dogs"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Dog...
                </>
              ) : (
                'Add Dog'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}