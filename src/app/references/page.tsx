"use client";

import { useEffect } from "react";
import Image from "next/image";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";
import TestimonialsSection from "../components/sections/TestimonialsSection";

export default function ReferencesPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for References */}
      <div className="relative h-[60vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/happy-dogs-owners.jpg"
            alt="Happy dogs with their owners"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          {/* Light text shadow container for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/15 to-transparent"></div>
        </div>
        
        {/* Hero Content with Quote Marks */}
        <div className="container mx-auto px-6 h-full flex items-center justify-center text-center relative z-10">
          {/* Decorative Quote Mark - Top Left */}
          <div className="absolute top-12 left-12 opacity-20 hidden md:block">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 6C7.5 8 6 10.5 6 13.5C6 17 8.5 19.5 12 19.5C15.5 19.5 18 17 18 13.5C18 11.5 16.5 9.5 14.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* Decorative Quote Mark - Bottom Right */}
          <div className="absolute bottom-12 right-12 opacity-20 hidden md:block">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5 18C16.5 16 18 13.5 18 10.5C18 7 15.5 4.5 12 4.5C8.5 4.5 6 7 6 10.5C6 12.5 7.5 14.5 9.5 15.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              What Our Clients Say
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-2xl mx-auto">
              Discover the experiences of dog owners who have transformed their relationship with their pets through our professional training programs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#testimonials" className="px-6 py-3 bg-white text-sky-700 hover:bg-sky-50 font-semibold rounded-full transition-colors shadow-md">
                Read Testimonials
              </a>
              <a href="#professional-references" className="px-6 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold rounded-full transition-colors shadow-md">
                Professional References
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Client Testimonials Section */}
      <section id="testimonials" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-sky-700 mb-12 text-center">Client Testimonials</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <Image 
                    src="/images/client1.jpg" 
                    alt="Sarah M." 
                    width={64} 
                    height={64}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Sarah M.</h3>
                  <p className="text-gray-600">German Shepherd Owner</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "I was struggling with my German Shepherd's leash reactivity for months. After just 4 weeks with CustomK9, the transformation was incredible. Max is now calm and confident on our walks!"
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <Image 
                    src="/images/client2.jpg" 
                    alt="John D." 
                    width={64} 
                    height={64}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">John D.</h3>
                  <p className="text-gray-600">Labrador Retriever Owner</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The puppy training class was exactly what we needed for our energetic lab. The trainers were patient and knowledgeable, and the structured approach made training fun for both of us."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <Image 
                    src="/images/client3.jpg" 
                    alt="Maria L." 
                    width={64} 
                    height={64}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Maria L.</h3>
                  <p className="text-gray-600">Mixed Breed Rescue Owner</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "I adopted a rescue with severe anxiety issues. The behavior consultation was eye-opening and gave me practical tools to help my dog feel secure. Three months later, she's like a different dog!"
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a href="/contact" className="inline-block px-8 py-3 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 transition-colors shadow-lg">
              Share Your Experience
            </a>
          </div>
        </div>
      </section>
      
      {/* Professional References Section */}
      <section id="professional-references" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-sky-700 mb-12 text-center">Professional References</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vet Reference */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <svg className="w-12 h-12 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-sky-700">Dr. Emily Johnson, DVM</h3>
                  <p className="text-gray-600">Nairobi Veterinary Clinic</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "As a veterinarian, I regularly refer clients to CustomK9 when they need behavioral training. Their methods are humane, science-based, and effective. I've seen remarkable improvements in many of my canine patients after working with their trainers."
              </p>
              <div className="flex justify-end">
                <a href="#" className="text-sky-600 hover:text-sky-800 font-medium">View Full Recommendation</a>
              </div>
            </div>
            
            {/* Animal Behaviorist Reference */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <svg className="w-12 h-12 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-sky-700">Mark Kimani, Ph.D.</h3>
                  <p className="text-gray-600">Certified Animal Behaviorist</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "I've collaborated with CustomK9 on several complex cases involving severe behavioral issues. Their approach is thorough, and they excel at creating individualized training plans that address the root causes of problematic behaviors."
              </p>
              <div className="flex justify-end">
                <a href="#" className="text-sky-600 hover:text-sky-800 font-medium">View Full Recommendation</a>
              </div>
            </div>
            
            {/* Local Rescue Reference */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <svg className="w-12 h-12 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-sky-700">Nairobi Dog Rescue</h3>
                  <p className="text-gray-600">Local Animal Shelter</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "CustomK9 has been an invaluable partner to our rescue organization. They provide pro bono training for many of our harder-to-adopt dogs, significantly improving their adoption prospects. Their commitment to dog welfare aligns perfectly with our mission."
              </p>
              <div className="flex justify-end">
                <a href="#" className="text-sky-600 hover:text-sky-800 font-medium">View Full Recommendation</a>
              </div>
            </div>
            
            {/* Professional Dog Handler Reference */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <svg className="w-12 h-12 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-sky-700">James Omondi</h3>
                  <p className="text-gray-600">Professional K9 Competition Handler</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "As someone who works with elite competition dogs, I have high standards for trainers. CustomK9's techniques are sophisticated and adaptable for all levels, from basic obedience to advanced skills. They understand the science of canine learning."
              </p>
              <div className="flex justify-end">
                <a href="#" className="text-sky-600 hover:text-sky-800 font-medium">View Full Recommendation</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 