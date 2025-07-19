import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface DateTimeSelectionProps {
    bookingType: 'individual' | 'group';
    onSelect: (date: string, time: string) => void;
    getAvailableSlots: (date: string, type: 'individual' | 'group') => Promise<string[]>;
}

export default function DateTimeSelection({ bookingType, onSelect, getAvailableSlots }: DateTimeSelectionProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedDate) {
            fetchAvailableSlots(selectedDate);
        }
    }, [selectedDate, bookingType]);

    const fetchAvailableSlots = async (date: Date) => {
        setLoading(true);
        try {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const slots = await getAvailableSlots(formattedDate, bookingType);
            setAvailableSlots(slots);
        } catch (error) {
            console.error('Failed to fetch available slots:', error);
            setAvailableSlots([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        setSelectedTime('');
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        if (selectedDate) {
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            onSelect(formattedDate, time);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
                <p className="text-gray-600 mb-6">
                    Choose your preferred date and available time slot for the {bookingType === 'individual' ? 'personal' : 'group'} training session.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
                {/* Calendar */}
                <div className="border rounded-lg p-4">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        className="rounded-md"
                        disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                    />
                </div>

                {/* Time Slots */}
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Available Time Slots</h3>
                    {!selectedDate ? (
                        <p className="text-gray-500">Please select a date first</p>
                    ) : loading ? (
                        <p className="text-gray-500">Loading available slots...</p>
                    ) : availableSlots.length === 0 ? (
                        <p className="text-gray-500">No available slots for this date</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {availableSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    className={`p-3 text-sm rounded-md transition-colors ${
                                        selectedTime === time
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    {format(new Date(time), 'h:mm a')}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 