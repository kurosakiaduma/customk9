// Define types for appointment data
export interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  trainer: string;
  dogName: string;
  dogImage: string;
  dogNames?: string[];  // Array of dog names for group bookings
  dogImages?: string[]; // Array of dog images for group bookings
  isGroupEvent?: boolean; // Flag indicating if this is a group event
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice?: number;
  paymentMethod?: string;
  createdAt?: string;
  notes?: string;
}

// Utility function to ensure appointment image properties are valid
export function ensureValidAppointmentImage(appointment: Appointment): Appointment {
  const validatedAppointment = {...appointment};
  
  // Ensure dogImage is never empty or undefined
  if (!validatedAppointment.dogImage || validatedAppointment.dogImage === "") {
    validatedAppointment.dogImage = "/images/dog-placeholder.jpg";
  }
  
  // Ensure dogName is never empty or undefined
  if (!validatedAppointment.dogName || validatedAppointment.dogName === "") {
    validatedAppointment.dogName = "Unknown Dog";
  }
  
  return validatedAppointment;
}

// Sample appointments data
export const dummyAppointments: Appointment[] = [
  {
    id: 1,
    title: "Group Obedience Training",
    date: "2024-07-15",
    time: "10:00 AM",
    duration: "60 min",
    location: "Central Park",
    trainer: "Sarah Johnson",
    dogName: "Luna",
    dogImage: "/images/dog-03.jpg",
    status: "confirmed",
  },
  {
    id: 2,
    title: "Private Behavior Consultation",
    date: "2024-07-18", 
    time: "2:00 PM",
    duration: "90 min",
    location: "Your Home",
    trainer: "Michael Clark",
    dogName: "Rocky",
    dogImage: "/images/dog-04.jpg",
    status: "confirmed",
  },
  {
    id: 3,
    title: "Advanced Training Session",
    date: "2024-07-22",
    time: "11:30 AM",
    duration: "60 min",
    location: "Training Center",
    trainer: "Sarah Johnson",
    dogName: "Luna",
    dogImage: "/images/dog-03.jpg",
    status: "pending",
  },
  {
    id: 4,
    title: "Socialization Class",
    date: "2024-07-25",
    time: "3:00 PM",
    duration: "45 min",
    location: "Dog Park",
    trainer: "Emily Wilson",
    dogName: "Rocky",
    dogImage: "/images/dog-04.jpg",
    status: "confirmed",
  },
  {
    id: 5,
    title: "Progress Assessment",
    date: "2024-08-02",
    time: "10:00 AM",
    duration: "30 min",
    location: "Training Center",
    trainer: "Michael Clark",
    dogName: "Luna",
    dogImage: "/images/dog-03.jpg",
    status: "pending",
  },
];

// Function to get appointment by ID
export function getAppointmentById(id: number): Appointment | undefined {
  const appointment = dummyAppointments.find(appointment => appointment.id === id);
  return appointment ? ensureValidAppointmentImage(appointment) : undefined;
}

// Function to get upcoming appointments
export function getUpcomingAppointments(): Appointment[] {
  return dummyAppointments
    .filter(apt => new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(apt => ensureValidAppointmentImage(apt));
}

// Function to get appointments by status
export function getAppointmentsByStatus(status: string): Appointment[] {
  return dummyAppointments
    .filter(appointment => appointment.status === status)
    .map(apt => ensureValidAppointmentImage(apt));
}

// Function to get appointments by date
export function getAppointmentsByDate(date: string): Appointment[] {
  return dummyAppointments
    .filter(appointment => appointment.date === date)
    .map(apt => ensureValidAppointmentImage(apt));
} 