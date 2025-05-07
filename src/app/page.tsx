"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 text-gray-800">
      {/* Hero Section with Transparent Navigation */}
      <section className="relative h-[100vh] flex items-center overflow-hidden">
        {/* Navigation - now with scroll effect */}
        <nav className={`fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center transition-all duration-300 ${
          isScrolled ? "bg-amber-800/90 backdrop-blur-sm shadow-lg" : "bg-transparent"
        }`}>
          <div className={`text-2xl font-bold transition-colors duration-300 ${
            isScrolled ? "text-white" : "text-white drop-shadow-md"
          }`}>
            CustomK9 Kenya
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="#services" className={`transition-colors duration-300 ${
              isScrolled ? "text-white hover:text-amber-300" : "text-white hover:text-amber-300 drop-shadow-md"
            }`}>
              Services
            </Link>
            <Link href="#education" className={`transition-colors duration-300 ${
              isScrolled ? "text-white hover:text-amber-300" : "text-white hover:text-amber-300 drop-shadow-md"
            }`}>
              Education
            </Link>
            <Link href="#rehoming" className={`transition-colors duration-300 ${
              isScrolled ? "text-white hover:text-amber-300" : "text-white hover:text-amber-300 drop-shadow-md"
            }`}>
              Rehoming
            </Link>
            <Link href="#about" className={`transition-colors duration-300 ${
              isScrolled ? "text-white hover:text-amber-300" : "text-white hover:text-amber-300 drop-shadow-md"
            }`}>
              About
            </Link>
            <Link href="#contact" className={`transition-colors duration-300 ${
              isScrolled ? "text-white hover:text-amber-300" : "text-white hover:text-amber-300 drop-shadow-md"
            }`}>
              Contact
            </Link>
          </div>
          <button className="md:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>

        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black opacity-50 z-10"></div> {/* Increased opacity for better text contrast */}
          <div className="h-full w-full relative">
            {/* Enhanced placeholder for hero image - can be replaced with an actual image */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-800 to-amber-600 opacity-30"></div>
            <div className="absolute inset-0">
              {/* This is where you would add an actual image with Next.js Image component */}
              {/* Example:
              <Image 
                src="/images/hero-dog.jpg" 
                alt="Professional dog trainer with happy dog"
                layout="fill"
                objectFit="cover"
                priority
              />
              */}
              {/* For now using a better placeholder */}
              <div className="h-full w-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-10 text-[20rem]">
                      🐕
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Educating Kenya on <span className="text-amber-300">Dog Welfare</span> and <span className="text-amber-300">Positive Training</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Empowering owners with knowledge to build better relationships with their dogs through positive, humane methods.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#services" 
                className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors text-center">
                Explore Services
              </Link>
              <Link href="#contact" 
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-full transition-colors text-center">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-amber-800">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-amber-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-amber-800">Behavior Consultations</h3>
              <p className="text-gray-600">One-on-one sessions to address specific behavior challenges and develop personalized training plans.</p>
            </div>
            
            <div className="bg-amber-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-amber-800">Training Classes</h3>
              <p className="text-gray-600">Group classes focusing on positive reinforcement techniques for dogs of all ages and skill levels.</p>
            </div>
            
            <div className="bg-amber-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-amber-800">Kennel Inspection</h3>
              <p className="text-gray-600">Professional assessment of kennel facilities to ensure they meet welfare standards and provide recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 bg-amber-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-amber-800">Education Makes the Difference</h2>
              <p className="text-lg text-gray-700 mb-6">
                Educating owners results in better communication, better training, and better behavior from their dogs.
                By learning to read canine body language, owners can apply positive, humane methods to train their companions.
              </p>
              <ul className="space-y-4">
                {[
                  "Understand your dog's communication signals",
                  "Learn positive reinforcement techniques",
                  "Develop a stronger bond with your dog",
                  "Address behavioral issues humanely",
                  "Create a happier home for both of you"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-amber-600 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 relative h-80 md:h-96 rounded-xl overflow-hidden">
              {/* Placeholder for education image */}
              <div className="absolute inset-0 bg-amber-200 flex items-center justify-center">
                <span className="text-9xl opacity-20">🐕‍🦺</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rehoming Section */}
      <section id="rehoming" className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-amber-800">Rehoming Services</h2>
          <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
            We don't breed or sell dogs. Instead, we actively encourage spay and neuter to prevent unwanted litters and offer rehoming services to keep more dogs from ending up at the KSPCA.
          </p>
          
          <div className="bg-amber-50 p-8 rounded-xl max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Looking for a New Best Friend?</h3>
            <p className="mb-6">Check out our current dogs looking for loving homes</p>
            <Link href="#rehoming-gallery" 
              className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors inline-block">
              View Available Dogs
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-amber-800 text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Dog Owners Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                text: "The training methods I learned completely transformed my relationship with my dog. He's so much calmer and happier now.",
                name: "Maria K.",
                location: "Nairobi"
              },
              {
                text: "I never understood why my dog was behaving the way she did until our consultation. The insights were invaluable.",
                name: "James O.",
                location: "Mombasa"
              },
              {
                text: "The rehoming process was smooth and thorough. They really care about matching dogs with the right families.",
                name: "Sarah M.",
                location: "Nakuru"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-amber-700/50 p-8 rounded-xl">
                <p className="italic mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-full"></div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-amber-200">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-amber-50 rounded-xl p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl font-bold mb-6 text-amber-800 text-center">Get in Touch</h2>
            <p className="text-center mb-8 text-gray-700">
              Need a service not covered here? Have questions about dog behavior or training?
              We're here to help!
            </p>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                  <input type="text" id="name" className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                  <input type="email" id="email" className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
                <textarea id="message" rows={4} className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
              </div>
              <div className="text-center">
                <button type="submit" className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* About Section - Add this before the footer */}
      <section id="about" className="py-20 bg-amber-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-amber-800">About CustomK9 Kenya</h2>
          
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3 relative h-80 rounded-xl overflow-hidden shadow-lg">
              {/* Placeholder for profile image */}
              <div className="absolute inset-0 bg-amber-700/20 flex items-center justify-center">
                <span className="text-8xl opacity-20">👩‍🦱</span>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-4 text-amber-800">Our Mission</h3>
              <p className="text-lg text-gray-700 mb-6">
                At CustomK9 Kenya, my mission is to provide education about dogs and their welfare to residents of Kenya through various channels including one-on-one consultations, classes, and publications.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                I believe that educating people leads to better communication with their dogs, resulting in better training and behavior. When owners can read their dog's body language effectively, they can use positive, humane methods to train their companions.
              </p>
              <p className="text-lg text-gray-700">
                I do not breed or sell dogs, but instead actively work to prevent unwanted litters through education about spaying and neutering. My rehoming services aim to find loving homes for dogs in need, reducing the burden on animal shelters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-200 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">CustomK9 Kenya</h3>
              <p className="mb-4">Providing education about dogs and their welfare to residents of Kenya.</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Behavior Consultations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training Classes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kennel Inspection</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rehoming</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Articles</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seminars</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>info@customk9kenya.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>+254 123 456 789</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-amber-800 mt-12 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} CustomK9 Kenya. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
