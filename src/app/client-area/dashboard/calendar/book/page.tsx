"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CalendarIcon, UserGroupIcon, UserIcon } from '@heroicons/react/24/solid';

// Define interfaces for our data
interface Service {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  image: string;
}

interface PublicEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  price: number;
  trainer: string;
  capacity: number;
  enrolled: number;
  image: string;
  tags: string[];
}

interface Dog {
  id: number;
  name: string;
  breed: string;
  age: number;
  image: string;
}

interface BookingData {
  bookingType: 'personal' | 'public' | null;
  selectedService: Service | null;
  selectedEvent: PublicEvent | null;
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

// Mock data for public events
const PUBLIC_EVENTS: PublicEvent[] = [
  {
    id: 101,
    title: 'Weekend Group Obedience Class',
    description: 'Join our popular group class for basic obedience training with professional trainers. Great for socialization and learning in a structured environment.',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().split('T')[0],
    time: '10:00 AM',
    duration: '2 hours',
    location: 'CustomK9 Training Center - Main Hall',
    price: 2500,
    trainer: 'Sarah Johnson',
    capacity: 8,
    enrolled: 5,
    image: '/images/services/group-class.jpg',
    tags: ['Beginner-Friendly', 'All Ages']
  },
  {
    id: 102,
    title: 'Puppy Socialization Event',
    description: 'A special event designed for puppies under 6 months to develop social skills and confidence in a safe, controlled environment.',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 17).toISOString().split('T')[0],
    time: '4:00 PM',
    duration: '90 minutes',
    location: 'CustomK9 Training Center - Puppy Area',
    price: 1800,
    trainer: 'Michael Clark',
    capacity: 10,
    enrolled: 4,
    image: '/images/services/puppy-social.jpg',
    tags: ['Puppies Only', 'Under 6 Months']
  },
  {
    id: 103,
    title: 'Advanced Skills Workshop',
    description: 'For dogs who have mastered the basics and are ready for more challenging commands, including off-leash work and distance commands.',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 20).toISOString().split('T')[0],
    time: '9:00 AM',
    duration: '3 hours',
    location: 'Central Park Training Ground',
    price: 3500,
    trainer: 'James Wilson',
    capacity: 6,
    enrolled: 3,
    image: '/images/services/advanced-workshop.jpg',
    tags: ['Advanced', 'Prior Training Required']
  },
  {
    id: 104,
    title: 'Agility Introduction',
    description: 'Learn the basics of dog agility training with our specialized equipment and expert guidance. Great for energetic dogs.',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 22).toISOString().split('T')[0],
    time: '2:00 PM',
    duration: '2 hours',
    location: 'CustomK9 Agility Course',
    price: 2800,
    trainer: 'Emily Rodriguez',
    capacity: 8,
    enrolled: 2,
    image: '/images/services/agility.jpg',
    tags: ['Active Dogs', 'All Skill Levels']
  },
  {
    id: 105,
    title: 'Reactive Dog Management',
    description: 'Specialized workshop for owners of reactive dogs. Learn techniques to manage reactivity and build confidence.',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 24).toISOString().split('T')[0],
    time: '5:00 PM',
    duration: '2 hours',
    location: 'CustomK9 Training Center - Private Area',
    price: 4000,
    trainer: 'David Thompson',
    capacity: 5,
    enrolled: 3,
    image: '/images/services/reactive-dogs.jpg',
    tags: ['Behavioral Issues', 'Small Group']
  },
  {
    id: 106,
    title: 'Weekend Group Class',
    description: 'Group training session focusing on basic commands and socialization.',
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5).toISOString().split('T')[0],
    time: '11:00 AM',
    duration: '2 hours',
    location: 'CustomK9 Training Center - Main Hall',
    price: 2500,
    trainer: 'Sarah Johnson',
    capacity: 8,
    enrolled: 2,
    image: '/images/services/group-class.jpg',
    tags: ['All Levels', 'Group Training']
  },
  {
    id: 107,
    title: 'Leash Reactivity Workshop',
    description: 'Special workshop for dogs who react to other dogs or people while on leash.',
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 12).toISOString().split('T')[0],
    time: '3:00 PM',
    duration: '2.5 hours',
    location: 'CustomK9 Training Center - Private Area',
    price: 3800,
    trainer: 'David Thompson',
    capacity: 6,
    enrolled: 1,
    image: '/images/services/reactive-dogs.jpg',
    tags: ['Behavioral Issues', 'Specialized Training']
  }
];

// Available time slots (these would normally come from the server based on date)
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

// Calendar Data
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthsOfYear = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export default function BookAppointmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingData, setBookingData] = useState<BookingData>({
    bookingType: null,
    selectedService: null,
    selectedEvent: null,
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
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Check if current step is complete
  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: // Select booking type 
        return bookingData.bookingType !== null;
      case 2: // Select service or event
        return bookingData.bookingType === 'personal' 
          ? bookingData.selectedService !== null 
          : bookingData.selectedEvent !== null;
      case 3: // Select date and time (for personal) or dog (for public)
        return bookingData.bookingType === 'personal'
          ? bookingData.selectedDate !== '' && bookingData.selectedTime !== ''
          : bookingData.selectedDog !== null;
      case 4: // Select dog (for personal) or terms (for public)
        return bookingData.bookingType === 'personal'
          ? bookingData.selectedDog !== null
          : bookingData.agreedToTerms;
      case 5: // Terms (for personal) or payment (for public)
        return bookingData.bookingType === 'personal'
          ? bookingData.agreedToTerms
          : bookingData.paymentMethod !== '';
      case 6: // Payment (for personal only)
        return bookingData.bookingType === 'public' || bookingData.paymentMethod !== '';
      default:
        return false;
    }
  };
  
  // Get step label based on booking type
  const getStepLabel = (index: number): string => {
    if (bookingData.bookingType === 'personal') {
      const personalSteps = [
        'Select Booking Type',
        'Select Service',
        'Choose Date & Time',
        'Select Dog',
        'Terms & Conditions',
        'Payment',
        'Confirmation'
      ];
      return personalSteps[index];
    } else {
      const publicSteps = [
        'Select Booking Type',
        'Select Event',
        'Select Dog',
        'Terms & Conditions',
        'Payment',
        'Confirmation'
      ];
      return publicSteps[index];
    }
  };
  
  // Select booking type
  const selectBookingType = (type: 'personal' | 'public') => {
    setBookingData({ 
      ...bookingData, 
      bookingType: type,
      // Reset other selections when changing booking type
      selectedService: null,
      selectedEvent: null,
      selectedDate: '',
      selectedTime: ''
    });
  };
  
  // Handle service selection
  const selectService = (service: Service) => {
    setBookingData({ ...bookingData, selectedService: service });
  };
  
  // Handle event selection
  const selectEvent = (event: PublicEvent) => {
    console.log(`Selecting event: ${event.title}`);
    setBookingData({ 
      ...bookingData, 
      selectedEvent: event,
      // Set date and time automatically from the event
      selectedDate: event.date,
      selectedTime: event.time
    });
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
    const newAppointment = bookingData.bookingType === 'personal' 
      ? {
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
        }
      : {
          id: appointmentId,
          title: bookingData.selectedEvent?.title,
          date: bookingData.selectedEvent?.date,
          time: bookingData.selectedEvent?.time,
          duration: bookingData.selectedEvent?.duration,
          location: bookingData.selectedEvent?.location,
          trainer: bookingData.selectedEvent?.trainer,
          dogName: bookingData.selectedDog?.name,
          dogImage: bookingData.selectedDog?.image,
          status: 'confirmed',
          totalPrice: bookingData.selectedEvent?.price,
          paymentMethod: bookingData.paymentMethod,
          isGroupEvent: true,
          createdAt: new Date().toISOString()
        };
    
    // Save to localStorage
    try {
      // Get existing appointments or initialize empty array
      const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      // Add new appointment to array
      existingAppointments.push(newAppointment);
      
      // Save updated array back to localStorage
      localStorage.setItem('appointments', JSON.stringify(existingAppointments));
      
      // Update UI to show booking is complete
      setIsBookingComplete(true);
      setCurrentStep(bookingData.bookingType === 'personal' ? 7 : 6);
      
      // Scroll to top to show confirmation
      window.scrollTo(0, 0);
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
  
  // Generate calendar days
  const generateCalendarDays = (): (Date | null)[] => {
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for the days of the previous month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));
    }
    
    return days;
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
      
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="relative">
          <ol className="flex items-center w-full">
            {bookingData.bookingType === 'personal' ? (
              // Personal booking flow (7 steps including confirmation)
              <>
                <li className={`flex items-center ${currentStep > 1 ? 'text-sky-600' : 'text-gray-500'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 1 ? 'bg-sky-100 text-sky-800' : 
                    currentStep > 1 ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 1 ? <CheckCircleIcon className="w-4 h-4" /> : 1}
                  </span>
                  <span className="ml-2 text-sm">Booking Type</span>
                  <span className="mx-2 sm:mx-4"><ChevronRightIcon className="w-4 h-4" /></span>
                </li>
                <li className={`flex items-center ${currentStep > 2 ? 'text-sky-600' : 'text-gray-500'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 2 ? 'bg-sky-100 text-sky-800' : 
                    currentStep > 2 ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 2 ? <CheckCircleIcon className="w-4 h-4" /> : 2}
                  </span>
                  <span className="hidden sm:inline ml-2 text-sm">Service</span>
                  <span className="mx-2 sm:mx-4"><ChevronRightIcon className="w-4 h-4" /></span>
                </li>
                <li className={`flex items-center ${currentStep > 3 ? 'text-sky-600' : 'text-gray-500'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 3 ? 'bg-sky-100 text-sky-800' : 
                    currentStep > 3 ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 3 ? <CheckCircleIcon className="w-4 h-4" /> : 3}
                  </span>
                  <span className="hidden sm:inline ml-2 text-sm">Date & Time</span>
                  <span className="mx-2 sm:mx-4"><ChevronRightIcon className="w-4 h-4" /></span>
                </li>
                <li className={`flex items-center ${currentStep > 4 ? 'text-sky-600' : 'text-gray-500'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 4 ? 'bg-sky-100 text-sky-800' : 
                    currentStep > 4 ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 4 ? <CheckCircleIcon className="w-4 h-4" /> : 4}
                  </span>
                  <span className="hidden sm:inline ml-2 text-sm">Dog</span>
                  <span className="mx-2 sm:mx-4"><ChevronRightIcon className="w-4 h-4" /></span>
                </li>
                <li className={`flex items-center ${currentStep > 5 ? 'text-sky-600' : 'text-gray-500'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 5 ? 'bg-sky-100 text-sky-800' : 
                    currentStep > 5 ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 5 ? <CheckCircleIcon className="w-4 h-4" /> : 5}
                  </span>
                  <span className="hidden sm:inline ml-2 text-sm">Terms</span>
                  <span className="mx-2 sm:mx-4"><ChevronRightIcon className="w-4 h-4" /></span>
                </li>
                <li className={`flex items-center ${currentStep > 6 ? 'text-sky-600' : 'text-gray-500'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 6 ? 'bg-sky-100 text-sky-800' : 
                    currentStep > 6 ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 6 ? <CheckCircleIcon className="w-4 h-4" /> : 6}
                  </span>
                  <span className="hidden sm:inline ml-2 text-sm">Payment</span>
                </li>
              </>
            ) : (
              // Public event booking flow (6 steps including confirmation)
              <>
                <li className={`flex items-center ${currentStep > 1 ? 'text-sky-600' : 'text-gray-500'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 1 ? 'bg-sky-100 text-sky-800' : 
                    currentStep > 1 ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 1 ? <CheckCircleIcon className="w-4 h-4" /> : 1}
                  </span>
                  <span className="ml-2 text-sm">Booking Type</span>
                  <span className="mx-2 sm:mx-4"><ChevronRightIcon className="w-4 h-4" /></span>
                </li>
                <li className={`flex items-center ${currentStep > 2 ? 'text-sky-600' : 'text-gray-500'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 2 ? 'bg-sky-100 text-sky-800' : 
                    currentStep > 2 ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 2 ? <CheckCircleIcon className="w-4 h-4" /> : 2}
                  </span>
                  <span className="hidden sm:inline ml-2 text-sm">Event</span>
                  <span className="mx-2 sm:mx-4"><ChevronRightIcon className="w-4 h-4" /></span>
                </li>
                <li className={`flex items-center ${currentStep > 3 ? 'text-sky-600' : 'text-gray-500'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 3 ? 'bg-sky-100 text-sky-800' : 
                    currentStep > 3 ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 3 ? <CheckCircleIcon className="w-4 h-4" /> : 3}
                  </span>
                  <span className="hidden sm:inline ml-2 text-sm">Dog</span>
                  <span className="mx-2 sm:mx-4"><ChevronRightIcon className="w-4 h-4" /></span>
                </li>
                <li className={`flex items-center ${currentStep > 4 ? 'text-sky-600' : 'text-gray-500'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 4 ? 'bg-sky-100 text-sky-800' : 
                    currentStep > 4 ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 4 ? <CheckCircleIcon className="w-4 h-4" /> : 4}
                  </span>
                  <span className="hidden sm:inline ml-2 text-sm">Terms</span>
                  <span className="mx-2 sm:mx-4"><ChevronRightIcon className="w-4 h-4" /></span>
                </li>
                <li className={`flex items-center ${currentStep > 5 ? 'text-sky-600' : 'text-gray-500'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 5 ? 'bg-sky-100 text-sky-800' : 
                    currentStep > 5 ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 5 ? <CheckCircleIcon className="w-4 h-4" /> : 5}
                  </span>
                  <span className="hidden sm:inline ml-2 text-sm">Payment</span>
                </li>
              </>
            )}
          </ol>
        </div>
      </div>
      
      {/* Step 1: Select Booking Type */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Select a Booking Type</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => selectBookingType('personal')}
              className={`flex flex-col items-center p-6 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                bookingData.bookingType === 'personal' 
                  ? 'border-sky-500 bg-sky-50' 
                  : 'border-gray-200 hover:border-sky-300'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-4">
                <UserIcon className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Personal Training</h3>
              <p className="text-center text-gray-500 text-sm">
                Schedule a one-on-one session with our trainers tailored to your dog's needs.
              </p>
              <ul className="mt-4 text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span>Personalized attention</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span>Choose your own schedule</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span>Focus on specific training needs</span>
                </li>
              </ul>
            </div>
            
            <div 
              onClick={() => selectBookingType('public')}
              className={`flex flex-col items-center p-6 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                bookingData.bookingType === 'public' 
                  ? 'border-sky-500 bg-sky-50' 
                  : 'border-gray-200 hover:border-sky-300'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <UserGroupIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Public Event</h3>
              <p className="text-center text-gray-500 text-sm">
                Join one of our group classes or specialized training events with other dogs.
              </p>
              <ul className="mt-4 text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span>Socialization opportunities</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span>Cost-effective training</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span>Pre-scheduled events</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={goToNextStep}
              disabled={!isStepComplete(1)}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                isStepComplete(1) ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Next: {bookingData.bookingType === 'personal' ? 'Select Service' : 'Select Event'}
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Select Service */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          {bookingData.bookingType === 'personal' ? (
            <>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Select a Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_SERVICES.map((service) => (
                  <div 
                    key={service.id}
                    onClick={() => selectService(service)}
                    className={`border p-4 rounded-lg cursor-pointer transition-all ${
                      bookingData.selectedService?.id === service.id 
                        ? 'border-sky-500 bg-sky-50 shadow-md' 
                        : 'border-gray-200 hover:border-sky-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="relative w-20 h-20 mr-4 rounded-md overflow-hidden">
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-gray-600 text-sm">{service.duration}</span>
                          <span className="font-medium">KSh {service.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Select a Public Event</h2>
              
              {/* Calendar View for Public Events */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setSelectedDate(newDate);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  
                  <h2 className="text-lg font-semibold">
                    {monthsOfYear[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                  </h2>
                  
                  <button
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setSelectedDate(newDate);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {/* Days of the week */}
                  {daysOfWeek.map(day => (
                    <div key={day} className="text-center font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar cells */}
                  {generateCalendarDays().map((day: Date | null, index: number) => {
                    const dateString = day ? day.toISOString().split('T')[0] : '';
                    const eventsOnDay = PUBLIC_EVENTS.filter(event => event.date === dateString);
                    const isToday = day && day.toDateString() === new Date().toDateString();
                    const hasEvents = eventsOnDay.length > 0;
                    
                    // Function to handle clicking on a day with events
                    const handleDayClick = () => {
                      if (hasEvents && eventsOnDay.length === 1) {
                        // If only one event on this day, select it automatically
                        selectEvent(eventsOnDay[0]);
                      } else if (hasEvents) {
                        // If multiple events, we could open a modal or expand them all
                        // For now, we'll just make the events more visible
                      }
                    };
                    
                    return (
                      <div 
                        key={index} 
                        className={`min-h-[80px] border rounded-md p-1 ${
                          !day ? 'bg-gray-50' : 
                          isToday ? 'bg-sky-50 border-sky-200' : 
                          hasEvents ? 'border-sky-200 hover:bg-sky-50 cursor-pointer' : 'hover:bg-gray-50'
                        }`}
                        onClick={hasEvents ? handleDayClick : undefined}
                      >
                        {day && (
                          <>
                            <div className="flex justify-between items-center mb-1">
                              <span className={`${hasEvents ? 'text-sky-600 font-medium' : ''} ${isToday ? 'font-bold text-sky-600' : ''}`}>
                                {day.getDate()}
                              </span>
                              {hasEvents && (
                                <span className="bg-sky-500 w-2 h-2 rounded-full"></span>
                              )}
                            </div>
                            
                            <div className="space-y-1">
                              {eventsOnDay.map(event => (
                                <div 
                                  key={event.id}
                                  className={`text-xs p-1 rounded ${
                                    bookingData.selectedEvent?.id === event.id
                                      ? 'bg-sky-600 text-white'
                                      : 'bg-sky-100 text-sky-800'
                                  } truncate cursor-pointer`}
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering the parent div's onClick
                                    selectEvent(event);
                                  }}
                                >
                                  {event.time} - {event.title}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Selected Event Details */}
              {bookingData.selectedEvent && (
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mt-4">
                  <div className="flex flex-col md:flex-row md:items-start">
                    <div className="relative w-full md:w-40 h-40 md:mr-4 mb-4 md:mb-0 rounded-md overflow-hidden">
                      <Image
                        src={bookingData.selectedEvent.image}
                        alt={bookingData.selectedEvent.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl mb-2">{bookingData.selectedEvent.title}</h3>
                      <p className="text-gray-700 mb-3">{bookingData.selectedEvent.description}</p>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div>
                          <span className="font-medium text-gray-600">Date:</span>
                          <p>{new Date(bookingData.selectedEvent.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Time:</span>
                          <p>{bookingData.selectedEvent.time}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Duration:</span>
                          <p>{bookingData.selectedEvent.duration}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Location:</span>
                          <p>{bookingData.selectedEvent.location}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Trainer:</span>
                          <p>{bookingData.selectedEvent.trainer}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Price:</span>
                          <p className="font-semibold">KSh {bookingData.selectedEvent.price.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {bookingData.selectedEvent.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs font-medium rounded-full bg-sky-100 text-sky-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-3 text-sm">
                        <span className="font-medium text-gray-600">Enrollment:</span>
                        <p>{bookingData.selectedEvent.enrolled} of {bookingData.selectedEvent.capacity} spots filled</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-sky-600 h-2 rounded-full" 
                            style={{ width: `${(bookingData.selectedEvent.enrolled / bookingData.selectedEvent.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="mt-8 flex justify-between">
            <button
              onClick={goToPrevStep}
              className="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
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
              Next: {bookingData.bookingType === 'personal' ? 'Choose Date & Time' : 'Select Dog'}
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Select Date and Time */}
      {currentStep === 3 && bookingData.bookingType === 'personal' && (
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
              onClick={goToPrevStep}
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
              Next: Select Dog
            </button>
          </div>
        </div>
      )}
      
      {/* Step 4: Select Dog */}
      {((currentStep === 4 && bookingData.bookingType === 'personal') || 
        (currentStep === 3 && bookingData.bookingType === 'public')) && (
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
              onClick={goToPrevStep}
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
              Next: Terms & Conditions
            </button>
          </div>
        </div>
      )}
      
      {/* Step 5: Terms and Conditions */}
      {((currentStep === 5 && bookingData.bookingType === 'personal') || 
        (currentStep === 4 && bookingData.bookingType === 'public')) && (
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
              onClick={goToPrevStep}
              className="px-6 py-2 rounded-md text-gray-600 font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={goToNextStep}
              disabled={!isStepComplete(bookingData.bookingType === 'personal' ? 5 : 4)}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                isStepComplete(bookingData.bookingType === 'personal' ? 5 : 4) ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Next: Payment
            </button>
          </div>
        </div>
      )}
      
      {/* Step 6: Payment */}
      {((currentStep === 6 && bookingData.bookingType === 'personal') || 
        (currentStep === 5 && bookingData.bookingType === 'public')) && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Payment Details</h2>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  {bookingData.bookingType === 'personal' ? (
                    <>
                      <p className="font-medium">{bookingData.selectedService?.name}</p>
                      <p className="text-sm text-gray-500">{bookingData.selectedService?.duration}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">{bookingData.selectedEvent?.title}</p>
                      <p className="text-sm text-gray-500">{bookingData.selectedEvent?.duration}</p>
                    </>
                  )}
                </div>
                <p className="font-medium">
                  KSh {(bookingData.bookingType === 'personal' 
                        ? bookingData.selectedService?.price 
                        : bookingData.selectedEvent?.price)?.toLocaleString()}
                </p>
              </div>
              
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>KSh {(bookingData.bookingType === 'personal' 
                      ? bookingData.selectedService?.price 
                      : bookingData.selectedEvent?.price)?.toLocaleString()}</p>
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
              onClick={goToPrevStep}
              className="px-6 py-2 rounded-md text-gray-600 font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={completeBooking}
              disabled={!isStepComplete(6)}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                isStepComplete(6) ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Complete Booking
            </button>
          </div>
        </div>
      )}
      
      {/* Booking completion screen */}
      {isBookingComplete && (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
          
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            {bookingData.bookingType === 'personal' 
              ? `Your ${bookingData.selectedService?.name} appointment has been scheduled for ${new Date(bookingData.selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${bookingData.selectedTime}.`
              : `You have successfully joined the "${bookingData.selectedEvent?.title}" event on ${new Date(bookingData.selectedEvent?.date || '').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${bookingData.selectedEvent?.time}.`
            }
          </p>
          
          <div className="bg-sky-50 border border-sky-100 rounded-lg p-6 mb-8 max-w-lg mx-auto">
            <div className="flex items-center mb-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={bookingData.selectedDog?.image || '/images/default-dog.jpg'}
                  alt={bookingData.selectedDog?.name || 'Dog'}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{bookingData.selectedDog?.name}</h3>
                <p className="text-sm text-gray-500">{bookingData.selectedDog?.breed}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Date:</span>
                <p className="font-medium text-gray-800">
                  {new Date(bookingData.bookingType === 'personal' ? bookingData.selectedDate : (bookingData.selectedEvent?.date || '')).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              
              <div>
                <span className="text-gray-500">Time:</span>
                <p className="font-medium text-gray-800">{bookingData.bookingType === 'personal' ? bookingData.selectedTime : bookingData.selectedEvent?.time}</p>
              </div>
              
              <div>
                <span className="text-gray-500">Duration:</span>
                <p className="font-medium text-gray-800">
                  {bookingData.bookingType === 'personal' ? bookingData.selectedService?.duration : bookingData.selectedEvent?.duration}
                </p>
              </div>
              
              <div>
                <span className="text-gray-500">Location:</span>
                <p className="font-medium text-gray-800">
                  {bookingData.bookingType === 'personal' ? 'CustomK9 Training Center' : bookingData.selectedEvent?.location}
                </p>
              </div>
              
              <div className="col-span-2 mt-2">
                <span className="text-gray-500">Payment Method:</span>
                <p className="font-medium text-gray-800">{bookingData.paymentMethod}</p>
              </div>
              
              <div className="col-span-2 mt-2">
                <span className="text-gray-500">Amount Paid:</span>
                <p className="font-semibold text-sky-700">
                  KSh {(bookingData.bookingType === 'personal' 
                        ? bookingData.selectedService?.price 
                        : bookingData.selectedEvent?.price)?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/client-area/dashboard/calendar" 
              className="px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              View My Calendar
            </Link>
            
            <Link 
              href="/client-area/dashboard" 
              className="px-6 py-3 rounded-md bg-sky-600 text-white hover:bg-sky-700 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      )}
      
      {!isBookingComplete && currentStep > 1 && (
        <div className="mt-8 flex justify-between">
          <button
            onClick={goToPrevStep}
            className="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          {/* This button will be rendered by the individual step components */}
        </div>
      )}
    </div>
  );
} 