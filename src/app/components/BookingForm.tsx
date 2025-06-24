import { useState } from 'react';
import { OdooCalendarService, BookingDetails } from '@/services/OdooCalendarService';
import ServiceSelection from './ServiceSelection';
import DateTimeSelection from './DateTimeSelection';
import DogSelection from './DogSelection';
import TermsAcceptance from './TermsAcceptance';
import ServiceFactory from '@/services/ServiceFactory';

const steps = [
    { id: 1, name: 'Booking Type' },
    { id: 2, name: 'Service' },
    { id: 3, name: 'Date & Time' },
    { id: 4, name: 'Dogs' },
    { id: 5, name: 'Terms' }
];

interface Dog {
    name: string;
    breed?: string;
}

export default function BookingForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingType, setBookingType] = useState<'individual' | 'group' | null>(null);
    const [service, setService] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const odooClientService = ServiceFactory.getInstance().getOdooClientService();
    const calendarService = new OdooCalendarService(odooClientService);

    const handleDateTimeSelect = (date: string, time: string) => {
        setSelectedDate(date);
        setSelectedTime(time);
    };

    const handleDogSelection = (selectedDogs: Dog[]) => {
        setDogs(selectedDogs);
    };

    const handleSubmit = async () => {
        if (!bookingType || !service || !selectedDate || !selectedTime || dogs.length === 0 || !termsAccepted) {
            setError('Please complete all required fields');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const bookingDetails: BookingDetails = {
                type: bookingType,
                service,
                dateTime: {
                    start: `${selectedDate} ${selectedTime}`,
                    stop: `${selectedDate} ${selectedTime}` // The service will calculate the end time based on type
                },
                dogs,
                termsAccepted
            };

            await calendarService.createBooking(bookingDetails);
            // Handle success (e.g., show confirmation, redirect)
            window.location.href = '/booking-confirmation';
        } catch (error) {
            setError('Failed to create booking. Please try again.');
            console.error('Booking failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Book New Appointment</h1>
            <p className="text-gray-600 mb-8">Complete the steps below to schedule your appointment</p>

            {/* Progress Steps */}
            <div className="flex justify-between mb-12">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`flex items-center ${currentStep === step.id ? 'text-blue-600' : 'text-gray-500'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            currentStep === step.id ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                            {step.id}
                        </div>
                        <span className="ml-2">{step.name}</span>
                        {step.id !== steps.length && (
                            <div className="flex-1 h-px bg-gray-300 mx-4" />
                        )}
                    </div>
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                    {error}
                </div>
            )}

            {/* Step 1: Booking Type */}
            {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-6">
                    <div
                        className={`p-6 border rounded-lg cursor-pointer ${
                            bookingType === 'individual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => setBookingType('individual')}
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Personal Training</h3>
                        <p className="text-gray-600">Schedule a one-on-one session with our trainers tailored to your dogs' needs.</p>
                        <ul className="mt-4 space-y-2">
                            <li className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Personalized attention
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Choose your own schedule
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Focus on specific training needs
                            </li>
                        </ul>
                    </div>

                    <div
                        className={`p-6 border rounded-lg cursor-pointer ${
                            bookingType === 'group' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => setBookingType('group')}
                    >
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Class/Events</h3>
                        <p className="text-gray-600">Join one of our group classes or specialized training events with other dogs.</p>
                        <ul className="mt-4 space-y-2">
                            <li className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Socialization opportunities
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Cost-effective training
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Pre-scheduled events
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Step 2: Service Selection */}
            {currentStep === 2 && bookingType && (
                <ServiceSelection
                    bookingType={bookingType}
                    onSelect={(selectedService) => setService(selectedService)}
                />
            )}

            {/* Step 3: Date & Time Selection */}
            {currentStep === 3 && bookingType && (
                <DateTimeSelection
                    bookingType={bookingType}
                    onSelect={handleDateTimeSelect}
                    getAvailableSlots={calendarService.getAvailableSlots.bind(calendarService)}
                />
            )}

            {/* Step 4: Dog Selection */}
            {currentStep === 4 && bookingType && (
                <DogSelection
                    bookingType={bookingType}
                    onSelect={handleDogSelection}
                />
            )}

            {/* Step 5: Terms Acceptance */}
            {currentStep === 5 && (
                <TermsAcceptance
                    onAccept={setTermsAccepted}
                    isAccepted={termsAccepted}
                />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                    <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                        Previous
                    </button>
                )}
                {currentStep < steps.length && (
                    <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="ml-auto px-6 py-3 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                        Next
                    </button>
                )}
                {currentStep === steps.length && (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="ml-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                    </button>
                )}
            </div>
        </div>
    );
} 