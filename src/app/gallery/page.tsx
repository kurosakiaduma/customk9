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

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      <div className="h-[30vh] bg-gradient-to-b from-sky-700 to-sky-500 relative">
        <Navigation />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">Gallery</h1>
        </div>
      </div>
      
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-sky-700 text-center">Our Dogs in Action</h2>
            
            {/* Masonry Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`relative ${
                    index % 3 === 0 ? 'row-span-2' : ''
                  } overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
                  onClick={() => setSelectedImage(image.src)}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
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