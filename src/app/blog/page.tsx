"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; 
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";

// This could be moved to a data file later
const blogPosts = [
  {
    id: "understanding-dog-body-language",
    title: "Understanding Dog Body Language: What Your Dog Is Trying to Tell You",
    excerpt: "Dogs communicate primarily through body language. Learn how to interpret your dog's signals to better understand their needs and emotions.",
    date: "May 5, 2023",
    author: "Jane Muraya",
    category: "Behavior",
    imageSrc: "/images/dog-01.jpg",
  },
  {
    id: "positive-reinforcement-training",
    title: "The Power of Positive Reinforcement in Dog Training",
    excerpt: "Discover why positive reinforcement is more effective than punishment-based methods and how to implement it in your training routine.",
    date: "April 18, 2023",
    author: "David Omondi",
    category: "Training",
    imageSrc: "/images/dog-03.jpg",
  },
  {
    id: "puppy-socialization",
    title: "Puppy Socialization: Building Confidence in Critical Periods",
    excerpt: "The first few months of a puppy's life are crucial for socialization. Learn how to safely expose your puppy to new experiences.",
    date: "March 29, 2023",
    author: "Sarah Njeri",
    category: "Puppies",
    imageSrc: "/images/dog-05.jpg",
  },
  {
    id: "kenyan-dog-breeds",
    title: "Popular Dog Breeds in Kenya and Their Care Requirements",
    excerpt: "From German Shepherds to Rhodesian Ridgebacks, learn about the most common dog breeds in Kenya and their specific care needs.",
    date: "March 15, 2023",
    author: "James Kiprop",
    category: "Breeds",
    imageSrc: "/images/dog-07.jpg",
  },
  {
    id: "separation-anxiety",
    title: "Managing Separation Anxiety in Dogs",
    excerpt: "Separation anxiety is common in dogs, especially after periods of constant togetherness. Here's how to help your dog feel secure when alone.",
    date: "February 22, 2023",
    author: "Jane Muraya",
    category: "Behavior",
    imageSrc: "/images/dog-09.jpg",
  },
  {
    id: "nutrition-kenyan-dogs",
    title: "Optimal Nutrition for Dogs in Kenya",
    excerpt: "A guide to feeding your dog well in Kenya, including locally available options and how to ensure a balanced diet despite import challenges.",
    date: "February 10, 2023",
    author: "David Omondi",
    category: "Health",
    imageSrc: "/images/dog-11.jpg",
  },
];

export default function BlogPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      <div className="h-[30vh] bg-gradient-to-b from-sky-700 to-sky-500 relative">
        <Navigation />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">Blog</h1>
        </div>
      </div>
      
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-sky-700">Latest Articles</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent w-full md:w-64"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group">
                  <Link href={`/blog/${post.id}`}>
                    <div className="relative h-48">
                      <Image
                        src={post.imageSrc}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="absolute bottom-4 left-4 bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-full">{post.category}</span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span>{post.author}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-sky-600 transition-colors">{post.title}</h3>
                      <p className="text-gray-600">{post.excerpt}</p>
                      <div className="mt-4 flex items-center text-sky-600 font-medium">
                        Read More
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              <button className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors text-center shadow-lg">
                Load More Articles
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}