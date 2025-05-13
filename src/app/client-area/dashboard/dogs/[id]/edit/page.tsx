'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';

interface EditDogParams {
  params: {
    id: string;
  };
}

interface DogFormData {
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  image: string;
  microchipped: boolean;
  neutered: boolean;
  allergies: string;
  medicalConditions: string;
  medications: string;
  notes: string;
}

const EditDogPage = ({ params }: EditDogParams) => {
  const router = useRouter();
  const [dogData, setDogData] = useState<DogFormData>({
    name: '',
    breed: '',
    age: '',
    weight: '',
    gender: '',
    image: '',
    microchipped: false,
    neutered: false,
    allergies: '',
    medicalConditions: '',
    medications: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [allDogs, setAllDogs] = useState<any[]>([]);

  useEffect(() => {
    // Fetch dog data from localStorage
    try {
      const storedDogs = localStorage.getItem('dogs');
      if (storedDogs) {
        const parsedDogs = JSON.parse(storedDogs);
        setAllDogs(parsedDogs);
        
        const foundDog = parsedDogs.find((d: any) => d.id === params.id);
        if (foundDog) {
          // Initialize form with found dog data
          setDogData({
            name: foundDog.name || '',
            breed: foundDog.breed || '',
            age: foundDog.age || '',
            weight: foundDog.weight || '',
            gender: foundDog.gender || '',
            image: foundDog.image || '',
            microchipped: foundDog.microchipped || false,
            neutered: foundDog.neutered || false,
            allergies: foundDog.allergies || '',
            medicalConditions: foundDog.medicalConditions || '',
            medications: foundDog.medications || '',
            notes: foundDog.notes || '',
          });
          setLoading(false);
          return;
        }
      }
      // If dog not found, use notFound
      notFound();
    } catch (error) {
      console.error('Error loading dog data:', error);
      setError('Failed to load dog data. Please try again.');
      setLoading(false);
    }
  }, [params.id]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!dogData.name.trim()) {
      errors.name = 'Dog name is required';
    }
    
    if (!dogData.breed.trim()) {
      errors.breed = 'Breed is required';
    }
    
    if (!dogData.age.trim()) {
      errors.age = 'Age is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setDogData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setDogData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      // Find and update dog in allDogs array
      const updatedDogs = allDogs.map(dog => {
        if (dog.id === params.id) {
          return {
            ...dog,
            ...dogData,
          };
        }
        return dog;
      });
      
      // Save to localStorage
      localStorage.setItem('dogs', JSON.stringify(updatedDogs));
      
      setSuccess('Dog profile updated successfully!');
      
      // Navigate back to dog profile after a short delay
      setTimeout(() => {
        router.push(`/client-area/dashboard/dogs/${params.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error saving dog data:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const dogImageOptions = [
    '/images/dog-placeholder.jpg',
    'https://placedog.net/500/400?r=1',
    'https://placedog.net/500/400?r=2',
    'https://placedog.net/500/400?r=3',
    'https://placedog.net/500/400?r=4',
    'https://placedog.net/500/400?r=5',
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-sky-600 hover:text-sky-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dog Profile
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Edit Dog Profile</h1>
          <p className="text-gray-600">Update your dog's information and profile details</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Error display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          {/* Success display */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p className="font-medium">Success</p>
              <p>{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-4 text-gray-800">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Dog Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={dogData.name}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
                    Breed*
                  </label>
                  <input
                    type="text"
                    id="breed"
                    name="breed"
                    value={dogData.breed}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${formErrors.breed ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  />
                  {formErrors.breed && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.breed}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                      Age*
                    </label>
                    <input
                      type="text"
                      id="age"
                      name="age"
                      value={dogData.age}
                      onChange={handleInputChange}
                      className={`w-full p-2 border ${formErrors.age ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
                    />
                    {formErrors.age && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.age}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (lbs)
                    </label>
                    <input
                      type="text"
                      id="weight"
                      name="weight"
                      value={dogData.weight}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={dogData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="microchipped"
                      name="microchipped"
                      checked={dogData.microchipped}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label htmlFor="microchipped" className="ml-2 block text-sm text-gray-700">
                      Microchipped
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="neutered"
                      name="neutered"
                      checked={dogData.neutered}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label htmlFor="neutered" className="ml-2 block text-sm text-gray-700">
                      Spayed/Neutered
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4 text-gray-800">Profile Image</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Image
                </label>
                <div className="relative h-48 w-full mb-4 bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={dogData.image || "/images/dog-placeholder.jpg"}
                    alt={dogData.name}
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
                  Select Profile Image
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {dogImageOptions.map((image, index) => (
                    <div 
                      key={index}
                      className={`relative cursor-pointer rounded-md overflow-hidden h-20 border-2 ${dogData.image === image ? 'border-sky-500' : 'border-transparent'}`}
                      onClick={() => setDogData(prev => ({ ...prev, image }))}
                    >
                      <Image
                        src={image}
                        alt={`Dog option ${index + 1}`}
                        fill
                        sizes="100%"
                        style={{ objectFit: "cover" }}
                      />
                      {dogData.image === image && (
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
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4 text-gray-800">Health Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <textarea
                  id="allergies"
                  name="allergies"
                  rows={3}
                  value={dogData.allergies}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="List any known allergies"
                />
              </div>
              
              <div>
                <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Conditions
                </label>
                <textarea
                  id="medicalConditions"
                  name="medicalConditions"
                  rows={3}
                  value={dogData.medicalConditions}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="List any medical conditions"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-1">
                Current Medications
              </label>
              <input
                type="text"
                id="medications"
                name="medications"
                value={dogData.medications}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="List any current medications"
              />
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4 text-gray-800">Additional Notes</h2>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes about your dog
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={dogData.notes}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Any additional information you'd like to share about your dog"
              />
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <Link
              href={`/client-area/dashboard/dogs/${params.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDogPage; 