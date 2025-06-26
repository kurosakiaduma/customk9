"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Appointment, ensureValidAppointmentImage } from "@/types/appointment";
import { OdooCalendarService, CalendarEvent } from "@/services/OdooCalendarService";
import { OdooClientService } from "@/services/odoo/OdooClientService";

// Calendar Data
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthsOfYear = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

// Convert CalendarEvent to Appointment interface
const convertCalendarEventToAppointment = (event: CalendarEvent): Appointment => {
  const startDate = new Date(event.start);
  
  return {
    id: event.id,
    title: event.name,
    date: startDate.toISOString().split('T')[0],
    time: startDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    duration: `${event.duration} hours`,
    location: event.location,
    trainer: event.trainer_name,
    dogName: event.dog_name,
    dogImage: event.dog_image || "/images/dog-placeholder.jpg",
    status: event.state
  };
};

export default function CalendarPage() {
  const [selectedView, setSelectedView] = useState("list"); // "upcoming", "calendar", "list"
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load appointments from Odoo Calendar on initial load
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
          // Initialize Odoo services
        const odooClient = new OdooClientService({ baseUrl: '/api/odoo' });
        const calendarService = new OdooCalendarService(odooClient);
        
        // Fetch real calendar events
        const calendarEvents = await calendarService.getUpcomingAppointments();
        console.log('📅 Loaded calendar events:', calendarEvents);
        
        // Convert to Appointment format
        const convertedAppointments = calendarEvents.map(convertCalendarEventToAppointment);
        
        // Also check for any locally stored appointments
        try {
          const storedAppointments = localStorage.getItem('appointments');
          if (storedAppointments) {
            const parsedAppointments = JSON.parse(storedAppointments);
            const validatedAppointments = parsedAppointments.map((apt: Appointment) => 
              ensureValidAppointmentImage(apt)
            );
            // Combine real Odoo events with local appointments
            setAppointments([...convertedAppointments, ...validatedAppointments]);
          } else {
            setAppointments(convertedAppointments);
          }
        } catch (localError) {
          console.error('Error loading local appointments:', localError);
          setAppointments(convertedAppointments);
        }
        
      } catch (error) {
        console.error('❌ Error loading appointments:', error);
        setError('Failed to load appointments. Please try again later.');
        setAppointments([]); // Start with empty array instead of dummy data
      } finally {
        setLoading(false);
      }
    };
    
    loadAppointments();
  }, []);
  
  // Get current month and year
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for the days of the previous month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  // Check if a date has appointments
  const getAppointmentsForDate = (date: Date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateString);
  };
  
  // Change month
  const changeMonth = (increment: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setSelectedDate(newDate);
  };
  
  // Filter upcoming appointments
  const upcomingAppointments = appointments.filter(apt => {
    return new Date(apt.date) >= new Date();
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Handle appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };
  
  // Color based on status
  const getStatusColor = (status: string) => {
    switch(status) {
      case "confirmed": return "bg-green-100 text-green-700";
      case "pending": return "bg-amber-100 text-amber-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-800">Appointments Calendar</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView("upcoming")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              selectedView === "upcoming" 
                ? "bg-sky-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setSelectedView("calendar")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              selectedView === "calendar" 
                ? "bg-sky-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setSelectedView("list")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              selectedView === "list" 
                ? "bg-sky-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            List
          </button>
        </div>
      </div>
        {/* New Appointment Button */}
      <div className="flex justify-end">
        <Link
          href="/client-area/dashboard/calendar/book"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm font-medium transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"></path>
          </svg>
          Book New Appointment
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <span className="ml-3 text-gray-600">Loading appointments...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="text-red-800 font-medium">Error Loading Appointments</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content - only show when not loading */}
      {!loading && (
        <>
          {/* Upcoming View */}
          {selectedView === "upcoming" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Upcoming Appointments</h2>
              
              {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map(appointment => (
                <div 
                  key={appointment.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <div className="flex justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={appointment.dogImage && appointment.dogImage !== "" ? appointment.dogImage : "/images/dog-placeholder.jpg"}
                          alt={appointment.dogName || "Dog"}
                          fill
                          sizes="48px"
                          style={{ objectFit: "cover" }}
                          onError={(e) => {
                            const imgElement = e.currentTarget as HTMLImageElement;
                            imgElement.src = "/images/dog-placeholder.jpg"; // Fallback image
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{appointment.title}</h3>
                        <p className="text-gray-600">
                          {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {appointment.time}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs self-start ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-y-2">
                    <div className="flex items-center pr-4">
                      <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm text-gray-600">{appointment.duration}</span>
                    </div>
                    <div className="flex items-center pr-4">
                      <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="text-sm text-gray-600">{appointment.location}</span>
                    </div>
                    <div className="flex items-center pr-4">
                      <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span className="text-sm text-gray-600">{appointment.trainer}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z"></path>
                      </svg>
                      <span className="text-sm text-gray-600">{appointment.dogName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">You don't have any upcoming appointments.</p>
              <Link
                href="/client-area/dashboard/calendar/book"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Book New Appointment
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Calendar View */}
      {selectedView === "calendar" && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <h2 className="text-xl font-semibold">
              {monthsOfYear[currentMonth]} {currentYear}
            </h2>
            
            <button
              onClick={() => changeMonth(1)}
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
            {calendarDays.map((day, index) => {
              const appointments = day ? getAppointmentsForDate(day) : [];
              const isToday = day && day.toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={index} 
                  className={`min-h-[80px] border rounded-md p-1 ${
                    !day ? 'bg-gray-50' : 
                    isToday ? 'bg-sky-50 border-sky-200' : 'hover:bg-gray-50'
                  }`}
                >
                  {day && (
                    <>
                      <div className={`text-right mb-1 ${isToday ? 'font-bold text-sky-600' : ''}`}>
                        {day.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {appointments.slice(0, 2).map(apt => (
                          <div 
                            key={apt.id}
                            className="text-xs p-1 rounded bg-sky-100 text-sky-800 truncate cursor-pointer"
                            onClick={() => handleAppointmentClick(apt)}
                          >
                            {apt.time} - {apt.title}
                          </div>
                        ))}
                        
                        {appointments.length > 2 && (
                          <div className="text-xs text-gray-500 pl-1">
                            +{appointments.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* List View */}
      {selectedView === "list" && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dog</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map(appointment => (
                  <tr 
                    key={appointment.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-gray-900">{appointment.title}</div>
                      <div className="text-sm text-gray-500">{appointment.duration}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{appointment.location}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{appointment.trainer}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 relative rounded-full overflow-hidden mr-2">
                          <Image
                            src={appointment.dogImage && appointment.dogImage !== "" ? appointment.dogImage : "/images/dog-placeholder.jpg"}
                            alt={appointment.dogName || "Dog"}
                            fill
                            sizes="32px"
                            style={{ objectFit: "cover" }}
                            onError={(e) => {
                              const imgElement = e.currentTarget as HTMLImageElement;
                              imgElement.src = "/images/dog-placeholder.jpg"; // Fallback image
                            }}
                          />
                        </div>
                        <div className="text-sm text-gray-700">{appointment.dogName}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Modal for appointment details */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-5 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-900">{selectedAppointment.title}</h3>
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-sky-100">
                  <Image
                    src={selectedAppointment.dogImage && selectedAppointment.dogImage !== "" ? selectedAppointment.dogImage : "/images/dog-placeholder.jpg"}
                    alt={selectedAppointment.dogName || "Dog"}
                    fill
                    sizes="64px"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      const imgElement = e.currentTarget as HTMLImageElement;
                      imgElement.src = "/images/dog-placeholder.jpg"; // Fallback image
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-lg">{selectedAppointment.dogName}</h4>
                  <p className="text-gray-600 text-sm">Training Session</p>
                </div>

              </div>
            
              <div>
                <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                <p className="font-medium">
                  {new Date(selectedAppointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  <br />
                  {selectedAppointment.time} ({selectedAppointment.duration})
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="font-medium">{selectedAppointment.location}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Trainer</p>
                <p className="font-medium">{selectedAppointment.trainer}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="p-5 border-t border-gray-200 flex justify-end space-x-3">
              {selectedAppointment.status !== "cancelled" && (
                <button 
                  className="py-2 px-4 rounded-md text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                  onClick={() => {
                    alert("This would cancel the appointment in a real app");
                    setShowAppointmentModal(false);
                  }}
                >
                  Cancel Appointment
                </button>
              )}
              
              <button 
                className="py-2 px-4 rounded-md text-sm font-medium text-sky-700 bg-sky-100 hover:bg-sky-200 transition-colors"
                onClick={() => {
                  alert("This would reschedule the appointment in a real app");
                  setShowAppointmentModal(false);
                }}
              >                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}