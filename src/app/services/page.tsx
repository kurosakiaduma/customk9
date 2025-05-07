"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ServiceCard from "../components/ui/ServiceCard";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";

// Service data for detailed cards
const detailedServices = [
  {
    title: "PUPPY MANNERS AND SOCIALIZATION",
    description: "Essential training for puppies 8-16 weeks old, focusing on socialization, basic commands, and preventing behavior problems.",
    href: "/services/puppy-manners",
    imageSrc: "/images/puppy-training.jpg",
    imageAlt: "Puppy manners training session"
  },
  {
    title: "BASIC OBEDIENCE",
    description: "Learn fundamental commands and establish good behavior patterns for dogs of all ages.",
    href: "/services/basic-obedience",
    imageSrc: "/images/dog-01.jpg",
    imageAlt: "Basic obedience training class"
  },
  {
    title: "REFRESHER OBEDIENCE",
    description: "For dogs who have had previous training but need a refresher to reinforce commands and behaviors.",
    href: "/services/refresher-obedience",
    imageSrc: "/images/dog-02.jpg", 
    imageAlt: "Refresher obedience training"
  },
  {
    title: "AGILITY & SPORTS",
    description: "A fun way to build confidence and bond with your dog through obstacle courses and agility exercises.",
    href: "/services/agility-sports",
    imageSrc: "/images/dog-03.jpg",
    imageAlt: "Dog agility training"
  },
  {
    title: "BEHAVIOR MODIFICATION",
    description: "Address challenging behaviors with personalized, science-based approaches that bring positive change.",
    href: "/services/behavior-modification",
    imageSrc: "/images/dog-07.jpg",
    imageAlt: "Behavior modification training"
  },
  {
    title: "PRIVATE TRAINING",
    description: "Personalized one-on-one training sessions designed specifically for your dog's unique needs and learning style.",
    href: "/services/private-training",
    imageSrc: "/images/dog-05.jpg",
    imageAlt: "Private dog training session"
  },
  {
    title: "SHOW HANDLING / RING CRAFT",
    description: "Specialized training for show dogs and handlers to excel in the competition ring.",
    href: "/services/show-handling",
    imageSrc: "/images/dog-04.jpg",
    imageAlt: "Dog show handling training"
  },
  {
    title: "LOOSE LEASH WALKING",
    description: "Focused training to eliminate pulling and make walks enjoyable for both you and your dog.",
    href: "/services/loose-leash-walking",
    imageSrc: "/images/dog-05.jpg",
    imageAlt: "Loose leash walking training"
  },
  {
    title: "BEGINNING TRACKING FOR FUN",
    description: "Harness your dog's natural tracking abilities with fun scent-based exercises and games.",
    href: "/services/beginning-tracking",
    imageSrc: "/images/dog-06.jpg",
    imageAlt: "Dog tracking training"
  },
  {
    title: "CLICKER TRAINING",
    description: "Precise positive reinforcement training using clickers to mark and reward desired behaviors.",
    href: "/services/clicker-training",
    imageSrc: "/images/dog-07.jpg",
    imageAlt: "Clicker training with dog"
  },
  {
    title: "SUPERVISED PLAYTIME",
    description: "Structured socialization sessions where dogs can play and interact under professional supervision.",
    href: "/services/supervised-playtime",
    imageSrc: "/images/dog-08.jpg",
    imageAlt: "Dogs in supervised playtime"
  },
  {
    title: "DOG AND FAMILY TRAINING",
    description: "Training sessions that involve the whole family to ensure consistent handling and command responses.",
    href: "/services/dog-and-family-training",
    imageSrc: "/images/dog-09.jpg", 
    imageAlt: "Family dog training session"
  },
  {
    title: "TRAP, NEUTER AND RELEASE (TNR)",
    description: "Humane management of street dog populations through trap, neuter, and release programs.",
    href: "/services/trap-neuter-release",
    imageSrc: "/images/dog-10.jpg",
    imageAlt: "Trap neuter release program"
  },
  {
    title: "CRATE RENTAL",
    description: "Quality crates available for rent for training, transport, or home use with your dog.",
    href: "/services/crate-rental",
    imageSrc: "/images/dog-11.jpg",
    imageAlt: "Dog crates for rental"
  },
  {
    title: "EDUCATION",
    description: "Workshops, seminars, and educational materials on all aspects of dog care, training, and behavior.",
    href: "/services/education",
    imageSrc: "/images/education-dog.jpg",
    imageAlt: "Dog education workshop"
  }
];

export default function ServicesPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Services */}
      <div className="relative h-[60vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/behavior-consultation.jpg"
            alt="Dog services background"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          {/* Text shadow container to ensure readability without overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 h-full flex items-center relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Professional Dog Services
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              From behavior consultations to training classes and welfare assessments, we provide comprehensive services for you and your canine companion.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#services" className="px-6 py-3 bg-white text-sky-700 hover:bg-sky-50 font-semibold rounded-full transition-colors shadow-md">
                View All Services
              </a>
              <a 
                href="/client-area" 
                className="px-6 py-3 bg-yellow-500 text-white hover:bg-yellow-400 font-bold rounded-full transition-colors shadow-xl animate-pulse hover:animate-none transform hover:scale-105 flex items-center"
                onClick={(e) => {
                  // Force navigation to client area page
                  window.location.href = "/client-area";
                  e.preventDefault();
                }}
              >
                <span className="mr-2">Book Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-sky-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-200/30 via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-sky-700">Our Training & Service Programs</h2>
          <p className="text-xl text-center text-gray-700 mb-16 max-w-3xl mx-auto">
            Browse our complete range of specialized dog training programs and services. Each program is tailored to meet specific needs and goals for you and your canine companion.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailedServices.map((service, index) => (
              <Link key={index} href={service.href} className="block group">
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  imageSrc={service.imageSrc}
                  imageAlt={service.imageAlt}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Enhanced Call to Action Section */}
      <section className="py-16 bg-sky-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Training?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Enroll in one of our programs today and give your dog the skills they need to be a well-behaved and happy companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/client-area" 
              className="px-8 py-4 bg-yellow-500 text-white hover:bg-yellow-400 font-bold rounded-full transition-colors shadow-xl animate-pulse hover:animate-none transform hover:scale-105 flex items-center justify-center"
              onClick={(e) => {
                // Force navigation to client area page
                window.location.href = "/client-area";
                e.preventDefault();
              }}
            >
              <span className="mr-2">Book Now</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link 
              href="/client-area" 
              className="px-8 py-4 bg-white text-sky-700 hover:bg-sky-50 text-lg font-semibold rounded-full transition-colors shadow-lg"
            >
              Client Login
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 