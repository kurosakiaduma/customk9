// Define types for appointment data (now sourced from Odoo Calendar)
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
