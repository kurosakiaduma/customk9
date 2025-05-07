"use client";

import { useEffect, useState } from "react";
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

// Categories for filter buttons
const categories = ["All", "Behavior", "Training", "Puppies", "Breeds", "Health"];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter posts based on category and search query
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* Custom Hero Section for Blog */}
      <div className="relative h-[70vh] overflow-hidden">
        <Navigation />
        
        {/* Background Image without Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dog-education-blog.jpg"
            alt="Dog education blog"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          {/* Light text shadow container for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/15 to-transparent"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 h-full flex items-center relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Our Dog Education Blog
              </h1>
              <p className="text-xl text-white mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] max-w-xl">
                Expert advice, training tips, and insights to help you build a stronger relationship with your canine companion.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#latest-articles" className="px-6 py-3 bg-white text-sky-700 hover:bg-sky-50 font-semibold rounded-full transition-colors shadow-md">
                  Read Latest Articles
                </a>
                <a href="#categories" className="px-6 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold rounded-full transition-colors shadow-md">
                  Browse Categories
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
            
            {/* Featured Article Preview */}
            <div className="hidden lg:block">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl transform hover:scale-[1.02] transition-transform">
                <div className="flex items-center mb-4">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-medium">Featured Post</span>
                  <span className="ml-auto text-gray-500 text-sm">{blogPosts[0].date}</span>
                </div>
                <h2 className="text-2xl font-bold text-sky-800 mb-2">{blogPosts[0].title}</h2>
                <p className="text-gray-600 mb-4">{blogPosts[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center mr-2">
                      <span className="text-sky-700 font-bold">{blogPosts[0].author.split(" ")[0][0]}{blogPosts[0].author.split(" ")[1][0]}</span>
                    </div>
                    <span className="text-gray-700 text-sm">{blogPosts[0].author}</span>
                  </div>
                  <Link href={`/blog/${blogPosts[0].id}`} className="text-sky-600 hover:text-sky-800 font-medium">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Latest Articles Section */}
      <section id="latest-articles" className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <h2 className="text-3xl font-bold text-sky-700 mb-6 md:mb-0">Latest Articles</h2>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div id="categories" className="mb-12 flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === "all" ? "bg-sky-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              All Articles
            </button>
            <button 
              onClick={() => setSelectedCategory("Behavior")}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === "Behavior" ? "bg-sky-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Behavior
            </button>
            <button 
              onClick={() => setSelectedCategory("Training")}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === "Training" ? "bg-sky-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Training
            </button>
            <button 
              onClick={() => setSelectedCategory("Puppies")}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === "Puppies" ? "bg-sky-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Puppies
            </button>
            <button 
              onClick={() => setSelectedCategory("Breeds")}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === "Breeds" ? "bg-sky-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Breeds
            </button>
            <button 
              onClick={() => setSelectedCategory("Health")}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === "Health" ? "bg-sky-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Health & Nutrition
            </button>
          </div>
          
          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link 
                  href={`/blog/${post.id}`} 
                  key={post.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={post.imageSrc}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-sky-800 rounded-full text-xs font-medium capitalize">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-sky-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center mr-2">
                        <span className="text-sky-700 font-bold">
                          {post.author.split(" ")[0][0]}{post.author.split(" ")[1][0]}
                        </span>
                      </div>
                      <span className="text-gray-700 text-sm">{post.author}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-xl">
              <p className="text-xl text-gray-500 mb-4">No articles found matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(""); setSelectedCategory("all");}}
                className="px-6 py-3 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
          
          {/* Load More Button */}
          {filteredPosts.length > 5 && (
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 transition-colors shadow-md">
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}