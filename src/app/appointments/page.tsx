'use client';

import { useState } from 'react';
import AppointmentsList from '@/app/components/AppointmentsList';
import Link from 'next/link';

type View = 'upcoming' | 'calendar' | 'list';

export default function AppointmentsPage() {
    const [activeView, setActiveView] = useState<View>('list');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Appointments Calendar</h1>
                <Link
                    href="/appointments/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Book New Appointment
                </Link>
            </div>

            <div className="mb-6">
                <nav className="flex space-x-4" aria-label="Tabs">
                    <button
                        onClick={() => setActiveView('upcoming')}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                            activeView === 'upcoming'
                                ? 'bg-gray-100 text-gray-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveView('calendar')}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                            activeView === 'calendar'
                                ? 'bg-gray-100 text-gray-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Calendar
                    </button>
                    <button
                        onClick={() => setActiveView('list')}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                            activeView === 'list'
                                ? 'bg-gray-100 text-gray-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        List
                    </button>
                </nav>
            </div>

            {/* View Content */}
            {activeView === 'list' && <AppointmentsList />}
            {/* Calendar and Upcoming views will be implemented separately */}
        </div>
    );
} 