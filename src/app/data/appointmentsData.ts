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
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice?: number;
  paymentMethod?: string;
  createdAt?: string;
  notes?: string;
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
  return dummyAppointments.find(appointment => appointment.id === id);
}

// Function to get upcoming appointments
export function getUpcomingAppointments(): Appointment[] {
  return dummyAppointments
    .filter(apt => new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Function to get appointments by status
export function getAppointmentsByStatus(status: string): Appointment[] {
  return dummyAppointments.filter(appointment => appointment.status === status);
}

// Function to get appointments by date
export function getAppointmentsByDate(date: string): Appointment[] {
  return dummyAppointments.filter(appointment => appointment.date === date);
} 