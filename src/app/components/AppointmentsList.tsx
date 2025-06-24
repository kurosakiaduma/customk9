import { useEffect, useState } from 'react';
import { CalendarEvent, OdooCalendarService } from '@/services/OdooCalendarService';
import { format } from 'date-fns';

export default function AppointmentsList() {
    const [appointments, setAppointments] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const service = new OdooCalendarService();
            const data = await service.getUpcomingAppointments();
            setAppointments(data);
        } catch (err) {
            setError('Failed to load appointments');
            console.error('Error loading appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateStr: string) => {
        return format(new Date(dateStr), 'h:mm a');
    };

    const formatDate = (dateStr: string) => {
        return format(new Date(dateStr), 'MMM d, yyyy');
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading appointments...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DATE & TIME
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            APPOINTMENT
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            LOCATION
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            TRAINER
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DOG
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            STATUS
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {formatDate(appointment.start)}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {formatTime(appointment.start)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {appointment.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {Math.round(appointment.duration * 60)} minutes
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {appointment.location}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {appointment.trainer_name}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full overflow-hidden">
                                        <img 
                                            src={appointment.dog_image} 
                                            alt={appointment.dog_name}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                const img = e.target as HTMLImageElement;
                                                img.src = '/images/dog-placeholder.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">
                                            {appointment.dog_name}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(appointment.state)}`}>
                                    {appointment.state.charAt(0).toUpperCase() + appointment.state.slice(1)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 