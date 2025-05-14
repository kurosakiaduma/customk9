"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Define interfaces for our data
interface Service {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  image: string;
}

interface Dog {
  id: number;
  name: string;
  breed: string;
  age: number;
  image: string;
}

interface BookingData {
  selectedService: Service | null;
  selectedDate: string;
  selectedTime: string;
  selectedDog: Dog | null;
  agreedToTerms: boolean;
  paymentMethod: string;
}

// Mock data for available services
const AVAILABLE_SERVICES: Service[] = [
  {
    id: 1,
    name: 'Basic Obedience Training',
    description: 'One-on-one session focused on basic commands and behavior',
    duration: '60 minutes',
    price: 4500,
    image: '/images/services/obedience.jpg'
  },
  {
    id: 2,
    name: 'Puppy Group Class',
    description: 'Socialization and basic training for puppies under 6 months',
    duration: '90 minutes',
    price: 3000,
    image: '/images/services/puppy-class.jpg'
  },
  {
    id: 3,
    name: 'Behavior Consultation',
    description: 'Assessment and plan for addressing specific behavior issues',
    duration: '120 minutes',
    price: 6000,
    image: '/images/services/behavior.jpg'
  },
  {
    id: 4,
    name: 'Advanced Training Package',
    description: 'Series of 5 sessions for advanced commands and off-leash work',
    duration: '60 minutes per session',
    price: 18000,
    image: '/images/services/advanced.jpg'
  },
];

// Available time slots (these would normally come from the server based on date)
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

export default function BookAppointmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState<BookingData>({
    selectedService: null,
    selectedDate: '',
    selectedTime: '',
    selectedDog: null,
    agreedToTerms: false,
    paymentMethod: ''
  });
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  
  // Load dogs from localStorage on initial load
  useEffect(() => {
    try {
      const storedDogs = localStorage.getItem('dogs');
      if (storedDogs) {
        setDogs(JSON.parse(storedDogs));
      } else {
        // Sample dog data if none in localStorage
        setDogs([
          {
            id: 1,
            name: 'Max',
            breed: 'German Shepherd',
            age: 3,
            image: '/images/dogs/german-shepherd.jpg'
          },
          {
            id: 2,
            name: 'Bella',
            breed: 'Labrador Retriever',
            age: 2,
            image: '/images/dogs/labrador.jpg'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading dogs from localStorage:', error);
      // Fallback to empty array
      setDogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Move to next step if data for current step is valid
  const goToNextStep = () => {
    if (isStepComplete(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Go back to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Check if current step is complete
  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: // Select service
        return bookingData.selectedService !== null;
      case 2: // Select date and time
        return bookingData.selectedDate !== '' && bookingData.selectedTime !== '';
      case 3: // Select dog
        return bookingData.selectedDog !== null;
      case 4: // Terms and conditions
        return bookingData.agreedToTerms;
      case 5: // Payment
        return bookingData.paymentMethod !== '';
      default:
        return false;
    }
  };
  
  // Handle service selection
  const selectService = (service: Service) => {
    setBookingData({ ...bookingData, selectedService: service });
  };
  
  // Handle date selection
  const selectDate = (date: string) => {
    setBookingData({ ...bookingData, selectedDate: date });
  };
  
  // Handle time selection
  const selectTime = (time: string) => {
    setBookingData({ ...bookingData, selectedTime: time });
  };
  
  // Handle dog selection
  const selectDog = (dog: Dog) => {
    setBookingData({ ...bookingData, selectedDog: dog });
  };
  
  // Handle terms agreement
  const toggleTermsAgreement = () => {
    setBookingData({ ...bookingData, agreedToTerms: !bookingData.agreedToTerms });
  };
  
  // Handle payment method selection
  const selectPaymentMethod = (method: string) => {
    setBookingData({ ...bookingData, paymentMethod: method });
  };
  
  // Complete booking process
  const completeBooking = () => {
    // Generate a random appointment ID
    const appointmentId = Math.floor(Math.random() * 10000);
    
    // Create new appointment object
    const newAppointment = {
      id: appointmentId,
      title: bookingData.selectedService?.name,
      date: bookingData.selectedDate,
      time: bookingData.selectedTime,
      duration: bookingData.selectedService?.duration,
      location: 'CustomK9 Training Center',
      trainer: 'John Doe',
      dogName: bookingData.selectedDog?.name,
      dogImage: bookingData.selectedDog?.image,
      status: 'confirmed',
      totalPrice: bookingData.selectedService?.price,
      paymentMethod: bookingData.paymentMethod,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    try {
      const existingAppointments = localStorage.getItem('appointments');
      let appointments = [];
      
      if (existingAppointments) {
        appointments = JSON.parse(existingAppointments);
      }
      
      appointments.push(newAppointment);
      localStorage.setItem('appointments', JSON.stringify(appointments));
      
      // Show completion page
      setIsBookingComplete(true);
      
      // Redirect to calendar page after 3 seconds
      setTimeout(() => {
        router.push('/client-area/dashboard/calendar');
      }, 3000);
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert('There was an error saving your appointment. Please try again.');
    }
  };
  
  // Get available dates (next 14 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (closed)
      if (date.getDay() !== 0) {
        dates.push({
          dateString: date.toISOString().split('T')[0],
          formattedDate: date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })
        });
      }
    }
    
    return dates;
  };
  
  // Render booking completion screen
  if (isBookingComplete) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Your appointment has been successfully scheduled. You will receive a confirmation email shortly.
          </p>
          <div className="bg-white p-8 rounded-xl shadow-md mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Appointment Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium">{bookingData.selectedService?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{bookingData.selectedDate} at {bookingData.selectedTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{bookingData.selectedService?.duration}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">CustomK9 Training Center</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dog</p>
                <p className="font-medium">{bookingData.selectedDog?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Price</p>
                <p className="font-medium">KSh {bookingData.selectedService?.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <Link 
            href="/client-area/dashboard/calendar" 
            className="px-6 py-3 bg-sky-600 text-white rounded-md font-medium hover:bg-sky-700 transition-colors"
          >
            View All Appointments
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Book New Appointment</h1>
        <p className="text-gray-600">Complete the steps below to schedule your appointment</p>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-10">
        <ol className="flex items-center w-full">
          {[
            'Select Service',
            'Choose Date & Time',
            'Select Dog',
            'Terms & Conditions',
            'Payment',
            'Confirmation'
          ].map((step, index) => (
            <li key={index} className={`flex items-center ${index+1 < currentStep ? 'text-sky-600' : index+1 === currentStep ? 'text-sky-800' : 'text-gray-400'}`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                index+1 < currentStep ? 'bg-sky-100 text-sky-600 border-2 border-sky-600' :
                index+1 === currentStep ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {index+1 < currentStep ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  index+1
                )}
              </span>
              <span className={`hidden sm:inline-block text-sm ${
                index+1 === currentStep ? 'font-medium' : 'font-normal'
              }`}>
                {step}
              </span>
              
              {index < 5 && (
                <span className="mx-2 sm:mx-4">
                  <ChevronRightIcon className="w-4 h-4" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
      
      {/* Step 1: Select Service */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Select a Service</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {AVAILABLE_SERVICES.map((service) => (
              <div 
                key={service.id}
                onClick={() => selectService(service)}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  bookingData.selectedService?.id === service.id 
                    ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500 ring-opacity-50' 
                    : 'border-gray-200 hover:border-sky-200'
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0 relative h-16 w-16 rounded-md overflow-hidden mr-4">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="64px"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = "https://placedog.net/64/64"; // Fallback image
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.description}</p>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm text-gray-700">{service.duration}</span>
                      <span className="font-medium text-sky-700">KSh {service.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={goToNextStep}
              disabled={!isStepComplete(1)}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                isStepComplete(1) ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Next: Choose Date & Time
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Select Date and Time */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Choose Date & Time</h2>
          
          <div className="mb-8">
            <h3 className="font-medium text-gray-800 mb-3">Available Dates</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {getAvailableDates().map((date) => (
                <button
                  key={date.dateString}
                  onClick={() => selectDate(date.dateString)}
                  className={`p-3 rounded-md text-center transition-colors ${
                    bookingData.selectedDate === date.dateString
                      ? 'bg-sky-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {date.formattedDate}
                </button>
              ))}
            </div>
          </div>
          
          {bookingData.selectedDate && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Available Times</h3>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => selectTime(time)}
                    className={`p-2 rounded-md text-center text-sm transition-colors ${
                      bookingData.selectedTime === time
                        ? 'bg-sky-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-between">
            <button
              onClick={goToPreviousStep}
              className="px-6 py-2 rounded-md text-gray-600 font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={goToNextStep}
              disabled={!isStepComplete(2)}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                isStepComplete(2) ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Next: Select Dog
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Select Dog */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Select Your Dog</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading your dogs...</p>
            </div>
          ) : dogs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {dogs.map((dog) => (
                <div 
                  key={dog.id}
                  onClick={() => selectDog(dog)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    bookingData.selectedDog?.id === dog.id 
                      ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500 ring-opacity-50' 
                      : 'border-gray-200 hover:border-sky-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 relative h-16 w-16 rounded-full overflow-hidden mr-4">
                      <Image
                        src={dog.image}
                        alt={dog.name}
                        fill
                        sizes="64px"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = "https://placedog.net/64/64"; // Fallback image
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{dog.name}</h3>
                      <p className="text-sm text-gray-500">{dog.breed}, {dog.age} years old</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">You don't have any dogs registered yet.</p>
              <Link
                href="/client-area/dashboard/dogs/add"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Register a Dog First
              </Link>
            </div>
          )}
          
          <div className="mt-8 flex justify-between">
            <button
              onClick={goToPreviousStep}
              className="px-6 py-2 rounded-md text-gray-600 font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={goToNextStep}
              disabled={!isStepComplete(3)}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                isStepComplete(3) ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Next: Terms & Conditions
            </button>
          </div>
        </div>
      )}
      
      {/* Step 4: Terms and Conditions */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Terms & Conditions</h2>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6 h-64 overflow-y-auto">
            <h3 className="font-medium mb-2">CustomK9 Service Agreement</h3>
            <p className="text-sm text-gray-600 mb-3">
              Please read and agree to the following terms before proceeding with your booking:
            </p>
            <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-2">
              <li>All dogs must be up-to-date on vaccinations and in good health to participate in training sessions.</li>
              <li>Clients are responsible for their dog's behavior during sessions. CustomK9 reserves the right to refuse service to dogs exhibiting dangerous behavior.</li>
              <li>Cancellations must be made at least 24 hours in advance to receive a full refund. Late cancellations may be subject to a cancellation fee.</li>
              <li>Appointments may be rescheduled subject to availability.</li>
              <li>Payment must be made at the time of booking to confirm your appointment.</li>
              <li>CustomK9 uses positive reinforcement methods. Clients are expected to continue these methods at home for best results.</li>
              <li>CustomK9 is not responsible for accidents or injuries that may occur during training sessions.</li>
              <li>Results may vary based on consistent practice and the individual dog's temperament.</li>
            </ol>
          </div>
          
          <div className="mb-6">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={bookingData.agreedToTerms}
                onChange={toggleTermsAgreement}
                className="mt-1 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">
                I have read and agree to the terms and conditions outlined above. I understand that my booking is subject to these terms.
              </span>
            </label>
          </div>
          
          <div className="mt-8 flex justify-between">
            <button
              onClick={goToPreviousStep}
              className="px-6 py-2 rounded-md text-gray-600 font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={goToNextStep}
              disabled={!isStepComplete(4)}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                isStepComplete(4) ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Next: Payment
            </button>
          </div>
        </div>
      )}
      
      {/* Step 5: Payment */}
      {currentStep === 5 && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Payment Details</h2>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="font-medium">{bookingData.selectedService?.name}</p>
                  <p className="text-sm text-gray-500">{bookingData.selectedService?.duration}</p>
                </div>
                <p className="font-medium">KSh {bookingData.selectedService?.price.toLocaleString()}</p>
              </div>
              
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>KSh {bookingData.selectedService?.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Select Payment Method</h3>
            <div className="space-y-3">
              {['M-PESA', 'Credit Card', 'PayPal'].map((method) => (
                <label key={method} className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={bookingData.paymentMethod === method}
                    onChange={() => selectPaymentMethod(method)}
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300"
                  />
                  <span className="ml-2">{method}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex justify-between">
            <button
              onClick={goToPreviousStep}
              className="px-6 py-2 rounded-md text-gray-600 font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={completeBooking}
              disabled={!isStepComplete(5)}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                isStepComplete(5) ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Complete Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 