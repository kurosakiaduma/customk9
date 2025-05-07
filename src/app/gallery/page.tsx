"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";

// This could be moved to a data file later
const galleryImages = [
  { src: "/images/dog-01.jpg", alt: "Dog image 1", width: 600, height: 400 },
  { src: "/images/dog-02.jpg", alt: "Dog image 2", width: 600, height: 800 },
  { src: "/images/dog-03.jpg", alt: "Dog image 3", width: 600, height: 600 },
  { src: "/images/dog-04.jpg", alt: "Dog image 4", width: 600, height: 400 },
  { src: "/images/dog-05.jpg", alt: "Dog image 5", width: 600, height: 800 },
  { src: "/images/dog-06.jpg", alt: "Dog image 6", width: 600, height: 400 },
  { src: "/images/dog-07.jpg", alt: "Dog image 7", width: 600, height: 400 },
  { src: "/images/dog-08.jpg", alt: "Dog image 8", width: 600, height: 600 },
  { src: "/images/dog-09.jpg", alt: "Dog image 9", width: 600, height: 800 },
  { src: "/images/dog-10.jpg", alt: "Dog image 10", width: 600, height: 400 },
  { src: "/images/dog-11.jpg", alt: "Dog image 11", width: 600, height: 600 },
  { src: "/images/dog-12.jpg", alt: "Dog image 12", width: 600, height: 400 },
];

// Featured gallery images for hero section
const featuredImages = galleryImages.slice(0, 5);

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredImages = activeFilter === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.alt.includes(activeFilter));

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Gallery */}
      <div className="relative h-[50vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery-hero.jpg"
            alt="Dog training gallery"
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
              Our Training Gallery
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
              Browse through photos and videos of our successful training programs, happy dogs, and proud owners.
            </p>
            <a 
              href="#main-gallery" 
              className="px-6 py-3 bg-white text-sky-700 hover:bg-sky-50 font-semibold rounded-full transition-colors shadow-md"
            >
              Explore Gallery
            </a>
          </div>
        </div>
      </div>
      
      {/* Main Gallery Content */}
      <section id="main-gallery" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-sky-700 mb-8 text-center">Dog Training Photo Gallery</h2>
          
          {/* Gallery Filters */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === "all" ? "bg-sky-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              All Photos
            </button>
            <button 
              onClick={() => setActiveFilter("training")}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === "training" ? "bg-sky-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Training
            </button>
            <button 
              onClick={() => setActiveFilter("classes")}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === "classes" ? "bg-sky-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Classes
            </button>
            <button 
              onClick={() => setActiveFilter("puppies")}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === "puppies" ? "bg-sky-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Puppies
            </button>
            <button 
              onClick={() => setActiveFilter("events")}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === "events" ? "bg-sky-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Events
            </button>
          </div>
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div 
                key={image.src} 
                className="rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 group bg-white"
              >
                <div className="relative h-64">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-700 font-medium">{image.alt}</p>
                  <span className="inline-block px-2 py-1 bg-sky-100 text-sky-700 text-xs rounded-full mt-2 capitalize">
                    {activeFilter === "all" ? "gallery" : activeFilter}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 mb-4">No images found for this category.</p>
              <button 
                onClick={() => setActiveFilter("all")}
                className="px-6 py-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors"
              >
                View All Images
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={selectedImage}
              alt="Selected image"
              fill
              sizes="90vw"
              style={{ objectFit: 'contain' }}
            />
            <button 
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
} 