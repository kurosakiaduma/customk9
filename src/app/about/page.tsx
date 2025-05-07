"use client";

import { useEffect } from "react";
import Image from "next/image";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";

export default function AboutPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for About Us */}
      <div className="relative h-[60vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about-hero.jpg"
            alt="Amy with her dogs"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          {/* Light text shadow container for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/15 to-transparent"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 h-full flex items-center relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              About Us
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Meet Amy, the passionate force behind CustomK9 Kenya, bringing decades of animal experience to dog training and education.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#amys-profile" 
                className="px-6 py-3 bg-white text-sky-700 hover:bg-sky-50 font-semibold rounded-full transition-colors shadow-md"
              >
                Learn More
              </a>
              <a 
                href="/booking" 
                className="px-6 py-3 bg-yellow-500 text-white hover:bg-yellow-400 font-bold rounded-full transition-colors shadow-xl animate-pulse hover:animate-none transform hover:scale-105 flex items-center"
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
      
      {/* Amy's Profile Section */}
      <section id="amys-profile" className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-sky-700 mb-8 text-center">Amy's Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="md:col-span-1">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <Image 
                    src="/images/amy-profile.jpg" 
                    alt="Amy with her dogs" 
                    width={400} 
                    height={500}
                    className="w-full object-cover"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg">
                  <p className="mb-4 text-gray-700 leading-relaxed">
                    Amy grew up on a game farm in Indiana, so her lifelong association with animals started at a very early age. Her horses ran with the zebra, camels, buffalo and llama. Amy was nearly kicked out of kindergarten for telling her classmates the story of watching her Vet castrate a stud horse while she watched in the barnyard. The kindergarten administration felt it was unsuitable and unladylike knowledge for a 5 year old as she was using correct anatomical terminology!
                  </p>
                  <p className="mb-4 text-gray-700 leading-relaxed">
                    Amy participated in 4-H with her horse and pony. Amy's family bred and raised working Australian Shepherds. She was also an active 4 year member of Future Farmers of America. Amy learned to judge crops, beef and dairy cattle as well as horses. After high school, Amy went to work for Radisson Hotels while attending Ivy Tech in Indianapolis, she then moved from The Radisson Plaza Hotel and Suites at Keystone at the Crossing, Indianapolis IN to the Radisson Mark Plaza Hotel in Alexandria, VA.
                  </p>
                  <p className="mb-4 text-gray-700 leading-relaxed">
                    Amy then became one of the 15 expatriates selected to move to Moscow, working on the opening team of the first American managed hotel in the Soviet Union, the Radisson Slavjanskaya Hotel. She was recruited by Ambassador Pickering, the American Ambassador to Russia as his Estate Manager at Spaso House. Amy oversaw all events at the residence and dachas, including 7 visits of the US President and Vice President.
                  </p>
                  <p className="mb-4 text-gray-700 leading-relaxed">
                    After a 15 year career in Hospitality Management, Amy took off her high heels and serious suits to work with animals again.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-sky-700 mb-4">Amy's Work with Dogs</h3>
              
              <p className="mb-4 text-gray-700 leading-relaxed">
                She also raised puppies for the CETC (Canine Enforcement Training Center) in Front Royal VA. Five of the 6 puppies she raised went on to detect drugs and currency for US Customs and Border Patrol. Amy found the East African Kennel Club just days after her arrival and she has been an active member ever since. She also belongs to the Labrador Retriever Club of Kenya and the Ladies Kennel Association.
              </p>
              
              <p className="mb-4 text-gray-700 leading-relaxed">
                She teaches the Wednesday morning socialization class for the Labrador Club, the beginner's obedience class on Saturday afternoons run by the German Shepard Dog League and has recently started teaching a communication class for the Kenya Police Dog Section for the new dog handling recruits. Amy has worked with the staff at the KSPCA to train dogs for their annual Shaggy Dog show so that they may showcase dogs that are up for adoption.
              </p>
              
              <p className="mb-4 text-gray-700 leading-relaxed">
                Amy enjoys camping and frequently camps with the Labrador Retriever Club.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Amy arrived in Kenya with her yellow Lab that was a US Customs dog (yes, she kept her only "failed" pup) The Labrador has since passed on so now her dogs are an adolescent Rottweiler and a lovable Kenyan Shepherd AKA a shenzi dog that was born in Karura forest.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 