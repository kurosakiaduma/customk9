// Define types for events data
export interface ScheduleItem {
  time: string;
  activity: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
  category: string;
  attending: number;
  featured: boolean;
  organizer?: string;
  price?: string;
  contact?: string;
  website?: string;
  schedule?: ScheduleItem[];
}

// Sample events data
export const eventsData: Event[] = [
  {
    id: 1,
    title: "Puppy Training Workshop",
    date: "June 15, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "Karen Dog Park",
    image: "/images/puppy-training.jpg",
    description: "Join us for an interactive puppy training workshop where you'll learn essential skills for training your new puppy. This workshop is perfect for puppies between 8-20 weeks old.\n\nOur expert trainers will guide you through basic commands, socialization techniques, and how to address common puppy behaviors. You'll leave with practical skills you can immediately implement at home.\n\nAll participants will receive a training handbook and certificate of completion.",
    category: "Training",
    attending: 28,
    featured: true,
    organizer: "CustomK9 Training Team",
    price: "KSh 2,500 per person (one puppy included)",
    contact: "events@customk9.com",
    website: "https://customk9.com/events/puppy-workshop",
    schedule: [
      { time: "9:00 AM", activity: "Registration & Welcome" },
      { time: "9:15 AM", activity: "Introduction to Puppy Development" },
      { time: "9:45 AM", activity: "Basic Commands & Positive Reinforcement" },
      { time: "10:30 AM", activity: "Coffee Break" },
      { time: "10:45 AM", activity: "Socialization & Play Session" },
      { time: "11:30 AM", activity: "Q&A and Personalized Advice" },
      { time: "12:00 PM", activity: "Workshop Conclusion" }
    ]
  },
  {
    id: 2,
    title: "Dog Agility Competition",
    date: "July 20, 2024",
    time: "8:00 AM - 5:00 PM",
    location: "Ngong Road Sports Complex",
    image: "/images/agility.jpg",
    description: "CustomK9 presents our annual Dog Agility Competition, open to trained dogs of all breeds and sizes. Test your dog's skills through our professionally designed agility course.\n\nCompetitions will be divided by dog size and experience level, ensuring fair competition for all participants. Spectators are welcome to cheer on their favorite competitors.\n\nPrizes will be awarded to top performers in each category. Food and refreshments will be available throughout the day.",
    category: "Competition",
    attending: 75,
    featured: true,
    organizer: "CustomK9 Events Team",
    price: "KSh 3,500 per competitor | KSh 500 for spectators",
    contact: "competitions@customk9.com",
    website: "https://customk9.com/events/agility-competition",
    schedule: [
      { time: "8:00 AM", activity: "Registration & Course Walkthrough" },
      { time: "9:00 AM", activity: "Small Dogs - Beginner Level" },
      { time: "10:30 AM", activity: "Medium Dogs - Beginner Level" },
      { time: "12:00 PM", activity: "Lunch Break & Demonstration" },
      { time: "1:00 PM", activity: "Large Dogs - Beginner Level" },
      { time: "2:30 PM", activity: "Advanced Level - All Sizes" },
      { time: "4:00 PM", activity: "Finals & Award Ceremony" }
    ]
  },
  {
    id: 3,
    title: "Canine First Aid Course",
    date: "August 12, 2024",
    time: "10:00 AM - 3:00 PM",
    location: "CustomK9 Training Center",
    image: "/images/welfare.jpg",
    description: "Learn potentially life-saving skills for your dog in this comprehensive Canine First Aid Course. Led by veterinary professionals, this course covers emergency situations and how to respond effectively.\n\nTopics include recognizing signs of distress, basic CPR techniques, wound management, and what to do in case of poisoning or heat stroke. This knowledge is invaluable for all dog owners.\n\nThe course includes hands-on practice with canine mannequins and a detailed first aid manual to take home.",
    category: "Education",
    attending: 35,
    featured: false,
    organizer: "CustomK9 in collaboration with Nairobi Veterinary Clinic",
    price: "KSh 4,000 per person",
    contact: "courses@customk9.com",
    website: "https://customk9.com/events/canine-first-aid",
    schedule: [
      { time: "10:00 AM", activity: "Introduction & Safety Principles" },
      { time: "10:30 AM", activity: "Assessing Your Dog's Vital Signs" },
      { time: "11:15 AM", activity: "Common Emergencies & Response" },
      { time: "12:30 PM", activity: "Lunch Break" },
      { time: "1:30 PM", activity: "Hands-on CPR Practice" },
      { time: "2:15 PM", activity: "Creating an Emergency Plan" },
      { time: "3:00 PM", activity: "Certificate Presentation & Conclusion" }
    ]
  },
  {
    id: 4,
    title: "Community Dog Walk",
    date: "September 5, 2024",
    time: "7:30 AM - 9:30 AM",
    location: "Karura Forest",
    image: "/images/socialization.jpg",
    description: "Join fellow dog lovers for our monthly Community Dog Walk through the beautiful trails of Karura Forest. This is a wonderful opportunity for both dogs and owners to socialize in a safe, controlled environment.\n\nOur professional trainers will be present to offer guidance and ensure all dogs interact safely. This is an excellent way to practice your dog's social skills and leash manners.\n\nThe walk is approximately 3km at a leisurely pace, suitable for most dogs and owners.",
    category: "Social",
    attending: 42,
    featured: false,
    organizer: "CustomK9 Community Outreach",
    price: "KSh 1,000 per dog (includes forest entry fee)",
    contact: "community@customk9.com",
    website: "https://customk9.com/events/community-walk"
  },
  {
    id: 5,
    title: "Advanced Obedience Workshop",
    date: "October 10, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "CustomK9 Training Field",
    image: "/images/advanced-obedience.jpg",
    description: "Take your dog's training to the next level with our Advanced Obedience Workshop. This session is designed for dogs who already have a solid understanding of basic commands.\n\nIn this workshop, we'll focus on reliability in distracting environments, distance work, and duration of commands. You'll learn techniques to refine your communication with your dog and build a stronger working relationship.\n\nParticipating dogs should already be comfortable with basic commands like sit, stay, come, and walk on a loose leash.",
    category: "Training",
    attending: 18,
    featured: false,
    organizer: "CustomK9 Senior Trainers",
    price: "KSh 3,000 per dog-handler team",
    contact: "training@customk9.com",
    website: "https://customk9.com/events/advanced-obedience"
  }
];

// Function to get event by ID
export function getEventById(id: number): Event | undefined {
  return eventsData.find(event => event.id === id);
}

// Function to get featured events
export function getFeaturedEvents(): Event[] {
  return eventsData.filter(event => event.featured);
}

// Function to get events by category
export function getEventsByCategory(category: string): Event[] {
  return eventsData.filter(event => event.category === category);
}

// Function to get upcoming events (all events for now since they're in the future)
export function getUpcomingEvents(): Event[] {
  return eventsData;
} 