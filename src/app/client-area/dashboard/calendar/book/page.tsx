"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, ChevronRightIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { UserGroupIcon, UserIcon } from '@heroicons/react/24/solid';
import ServiceFactory from "@/services/ServiceFactory";
import { OdooCalendarService } from "@/services/OdooCalendarService";
import { OdooProductService, Service } from "@/services/OdooProductService";
import { BookingService, BookingRequest, BookingResult, BookingConflictError } from "@/services/booking";
import { Dog } from '@/types/dog';


// Define interfaces for our data
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

interface BookingData {
  bookingType: 'personal' | 'public' | null;
  selectedService: Service | null;
  selectedEvent: PublicEvent | null;
  selectedDate: string;
  selectedTime: string;
  selectedDogs: Dog[];
  agreedToTerms: boolean;
  paymentMethod: string;
}

// Function to generate fallback time slots for a given date
const generateFallbackTimeSlots = (): string[] => {
  const slots: string[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  const lunchStart = 12; // 12 PM

  for (let hour = startHour; hour < endHour; hour++) {
    // Skip lunch hours
    if (hour === lunchStart) {
      continue;
    }
    
    const timeString = `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
    slots.push(timeString);
  }
  
  return slots;
};

// Generate calendar days
const generateCalendarDays = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  
  const days = [];
  
  // Add empty cells for the days of the previous month
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  
  // Add days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(today.getFullYear(), today.getMonth(), i));
  }
  
  return days;
};

// Calendar Data
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthsOfYear = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];


export default function BookAppointmentPage() {
  const router = useRouter();
  
  // Initialize services
  const odooClientService = ServiceFactory.getInstance().getOdooClientService();
  const bookingService = useMemo(() => new BookingService(odooClientService), [odooClientService]);
  const odooCalendarService = useMemo(() => new OdooCalendarService(odooClientService), [odooClientService]);
  const odooProductService = useMemo(() => new OdooProductService(odooClientService), [odooClientService]);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [publicEvents, setPublicEvents] = useState<PublicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [conflictDetails, setConflictDetails] = useState<{message: string; conflicts: Array<{id: number; start: string; stop: string}>} | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    bookingType: null,
    selectedService: null,
    selectedEvent: null,
    selectedDate: '',
    selectedTime: '',
    selectedDogs: [],
    agreedToTerms: false,
    paymentMethod: 'credit_card',
  });
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [bookingResult] = useState<BookingResult | null>(null);

  // Function to get available dates for booking
  const getAvailableDates = () => {
    // This is a placeholder implementation - replace with actual API call
    const today = new Date();
    const dates = [];
    
    // Show next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      dates.push({
        dateString: date.toISOString().split('T')[0],
        formattedDate: `${monthsOfYear[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
      });
    }
    
    return dates;
  };
  
  // Function to check if current step is complete
  const isStepComplete = useCallback((step: number): boolean => {
    switch (step) {
      case 1:
        return !!bookingData.bookingType;
      case 2:
        return !!bookingData.selectedService || !!bookingData.selectedEvent;
      case 3:
        return !!bookingData.selectedDate;
      case 4:
        return !!bookingData.selectedTime;
      case 5:
        return bookingData.selectedDogs.length > 0;
      case 6:
        return bookingData.agreedToTerms;
      default:
        return false;
    }
  }, [bookingData]);
  

  // Function to handle the final booking step
  const completeBooking = useCallback(async (): Promise<BookingResult> => {
    if (!isStepComplete(6)) {
      return {
        success: false,
        message: 'Please complete all required fields before submitting.'
      };
    }

    setIsSubmitting(true);
    setError(null);
    setConflictDetails(null);
    
    try {
      // Robustly parse selectedDate and selectedTime to construct valid local time strings
      let startLocal = '';
      let stopLocal = '';
      try {
        // Parse time string (e.g., "11:00 AM")
        const timeMatch = bookingData.selectedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!timeMatch) throw new Error(`Invalid time format: ${bookingData.selectedTime}`);
        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3].toUpperCase();
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        // Build start Date object
        const startDateObj = new Date(bookingData.selectedDate);
        startDateObj.setHours(hours, minutes, 0, 0);
        // Format local time string: 'YYYY-MM-DD HH:mm:ss'
        const pad = (n: number) => String(n).padStart(2, '0');
        startLocal = `${bookingData.selectedDate} ${pad(hours)}:${pad(minutes)}:00`;
        // Calculate stop time using service duration (default 1 hour)
        const durationHours = bookingData.selectedService?.duration ? parseFloat(bookingData.selectedService.duration) : 1;
        const stopDateObj = new Date(startDateObj.getTime() + durationHours * 60 * 60 * 1000);
        stopLocal = `${bookingData.selectedDate} ${pad(stopDateObj.getHours())}:${pad(stopDateObj.getMinutes())}:00`;
      } catch (e) {
        setError('Invalid date or time format for booking.');
        setIsSubmitting(false);
        console.error('Booking time parse error:', e, bookingData);
        return {
          success: false,
          message: 'Invalid date or time format for booking.'
        };
      }

      const bookingPayload: BookingRequest = {
        type: bookingData.bookingType === 'personal' ? 'individual' : 'group',
        service: bookingData.selectedService?.name || bookingData.selectedEvent?.title || '',
        dateTime: {
          start: startLocal,
          stop: stopLocal
        },
        termsAccepted: bookingData.agreedToTerms,
        dogs: bookingData.selectedDogs.map(dog => ({
          name: dog.name,
          breed: dog.breed
        })),
      };

      // Debug log: booking payload
      console.log('Booking payload:', bookingPayload);

      // Create the booking
      let bookingId;
      try {
        bookingId = await bookingService.createBooking(bookingPayload);
        console.log('Booking result (ID):', bookingId);
      } catch (err) {
        console.error('BookingService.createBooking error:', err);
        throw err;
      }
      
      if (!bookingId) {
        throw new Error('No booking ID returned from the server');
      }
      
      const result: BookingResult = {
        success: true,
        bookingId: bookingId.toString(),
        message: 'Your booking has been confirmed successfully!'
      };
      
      setIsBookingComplete(true);
      
      // Reset form state
      setBookingData({
        bookingType: null,
        selectedService: null,
        selectedEvent: null,
        selectedDate: '',
        selectedTime: '',
        selectedDogs: [],
        agreedToTerms: false,
        paymentMethod: 'credit_card'
      });
      
      // Redirect to booking confirmation page
      router.push(`/client-area/dashboard/calendar/book/confirmation?bookingId=${bookingId}`);
      
      return result;
      
    } catch (error: unknown) {
      console.error('Booking error:', error);
      
      // Type guard to check for BookingConflictError
      const isBookingConflictError = (err: unknown): err is BookingConflictError => {
        return (err as BookingConflictError)?.type === 'CONFLICT';
      };
      
      // Handle booking conflict error specifically
      if (isBookingConflictError(error)) {
        const conflictMessage = 'The selected time slot is no longer available. Please choose another time.';
        setError(conflictMessage);
        
        // Store conflict details for UI display
        setConflictDetails({
          message: 'Time slot conflict',
          conflicts: error.conflicts || []
        });
        
        // Move user back to the time selection step
        setCurrentStep(3);
        
        return {
          success: false,
          message: conflictMessage,
          errorCode: 'CONFLICT',
          conflictDetails: error.conflicts
        };
      }
      
      // Handle other errors
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      const userFriendlyMessage = 'We encountered an issue processing your booking. Please try again or contact support if the problem persists.';
      
      setError(userFriendlyMessage);
      
      return {
        success: false,
        message: userFriendlyMessage,
        errorCode: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
        errorDetails: errorMessage
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [bookingData, bookingService, router, isStepComplete]);

  // Function to handle payment method selection
  const selectPaymentMethod = (method: string) => {
    setBookingData({ ...bookingData, paymentMethod: method });
  };

  // Function to fetch available time slots
  const fetchAvailableSlots = useCallback(async () => {
    try {
      const today = new Date();
      
      // First, set loading state
      setIsCheckingAvailability(true);
      
      // Fetch available slots from the API
      const slots = await bookingService.getAvailableTimeSlots(today);
      
      // If no slots are returned from the API, use fallback slots
      if (slots && slots.length > 0) {
        setAvailableSlots(slots);
      } else {
        console.warn('No available slots returned from API, using fallback slots');
        setAvailableSlots(generateFallbackTimeSlots());
      }
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      // Fallback to generated slots if there's an error
      setAvailableSlots(generateFallbackTimeSlots());
    } finally {
      setIsCheckingAvailability(false);
    }
  }, [bookingService]);

  // Fetch available time slots when component mounts or when the selected date changes
  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);

  // Load data from API on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Load dogs
        const [fetchedDogs, fetchedServices] = await Promise.all([
          odooClientService.getDogs(),
          odooProductService.getTrainingServices()
        ]);
        
        setDogs(fetchedDogs);
        setServices(fetchedServices);
        setPublicEvents([]); // For now, use empty array for public events
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load booking data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [odooClientService, odooProductService]);

  // Load available time slots when date or booking type changes
  useEffect(() => {
    // Return early if no booking type is selected
    if (!bookingData.bookingType) {
      setTimeSlots([]);
      return;
    }
    
    const loadTimeSlots = async () => {
      try {
        setIsCheckingAvailability(true);
        const dateStr = selectedDate.toISOString().split('T')[0];
        
        // Map booking types to match the expected values in the booking service
        const bookingTypeMap = {
          'personal': 'individual',
          'public': 'group'
        } as const;
        
        // Get the mapped booking type (we've already checked that bookingType is not null)
        const mappedType = bookingTypeMap[bookingData.bookingType as keyof typeof bookingTypeMap];
        
        const slots = await bookingService.getAvailableSlots(dateStr, mappedType);
        setTimeSlots(slots);
        
        // Clear any selected time if it's no longer available
        if (bookingData.selectedTime && !slots.includes(bookingData.selectedTime)) {
          setBookingData(prev => ({ ...prev, selectedTime: '' }));
        }
      } catch (err) {
        console.error('Error loading time slots:', err);
        setError('Failed to load available time slots. Please try again.');
        setTimeSlots([]);
      } finally {
        setIsCheckingAvailability(false);
      }
    };
    
    loadTimeSlots();
  }, [selectedDate, bookingData.bookingType, bookingService]);

  // Navigation functions
  const goToPrevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  }, []);
  // Move to next step if data for current step is valid
  const goToNextStep = async () => {
    console.log('Current step:', currentStep);
    console.log('Step complete?', isStepComplete(currentStep));
    console.log('Booking data:', bookingData);
    
    if (currentStep === 6 && isStepComplete(currentStep)) {
      try {
        setIsLoading(true);

        // --- Robustly parse selectedTime and add duration for stop time ---
        let startStr = bookingData.selectedDate + ' ' + bookingData.selectedTime;
        let stopStr = '';
        try {
          const parseTimeString = (timeStr: string): { hours: number, minutes: number } => {
            const match = timeStr.match(/^(\\d{1,2}):(\\d{2})\\s*(AM|PM)$/i);
            if (!match) throw new Error(`Invalid time format: ${timeStr}`);
            let hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const ampm = match[3].toUpperCase();
            if (ampm === 'PM' && hours < 12) hours += 12;
            if (ampm === 'AM' && hours === 12) hours = 0;
            return { hours, minutes };
          };
          const { hours, minutes } = parseTimeString(bookingData.selectedTime);
          const startDateObj = new Date(bookingData.selectedDate);
          startDateObj.setHours(hours, minutes, 0, 0);
          const durationHours = bookingData.selectedService?.duration ? parseFloat(bookingData.selectedService.duration) : 1;
          const stopDateObj = new Date(startDateObj.getTime() + durationHours * 60 * 60 * 1000);
          startStr = `${bookingData.selectedDate} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
          stopStr = `${bookingData.selectedDate} ${String(stopDateObj.getHours()).padStart(2, '0')}:${String(stopDateObj.getMinutes()).padStart(2, '0')}:00`;
        } catch (e) {
          setError('Invalid time format for booking.');
          setIsLoading(false);
          return;
        }

        // Map bookingType from 'personal'/'public' to 'individual'/'group'
        const mappedBookingType: 'individual' | 'group' = 
          bookingData.bookingType === 'personal' ? 'individual' : 'group';

        // Call OdooCalendarService to create the appointment
        await odooCalendarService.createBooking({
          type: mappedBookingType,
          service: bookingData.selectedService?.name || bookingData.selectedEvent?.title || 'Unknown Service',
          dateTime: {
            start: startStr,
            stop: stopStr,
          },
          dogs: bookingData.selectedDogs.map(dog => ({ name: dog.name, breed: dog.breed })),
          termsAccepted: bookingData.agreedToTerms
        });
        setIsBookingComplete(true);
      } catch (err: any) {
        console.error('Booking failed:', err);
        setError(`Booking failed: ${err.message || 'An unknown error occurred.'}`);
        setIsLoading(false);
      }
    } else if (isStepComplete(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      console.log('Cannot proceed: current step is not complete');
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
      selectedTime: '',
      selectedDogs: []
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
  // Check if dog is already selected
  const isSelected = bookingData.selectedDogs.some(selectedDog => selectedDog.id === dog.id);
  
  if (isSelected) {
    // If already selected, remove it
    const updatedDogs = bookingData.selectedDogs.filter(selectedDog => selectedDog.id !== dog.id);
    setBookingData({ ...bookingData, selectedDogs: updatedDogs });
  } else {
    // If not selected, add it
    setBookingData({ ...bookingData, selectedDogs: [...bookingData.selectedDogs, dog] });
  }
};

// Handle terms agreement
const toggleTermsAgreement = () => {
  setBookingData({ ...bookingData, agreedToTerms: !bookingData.agreedToTerms });
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
              <p className="text-sm text-gray-500">Dogs</p>
              <p className="font-medium">{bookingData.selectedDogs.map(dog => dog.name).join(', ')}</p>
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

// Render booking status message if available
const renderStatusMessage = () => {
  if (!bookingResult) return null;

  return (
    <div className={`mb-6 p-4 rounded-md ${bookingResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {bookingResult.success ? (
            <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
          ) : (
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          )}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${bookingResult.success ? 'text-green-800' : 'text-red-800'}`}>
            {bookingResult.message}
            {bookingResult.bookingId && (
              <span className="block mt-1 text-sm">Booking ID: {bookingResult.bookingId}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

return (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
        <p className="mt-2 text-lg text-gray-600">Schedule your dog&apos;s training session</p>
      </div>
      {renderStatusMessage()}
      
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
                  <span className="hidden sm:inline ml-2 text-sm">Dogs</span>
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
              // Public event flow (fewer steps)
              <>
                <li className={`flex items-center ${currentStep > 1 ? 'text-sky-600' : 'text-gray-500'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 1 ? 'bg-sky-100 text-sky-800' : 
                    currentStep > 1 ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 1 ? <CheckCircleIcon className="w-4 h-4" /> : 1}
                  </span>
                  <span className="ml-2 text-sm">Event</span>
                  <span className="mx-2 sm:mx-4"><ChevronRightIcon className="w-4 h-4" /></span>
                </li>
                <li className={`flex items-center ${currentStep > 2 ? 'text-sky-600' : 'text-gray-500'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 2 ? 'bg-sky-100 text-sky-800' : 
                    currentStep > 2 ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 2 ? <CheckCircleIcon className="w-4 h-4" /> : 2}
                  </span>
                  <span className="hidden sm:inline ml-2 text-sm">Dogs</span>
                  <span className="mx-2 sm:mx-4"><ChevronRightIcon className="w-4 h-4" /></span>
                </li>
                <li className={`flex items-center ${currentStep > 3 ? 'text-sky-600' : 'text-gray-500'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    currentStep === 3 ? 'bg-sky-100 text-sky-800' : 
                    currentStep > 3 ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 3 ? <CheckCircleIcon className="w-4 h-4" /> : 3}
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
                Schedule a one-on-one session with our trainers tailored to your dogs&apos; needs.
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
              <h3 className="text-lg font-medium mb-2">Class/Events</h3>
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
              Next: {bookingData.bookingType === 'personal' ? 'Select Service' : 'Select Class/Event'}
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
                {services.map((service) => (
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
                          src={service.image || "/images/dog-placeholder.jpg"}
                          alt={service.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            const imgElement = e.currentTarget as HTMLImageElement;
                            imgElement.src = "/images/dog-placeholder.jpg"; // Use a consistent placeholder
                          }}
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
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Select a Class/Event</h2>
              
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
                    aria-label="Previous month"
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
                    aria-label="Next month"
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
                    const eventsOnDay = publicEvents.filter(event => event.date === dateString);
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
                        src={bookingData.selectedEvent.image || "/images/dog-placeholder.jpg"}
                        alt={bookingData.selectedEvent.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          const imgElement = e.currentTarget as HTMLImageElement;
                          imgElement.src = "/images/dog-placeholder.jpg"; // Use a consistent placeholder
                        }}
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
                          <p>{bookingData.selectedEvent?.duration}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Location:</span>
                          <p>{bookingData.selectedEvent?.location}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Trainer:</span>
                          <p>{bookingData.selectedEvent?.trainer}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Price:</span>
                          <p className="font-semibold">KSh {bookingData.selectedEvent?.price.toLocaleString()}</p>
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
              aria-label="Go back to previous step"
            >
              Back
            </button>
            <button
              onClick={goToNextStep}
              disabled={!isStepComplete(2)}
              aria-label={isStepComplete(2) ? 'Continue to next step' : 'Please complete the current step to continue'}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                isStepComplete(2) ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Next: {bookingData.bookingType === 'personal' ? 'Choose Date & Time' : 'Select Dogs'}
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Select Date and Time */}
      {currentStep === 3 && bookingData.bookingType === 'personal' && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Choose Date &amp; Time</h2>
          <div className="mb-8">
            <h3 className="font-medium text-gray-800 mb-3">Available Dates</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {getAvailableDates().map((date) => (
                <button
                  key={date.dateString}
                  onClick={() => selectDate(date.dateString)}
                  title={`Select date ${date.formattedDate}`}
                  aria-label={`Select date ${date.formattedDate}`}
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
                {timeSlots.map((time) => {
                  const isAvailable = availableSlots.includes(time);
                  return (
                    <button
                      key={time}
                      onClick={() => isAvailable && selectTime(time)}
                      disabled={!isAvailable}
                      title={isAvailable ? `Select time ${time}` : `Time ${time} is already booked`}
                      aria-label={isAvailable ? `Select time ${time}` : `Time ${time} is not available`}
                      className={`p-2 rounded-md text-center text-sm transition-colors ${
                        bookingData.selectedTime === time && isAvailable
                          ? 'bg-sky-600 text-white'
                          : !isAvailable
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed line-through'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
              {availableSlots.length === 0 && (
                <div className="text-sm text-red-500 mt-4">No available slots for this date.</div>
              )}
            </div>
          )}
          <div className="mt-8 flex justify-between">
            <button
              onClick={goToPrevStep}
              className="px-6 py-2 rounded-md text-gray-600 font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Go back to previous step"
            >
              Back
            </button>
            <button
              onClick={goToNextStep}
              disabled={!isStepComplete(3)}
              aria-label={isStepComplete(3) ? 'Continue to select dogs' : 'Please complete the current step to continue'}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                isStepComplete(3) ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Next: Select Dogs
            </button>
          </div>
        </div>
      )}
      
      {/* Step 4: Select Dogs */}
      {((currentStep === 4 && bookingData.bookingType === 'personal') || 
        (currentStep === 3 && bookingData.bookingType === 'public')) && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Select Your Dogs</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading your dogs...</p>
            </div>
          ) : dogs.length > 0 ? (
            <div>
              <p className="mb-4 text-gray-600">Select one or more dogs for this appointment by clicking on them:</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {dogs.map((dog) => (
                  <div 
                    key={dog.id}
                    onClick={() => selectDog(dog)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      bookingData.selectedDogs.some(d => d.id === dog.id) 
                        ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500 ring-opacity-50' 
                        : 'border-gray-200 hover:border-sky-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 relative h-16 w-16 rounded-full overflow-hidden mr-4">
                        <Image
                          src={dog.image || "/images/dog-placeholder.jpg"}
                          alt={dog.name}
                          fill
                          sizes="64px"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            const imgElement = e.currentTarget as HTMLImageElement;
                            imgElement.src = "/images/dog-placeholder.jpg"; // Use a consistent placeholder
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{dog.name}</h3>
                        <p className="text-sm text-gray-500">{dog.breed}, {dog.age} years old</p>
                      </div>
                      <div className="ml-2">
                        <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                          bookingData.selectedDogs.some(d => d.id === dog.id) 
                            ? 'bg-sky-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {bookingData.selectedDogs.some(d => d.id === dog.id) ? (
                            <CheckIcon className="w-4 h-4" />
                          ) : null}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">You don&apos;t have any dogs registered yet.</p>
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
              aria-label="Go back to previous step"
            >
              Back
            </button>
            <button
              onClick={goToNextStep}
              disabled={!isStepComplete(bookingData.bookingType === 'personal' ? 4 : 3)}
              aria-label={isStepComplete(bookingData.bookingType === 'personal' ? 4 : 3) ? 'Continue to terms and conditions' : 'Please complete the current step to continue'}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                isStepComplete(bookingData.bookingType === 'personal' ? 4 : 3) ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Next: {bookingData.bookingType === 'personal' ? 'Terms & Conditions' : 'Terms & Conditions'}
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
              <li>Clients are responsible for their dogs&apos; behavior during sessions. CustomK9 reserves the right to refuse service to dogs exhibiting dangerous behavior.</li>
              <li>Cancellations must be made at least 24 hours in advance to receive a full refund. Late cancellations may be subject to a cancellation fee.</li>
              <li>Appointments may be rescheduled subject to availability.</li>
              <li>Payment must be made at the time of booking to confirm your appointment.</li>
              <li>CustomK9 uses positive reinforcement methods. Clients are expected to continue these methods at home for best results.</li>
              <li>CustomK9 is not responsible for accidents or injuries that may occur during training sessions.</li>
              <li>Results may vary based on consistent practice and the individual dogs&apos; temperaments.</li>
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
              aria-label="Go back to previous step"
            >
              Back
            </button>
            <button
              onClick={goToNextStep}
              disabled={!isStepComplete(bookingData.bookingType === 'personal' ? 5 : 4)}
              aria-label={isStepComplete(bookingData.bookingType === 'personal' ? 5 : 4) ? 'Continue to payment' : 'Please complete the current step to continue'}
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
              aria-label="Go back to previous step"
            >
              Back
            </button>
            <button
              onClick={completeBooking}
              disabled={!isStepComplete(6)}
              aria-label={isStepComplete(6) ? 'Complete your booking' : 'Please complete all required fields to book'}
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
              ? `Your ${bookingData.selectedService?.name} appointment has been scheduled for ${new Date(bookingData.selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })} at ${bookingData.selectedTime}.`
              : `You have successfully joined the "${bookingData.selectedEvent?.title}" event on ${new Date(bookingData.selectedEvent?.date || '').toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })} at ${bookingData.selectedEvent?.time}.`
            }
          </p>
          
          <div className="bg-sky-50 border border-sky-100 rounded-lg p-6 mb-8 max-w-lg mx-auto">
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Selected Dogs:</h3>
              <div className="flex flex-wrap items-center gap-3">
                {bookingData.selectedDogs.map(dog => (
                  <div key={dog.id} className="flex items-center bg-white p-2 rounded-lg shadow-sm">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-2">
                      <Image
                        src={dog.image || "/images/dog-placeholder.jpg"}
                        alt={dog.name}
                        fill
                        sizes="40px"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          const imgElement = e.currentTarget as HTMLImageElement;
                          imgElement.src = "/images/dog-placeholder.jpg"; // Use a consistent placeholder
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{dog.name}</p>
                      <p className="text-xs text-gray-500">{dog.breed}</p>
                    </div>
                  </div>
                ))}
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
                  {bookingData.bookingType === 'personal' 
                    ? bookingData.selectedService?.duration 
                    : bookingData.selectedEvent?.duration}
                </p>
              </div>
              
              <div>
                <span className="text-gray-500">Location:</span>
                <p className="font-medium text-gray-800">
                  {bookingData.bookingType === 'personal' 
                    ? 'CustomK9 Training Center' 
                    : bookingData.selectedEvent?.location}
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
              aria-label="View my calendar"
            >
              View My Calendar
            </Link>
            
            <Link 
              href="/client-area/dashboard" 
              className="px-6 py-3 rounded-md bg-sky-600 text-white hover:bg-sky-700 transition-colors"
              aria-label="Go to dashboard"
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
  </div>
  );
};