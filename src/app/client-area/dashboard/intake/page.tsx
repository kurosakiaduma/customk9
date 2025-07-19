"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dog } from "@/types/dog";
import ServiceFactory from "@/services/ServiceFactory";

const defaultDogInfo = {
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
};

const defaultDog: Partial<Dog> = {
  name: '',
  breed: '',
  age: '',
  gender: '',
  level: 'Beginner',
  progress: 0,
  image: '/images/dog-placeholder.jpg',
  dogInfo: { ...defaultDogInfo },
  lifestyle: {},
  history: {},
  goals: {},
  behaviorChecklist: [],
  notes: '',
  likesAboutDog: [],
  dislikesAboutDog: [],
  whyTraining: '',
};

export default function IntakeFormPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const [isLoading, setIsLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [partner_id, setPartnerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("[IntakeFormPage] useEffect mounting, attempting to fetch user.");
      try {
        const odooService = ServiceFactory.getInstance().getOdooClientService();
        const currentUser = await odooService.getCurrentUser();
        if (currentUser && currentUser.partner_id) {
          console.log(`[IntakeFormPage] Successfully fetched user. Partner ID: ${currentUser.partner_id}`);
          setPartnerId(currentUser.partner_id);
        } else {
          console.warn("[IntakeFormPage] Fetched user data, but partner_id is missing.", currentUser);
          setPartnerId(null);
        }
      } catch (error) {
        console.error("[IntakeFormPage] An error occurred while fetching the user:", error);
        setPartnerId(null);
      }
    };

    fetchUser();
  }, []);

  // Form state
  const [formData, setFormData] = useState<Partial<Dog>>(defaultDog);

  // Load saved data if it exists
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("customk9_intake_data");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);

        // Show a notification that the form is being edited
        setSubmissionStatus({
          success: true,
          message: "Your previously saved form has been loaded. You can make changes and resubmit."
        });

        // Clear the notification after 5 seconds
        setTimeout(() => {
          setSubmissionStatus(null);
        }, 5000);
      }
    } catch (error) {
      console.error("Error loading saved form data:", error);
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const dogInfoFields = ['dogSource', 'timeWithDog', 'medications', 'currentDeworming', 'tickFleaPreventative', 'vetClinic', 'vetName', 'vetPhone', 'medicalIssues', 'vetAddress', 'sterilized'];
    const lifestyleFields = ['homeAloneLocation', 'sleepLocation', 'hasCrate', 'likesCrate', 'crateLocation', 'chewsCrate', 'hoursAlone', 'foodBrand', 'feedingSchedule', 'foodLeftOut', 'allergies', 'toyTypes', 'toyPlayTime', 'toyStorage', 'walkFrequency', 'walkPerson', 'walkDuration', 'otherExercise', 'walkEquipment', 'offLeash', 'forestVisits', 'pulling', 'pullingPrevention'];
    const historyFields = ['previousTraining', 'growled', 'growlDetails', 'bitten', 'biteDetails', 'biteInjury', 'fearful', 'fearDetails', 'newPeopleResponse', 'groomingResponse', 'ignoreReaction', 'previousServices', 'toolsUsed'];
    const goalsFields = ['idealDogBehavior'];

    if (dogInfoFields.includes(name)) {
      setFormData(prev => ({ ...prev, dogInfo: { ...prev.dogInfo, [name]: value } }));
    } else if (lifestyleFields.includes(name)) {
      setFormData(prev => ({ ...prev, lifestyle: { ...prev.lifestyle, [name]: value } }));
    } else if (historyFields.includes(name)) {
      setFormData(prev => ({ ...prev, history: { ...prev.history, [name]: value } }));
    } else if (goalsFields.includes(name)) {
      setFormData(prev => ({ ...prev, goals: { ...prev.goals, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    // Only allow array fields
    if (
      name === "behaviorChecklist" ||
      name === "likesAboutDog" ||
      name === "dislikesAboutDog"
    ) {
      const arr = Array.isArray(formData[name as keyof typeof formData])
        ? (formData[name as keyof typeof formData] as string[])
        : [];
      setFormData({
        ...formData,
        [name]: checked
          ? [...arr, value]
          : arr.filter(item => item !== value),
      });
    }
  };

  // Handle likes/dislikes arrays
  const handleArrayItemChange = (arrayName: 'likesAboutDog' | 'dislikesAboutDog', index: number, value: string) => {
    const arr = Array.isArray(formData[arrayName]) ? formData[arrayName] as string[] : [];
    const newArray = [...arr];
    newArray[index] = value;
    setFormData({
      ...formData,
      [arrayName]: newArray
    });
  };

  // Navigation between form pages
  const nextPage = () => {
    if (currentPage < totalPages) {
      // Save form data to localStorage before navigating
      localStorage.setItem("customk9_intake_data", JSON.stringify(formData));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[IntakeFormPage] handleSubmit triggered.");

    if (currentPage < totalPages) {
      nextPage();
      return;
    }

    setIsLoading(true);
    setSubmissionStatus(null);

    console.log("[IntakeFormPage] Attempting to submit form data:", formData);

    if (!partner_id) {
      console.error("[IntakeFormPage] Submission failed: partner_id is not available.");
      setSubmissionStatus({ success: false, message: 'Could not determine the current user. Please refresh and try again.' });
      setIsLoading(false);
      return;
    }

    try {
      const odooService = ServiceFactory.getInstance().getOdooClientService();
      const numericPartnerId = Array.isArray(partner_id) ? partner_id[0] : partner_id;
      console.log(`[IntakeFormPage] Submitting with partner ID: ${numericPartnerId}`);

      if (!numericPartnerId) {
        setSubmissionStatus({
          success: false,
          message: "Could not submit the form. Your user ID is missing. Please log in again.",
        });
        setIsLoading(false);
        return;
      }

      const ensureStringValues = (obj: { [key: string]: unknown }): { [key: string]: string } => {
        if (!obj) return {};
        const newObj: { [key: string]: string } = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = String(obj[key] ?? '');
          }
        }
        return newObj;
      };

      // Flatten the nested objects to match Odoo's flat field structure
      const flattenedData: Record<string, unknown> = {
        name: formData.name || 'Unnamed Dog',
        breed: formData.breed || '',
        age: formData.age || '',
        gender: formData.gender || '',
        level: formData.level || 'Beginner',
        progress: formData.progress || 0,
        notes: formData.notes || '',
        why_training: formData.whyTraining || '',

        // Flatten dogInfo fields
        ...(formData.dogInfo ? {
          sterilized: formData.dogInfo.sterilized === 'Yes',
          dog_source: formData.dogInfo.dogSource || '',
          time_with_dog: formData.dogInfo.timeWithDog || '',
          medications: formData.dogInfo.medications || '',
          current_deworming: formData.dogInfo.currentDeworming || '',
          tick_flea_preventative: formData.dogInfo.tickFleaPreventative || '',
          vet_clinic: formData.dogInfo.vetClinic || '',
          vet_name: formData.dogInfo.vetName || '',
          vet_phone: formData.dogInfo.vetPhone || '',
          vet_address: formData.dogInfo.vetAddress || '',
          medical_issues: formData.dogInfo.medicalIssues || '',
        } : {}),

        // Flatten lifestyle fields
        ...(formData.lifestyle ? {
          home_alone_location: formData.lifestyle.homeAloneLocation || '',
          sleep_location: formData.lifestyle.sleepLocation || '',
          has_crate: formData.lifestyle.hasCrate || '',
          likes_crate: formData.lifestyle.likesCrate || '',
          crate_location: formData.lifestyle.crateLocation || '',
          chews_crate: formData.lifestyle.chewsCrate || '',
          hours_alone: formData.lifestyle.hoursAlone || '',
          food_brand: formData.lifestyle.foodBrand || '',
          feeding_schedule: formData.lifestyle.feedingSchedule || '',
          food_left_out: formData.lifestyle.foodLeftOut || '',
          allergies: formData.lifestyle.allergies || '',
          toy_types: formData.lifestyle.toyTypes || '',
          toy_play_time: formData.lifestyle.toyPlayTime || '',
          toy_storage: formData.lifestyle.toyStorage || '',
          walk_frequency: formData.lifestyle.walkFrequency || '',
          walk_person: formData.lifestyle.walkPerson || '',
          walk_duration: formData.lifestyle.walkDuration || '',
          other_exercise: formData.lifestyle.otherExercise || '',
          walk_equipment: formData.lifestyle.walkEquipment || '',
          off_leash: formData.lifestyle.offLeash || '',
          forest_visits: formData.lifestyle.forestVisits || '',
          pulling: formData.lifestyle.pulling || '',
          pulling_prevention: formData.lifestyle.pullingPrevention || '',
        } : {}),

        // Flatten history fields
        ...(formData.history ? {
          previous_training: formData.history.previousTraining || '',
          growled: formData.history.growled || '',
          growl_details: formData.history.growlDetails || '',
          bitten: formData.history.bitten || '',
          bite_details: formData.history.biteDetails || '',
          bite_injury: formData.history.biteInjury || '',
          fearful: formData.history.fearful || '',
          fear_details: formData.history.fearDetails || '',
          new_people_response: formData.history.newPeopleResponse || '',
          grooming_response: formData.history.groomingResponse || '',
          ignore_reaction: formData.history.ignoreReaction || '',
          previous_services: formData.history.previousServices || '',
          tools_used: formData.history.toolsUsed || '',
        } : {}),

        // Flatten goals fields
        ...(formData.goals ? {
          training_goals: formData.goals.trainingGoals || '',
          ideal_dog_behavior: formData.goals.idealDogBehavior || '',
        } : {}),

        // Handle array fields - convert to comma-separated strings for Odoo
        behavior_checklist: Array.isArray(formData.behaviorChecklist)
          ? formData.behaviorChecklist.join(', ')
          : '',
        likes_about_dog: Array.isArray(formData.likesAboutDog)
          ? formData.likesAboutDog.filter(item => item && item.trim()).join(', ')
          : '',
        dislikes_about_dog: Array.isArray(formData.dislikesAboutDog)
          ? formData.dislikesAboutDog.filter(item => item && item.trim()).join(', ')
          : '',

        // Handle additional behavior fields
        behavior_details: formData.behaviorDetails || '',
        undesirable_behavior: formData.undesirableBehavior || '',
        fear_description: formData.fearDescription || '',
      };

      const finalDogData = flattenedData as Partial<Dog>;

      const newDogId = await odooService.createDogProfile(finalDogData, numericPartnerId);
      console.log('Successfully created dog with ID:', newDogId);

      localStorage.removeItem("customk9_intake_data");

      setSubmissionStatus({
        success: true,
        message: "Your intake form has been submitted successfully! Redirecting..."
      });

      setTimeout(() => {
        router.push('/client-area/dashboard');
      }, 3000);

    } catch (error) {
      console.error('Failed to submit intake form:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setSubmissionStatus({ success: false, message: `Submission failed: ${errorMessage}` });
    } finally {
      setIsLoading(false);
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
          <div className={`mb-6 p-4 rounded-md ${submissionStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
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
                <label className="block text-black text-sm font-medium mb-1">Dog&apos;s Name</label>
                <input disabled={isLoading}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Dog&apos;s Name"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Dog&apos;s Age</label>
                <input disabled={isLoading}
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Age (Years / Months)"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Breed (or mix)</label>
                <input disabled={isLoading}
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  placeholder="Dog&apos;s Breed"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Female or Male?</label>
                <div className="flex space-x-4 mt-2">
                  <label className="inline-flex items-center">
                    <input disabled={isLoading}
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-black">Female</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input disabled={isLoading}
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-black">Male</span>
                  </label>
                </div>
                <div className="flex flex-col md:flex-row md:items-center mt-2 space-y-2 md:space-y-0 md:space-x-4">
                  <label htmlFor="sterilized" className="block text-sm font-medium text-black mb-1 md:mb-0">
                    Sterilized
                  </label>
                  <select disabled={isLoading}
                    id="sterilized"
                    name="sterilized"
                    value={typeof formData.dogInfo?.sterilized === 'boolean' ? (formData.dogInfo?.sterilized ? 'Yes' : 'No') : (formData.dogInfo?.sterilized || '')}
                    onChange={handleInputChange}
                    className="w-full md:w-auto p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent text-black"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Where did you get your dog?</label>
                <input disabled={isLoading}
                  type="text"
                  name="dogSource"
                  value={formData.dogInfo?.dogSource}
                  onChange={handleInputChange}
                  placeholder="Breeder, Shelter, Friend, etc."
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">How long have you had your dog?</label>
                <input disabled={isLoading}
                  type="text"
                  name="timeWithDog"
                  value={formData.dogInfo?.timeWithDog}
                  onChange={handleInputChange}
                  placeholder="Time period"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-black text-sm font-medium mb-1">
                  List all medications your dog is currently taking.
                </label>
                <textarea disabled={isLoading}
                  name="medications"
                  value={formData.dogInfo?.medications}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="List current medications"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                ></textarea>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Is your dog current on deworming?</label>
                <div className="flex space-x-4 mt-2">
                  <label className="inline-flex items-center">
                    <input disabled={isLoading}
                      type="radio"
                      name="currentDeworming"
                      value="Y"
                      checked={formData.dogInfo?.currentDeworming === "Y"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-black">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input disabled={isLoading}
                      type="radio"
                      name="currentDeworming"
                      value="N"
                      checked={formData.dogInfo?.currentDeworming === "N"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-black">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Is your dog on any tick/Flea preventative?</label>
                <input disabled={isLoading}
                  type="text"
                  name="tickFleaPreventative"
                  value={formData.dogInfo?.tickFleaPreventative}
                  onChange={handleInputChange}
                  placeholder="Yes/No and type if applicable"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Vet Clinic</label>
                <input disabled={isLoading}
                  type="text"
                  name="vetClinic"
                  value={formData.dogInfo?.vetClinic}
                  onChange={handleInputChange}
                  placeholder="Vet Clinic Name"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Vet&apos;s Name</label>
                <input disabled={isLoading}
                  type="text"
                  name="vetName"
                  value={formData.dogInfo?.vetName}
                  onChange={handleInputChange}
                  placeholder="Veterinarian's Name"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Vet&apos;s Address</label>
                <input disabled={isLoading}
                  type="text"
                  name="vetAddress"
                  value={formData.dogInfo?.vetAddress}
                  onChange={handleInputChange}
                  placeholder="Clinic Address"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Vet&apos;s Phone</label>
                <input disabled={isLoading}
                  type="tel"
                  name="vetPhone"
                  value={formData.dogInfo?.vetPhone}
                  onChange={handleInputChange}
                  placeholder="Clinic Phone Number"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-black text-sm font-medium mb-1">
                  Please list any current or past medical issues including surgeries, infections, tick fever, etc.
                </label>
                <textarea disabled={isLoading}
                  name="medicalIssues"
                  value={formData.dogInfo?.medicalIssues}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe any medical issues, surgeries, etc."
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Page 2: Lifestyle */}
        {currentPage === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-sky-700 border-b pb-2">About Your Dog&apos;s Lifestyle</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-black text-sm font-medium mb-1">Where is your dog when he is home alone?</label>
                <input disabled={isLoading}
                  type="text"
                  name="homeAloneLocation"
                  value={formData.lifestyle?.homeAloneLocation}
                  onChange={handleInputChange}
                  placeholder="Crate, specific room, etc."
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Where does your dog sleep at night?</label>
                <input disabled={isLoading}
                  type="text"
                  name="sleepLocation"
                  value={formData.lifestyle?.sleepLocation}
                  onChange={handleInputChange}
                  placeholder="Your bed, Dog bed, Crate, etc."
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Does your dog have a crate?</label>
                <input disabled={isLoading}
                  type="text"
                  name="hasCrate"
                  value={formData.lifestyle?.hasCrate}
                  onChange={handleInputChange}
                  placeholder="Yes/No"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Does your dog like the crate?</label>
                <input disabled={isLoading}
                  type="text"
                  name="likesCrate"
                  value={formData.lifestyle?.likesCrate}
                  onChange={handleInputChange}
                  placeholder="Yes/No"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Where is the crate located?</label>
                <input disabled={isLoading}
                  type="text"
                  name="crateLocation"
                  value={formData.lifestyle?.crateLocation}
                  onChange={handleInputChange}
                  placeholder="Location in home"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-black"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Does your dog chew or destroy the crate?</label>
                <input disabled={isLoading}
                  type="text"
                  name="chewsCrate"
                  value={formData.lifestyle?.chewsCrate}
                  onChange={handleInputChange}
                  placeholder="Yes/No"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">How many hours does your dog spend alone each day?</label>
                <input disabled={isLoading}
                  type="text"
                  name="hoursAlone"
                  value={formData.lifestyle?.hoursAlone}
                  onChange={handleInputChange}
                  placeholder="Number of hours"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">What kind/brand of food do your feed your dog?</label>
                <input disabled={isLoading}
                  type="text"
                  name="foodBrand"
                  value={formData.lifestyle?.foodBrand}
                  onChange={handleInputChange}
                  placeholder="Brand and type"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">How much and how often does your dog eat?</label>
                <input disabled={isLoading}
                  type="text"
                  name="feedingSchedule"
                  value={formData.lifestyle?.feedingSchedule}
                  onChange={handleInputChange}
                  placeholder="Amount and frequency"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Is food left out during the day for your dog to eat?</label>
                <input disabled={isLoading}
                  type="text"
                  name="foodLeftOut"
                  value={formData.lifestyle?.foodLeftOut}
                  onChange={handleInputChange}
                  placeholder="Yes/No"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Dog&apos;s allergies:</label>
                <input disabled={isLoading}
                  type="text"
                  name="allergies"
                  value={formData.lifestyle?.allergies}
                  onChange={handleInputChange}
                  placeholder="List any known allergies"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">What kind of toys does your dog have daily access to?</label>
                <input disabled={isLoading}
                  type="text"
                  name="toyTypes"
                  value={formData.lifestyle?.toyTypes}
                  onChange={handleInputChange}
                  placeholder="Types of toys"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">How long does your dog play with toys?</label>
                <input disabled={isLoading}
                  type="text"
                  name="toyPlayTime"
                  value={formData.lifestyle?.toyPlayTime}
                  onChange={handleInputChange}
                  placeholder="Duration"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Where are the toys kept when not in use?</label>
                <input disabled={isLoading}
                  type="text"
                  name="toyStorage"
                  value={formData.lifestyle?.toyStorage}
                  onChange={handleInputChange}
                  placeholder="Storage location"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">How often does your dog go on a walk?</label>
                <input disabled={isLoading}
                  type="text"
                  name="walkFrequency"
                  value={formData.lifestyle?.walkFrequency}
                  onChange={handleInputChange}
                  placeholder="Frequency"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Who walks your dog?</label>
                <input disabled={isLoading}
                  type="text"
                  name="walkPerson"
                  value={formData.lifestyle?.walkPerson}
                  onChange={handleInputChange}
                  placeholder="Person responsible"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">How long is the walk?</label>
                <input disabled={isLoading}
                  type="text"
                  name="walkDuration"
                  value={formData.lifestyle?.walkDuration}
                  onChange={handleInputChange}
                  placeholder="Duration"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Does your dog have any other exercise activities?</label>
                <input disabled={isLoading}
                  type="text"
                  name="otherExercise"
                  value={formData.lifestyle?.otherExercise}
                  onChange={handleInputChange}
                  placeholder="Other activities"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-black text-sm font-medium mb-1">
                  What does your dog wear on a walk? (Harness, Buckle Collar, No-Pull Harness, Choke Chain, Prong/Choke Collar, HeadHalter)
                </label>
                <input disabled={isLoading}
                  type="text"
                  name="walkEquipment"
                  value={formData.lifestyle?.walkEquipment}
                  onChange={handleInputChange}
                  placeholder="Equipment used"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Do you ever walk your dog off leash?</label>
                <div className="flex space-x-4 mt-2">
                  <label className="inline-flex items-center">
                    <input disabled={isLoading}
                      type="radio"
                      name="offLeash"
                      value="Y"
                      checked={formData.lifestyle?.offLeash === "Y"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-black">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input disabled={isLoading}
                      type="radio"
                      name="offLeash"
                      value="N"
                      checked={formData.lifestyle?.offLeash === "N"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-black">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Do you take your dog to the Forest?</label>
                <input disabled={isLoading}
                  type="text"
                  name="forestVisits"
                  value={formData.lifestyle?.forestVisits}
                  onChange={handleInputChange}
                  placeholder="Yes/No, frequency"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Does your dog pull on walks?</label>
                <div className="flex space-x-4 mt-2">
                  <label className="inline-flex items-center">
                    <input disabled={isLoading}
                      type="radio"
                      name="pulling"
                      value="Y"
                      checked={formData.lifestyle?.pulling === "Y"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-black">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input disabled={isLoading}
                      type="radio"
                      name="pulling"
                      value="N"
                      checked={formData.lifestyle?.pulling === "N"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-black">No</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-black text-sm font-medium mb-1">
                  If your dog pulls, what have you tried to change his behavior?
                </label>
                <textarea disabled={isLoading}
                  name="pullingPrevention"
                  value={formData.lifestyle?.pullingPrevention}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Describe methods tried"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Page 3: History */}
        {currentPage === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-sky-700 border-b pb-2">About Your Dog&apos;s History</h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  Describe any previous training you pup had had and the organization or trainers name.
                </label>
                <textarea disabled={isLoading}
                  name="previousTraining"
                  value={formData.history?.previousTraining}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe previous training experience and trainer/organization"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  Has your dog ever growled at a person or dog?
                </label>
                <div className="flex space-x-4 mt-2">
                  <label className="inline-flex items-center">
                    <input disabled={isLoading}
                      type="radio"
                      name="growled"
                      value="Y"
                      checked={formData.history?.growled === "Y"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-black">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input disabled={isLoading}
                      type="radio"
                      name="growled"
                      value="N"
                      checked={formData.history?.growled === "N"}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-sky-600"
                    />
                    <span className="ml-2 text-black">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  If yes, please describe what happened:
                </label>
                <textarea disabled={isLoading}
                  name="growlDetails"
                  value={formData.history?.growlDetails}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe the growling incident(s)"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  Has your dog ever nipped/bitten a person or another animal before?
                </label>
                <input disabled={isLoading}
                  type="text"
                  name="bitten"
                  value={formData.history?.bitten}
                  onChange={handleInputChange}
                  placeholder="Yes/No"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  If yes, please describe what happened:
                </label>
                <textarea disabled={isLoading}
                  name="biteDetails"
                  value={formData.history?.biteDetails}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe the biting incident(s)"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  If your dog has nipped/bitten a person or animal, was there a tear, scratch, bruise, bleeding, or puncture? (List all that apply.)
                </label>
                <textarea disabled={isLoading}
                  name="biteInjury"
                  value={formData.history?.biteInjury}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Describe any injuries caused"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  Is your dog fearful or nervous about certain people/dogs/situations?
                </label>
                <input disabled={isLoading}
                  type="text"
                  name="fearful"
                  value={formData.history?.fearful}
                  onChange={handleInputChange}
                  placeholder="Yes/No"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  If yes, please describe:
                </label>
                <textarea disabled={isLoading}
                  name="fearDetails"
                  value={formData.history?.fearDetails}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe fearful behaviors and triggers"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  How does your dog respond to new people in your home?
                </label>
                <textarea disabled={isLoading}
                  name="newPeopleResponse"
                  value={formData.history?.newPeopleResponse}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Describe how your dog reacts to visitors"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  How does your dog respond to grooming or bathing?
                </label>
                <textarea disabled={isLoading}
                  name="groomingResponse"
                  value={formData.history?.groomingResponse}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Describe reaction to grooming/bathing"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  What is your reaction when your dog ignores you?
                </label>
                <textarea disabled={isLoading}
                  name="ignoreReaction"
                  value={formData.history?.ignoreReaction}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Describe your typical response"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  What trainers, boarding facilities, or pet services have you used for your dog in the past? (Name/City)
                </label>
                <textarea disabled={isLoading}
                  name="previousServices"
                  value={formData.history?.previousServices}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="List previous services used"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  Please list any of the following tools that you currently use or have previously used with your dog:
                  <span className="block text-xs text-gray-600 mt-1">
                    Martingale Collar, Prong Collar, Choke Chain, E-Collar, Bark Collar, Citronella Collar/Spray, Spray Water Bottle, Clicker, Extendible Leash, Waist Leash, Front-Attach Harness, No-Pull Harness, Regular Harness, Head Halti, Gentle Leader, or Others
                  </span>
                </label>
                <textarea disabled={isLoading}
                  name="toolsUsed"
                  value={formData.history?.toolsUsed}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="List tools you've used with your dog"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Page 4: Goals */}
        {currentPage === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-sky-700 border-b pb-2">About Your Dog&apos;s Training Goals</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-sky-700 mb-3">5 Things You Like About Your Dog</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((num, index) => (
                    <div key={`like-${index}`} className="flex items-center">
                      <span className="mr-2 font-medium">{num}.</span>
                      <input disabled={isLoading}
                        type="text"
                        value={formData.likesAboutDog?.[index]}
                        onChange={(e) => handleArrayItemChange('likesAboutDog', index, e.target.value)}
                        placeholder={`Like #${num}`}
                        className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-sky-700 mb-3">5 Things You Wish You Could Change About Your Dog</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((num, index) => (
                    <div key={`dislike-${index}`} className="flex items-center">
                      <span className="mr-2 font-medium">{num}.</span>
                      <input disabled={isLoading}
                        type="text"
                        value={formData.dislikesAboutDog?.[index]}
                        onChange={(e) => handleArrayItemChange('dislikesAboutDog', index, e.target.value)}
                        placeholder={`Thing to change #${num}`}
                        className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  What made you reach out to us for training assistance?
                </label>
                <textarea disabled={isLoading}
                  name="whyTraining"
                  value={formData.whyTraining}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe your reasons for seeking training"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  What would you like to accomplish through training?
                </label>
                <textarea disabled={isLoading}
                  name="trainingGoals"
                  value={formData.goals?.trainingGoals}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe your training goals"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">
                  How would your ideal dog behave like?
                </label>
                <textarea disabled={isLoading}
                  name="idealDogBehavior"
                  value={formData.goals?.idealDogBehavior}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe how you would like your dog to behave"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Page 5: Behavior Checklist */}
        {currentPage === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-sky-700 border-b pb-2">Behavior Checklist</h2>

            <div>
              <p className="mb-4 text-black">
                Does your dog exhibit any of the following (check any or all that apply):
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Jumps on people",
                  "Doesn't listen",
                  "Mouthing/nipping",
                  "Steals food/trash/objects",
                  "Excessive vocalization",
                  "Chews items",
                  "Play Biting",
                  "Digs in Yard",
                  "Urinates when excited",
                  "Darts/escapes/ doors/gates",
                  "Anxious when alone",
                  "Threatens/bites family members or strangers",
                  "Threatens/growls at animals",
                  "Reactive/aggressive on leash"
                ].map((behavior, index) => (
                  <div key={index} className="flex items-start">
                    <input disabled={isLoading}
                      type="checkbox"
                      id={`behavior-${index}`}
                      name="behaviorChecklist"
                      value={behavior}
                      checked={formData.behaviorChecklist?.includes(behavior)}
                      onChange={handleCheckboxChange}
                      className="h-5 w-5 mt-0.5 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`behavior-${index}`} className="ml-2 text-black">
                      {behavior}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-black text-sm font-medium mb-1">
                  Issue with certain genders or types of people, items of clothing, tools, uniforms. Please describe:
                </label>
                <textarea disabled={isLoading}
                  name="behaviorDetails"
                  value={formData.behaviorDetails}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Describe specific issues with certain people or items"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>

              <div className="mt-4">
                <label className="block text-black text-sm font-medium mb-1">
                  Shows undesirable behavior. Please describe below:
                </label>
                <textarea disabled={isLoading}
                  name="undesirableBehavior"
                  value={formData.undesirableBehavior}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Describe any other undesirable behaviors"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>

              <div className="mt-4">
                <label className="block text-black text-sm font-medium mb-1">
                  Fearful. Please describe:
                </label>
                <textarea disabled={isLoading}
                  name="fearDescription"
                  value={formData.fearDescription}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Describe any fearful behaviors"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                ></textarea>
              </div>

              <div className="mt-8 text-black">
                <p>Thank you for taking the time to fill out our registration form. These details will help me better serve you and your dog. I look forward to working with you!</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {currentPage > 1 && (
            <button
              type="button"
              onClick={prevPage}
              className="px-6 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
            >
              Previous
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 ${currentPage === totalPages
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-sky-600 hover:bg-sky-700'
              } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : currentPage === totalPages ? (
              'Submit'
            ) : (
              'Next'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 