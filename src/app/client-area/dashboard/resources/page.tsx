"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Define resource type
interface Resource {
  id: number;
  title: string;
  description: string;
  type: "video" | "article" | "guide" | "webinar";
  category: "basic-training" | "behavior" | "nutrition" | "health" | "puppies";
  thumbnail: string;
  url: string;
  duration?: string; // For videos and webinars
  dateAdded: string;
  featured: boolean;
}

// Sample resources data
const resourcesData: Resource[] = [
  {
    id: 1,
    title: "Basic Commands Every Dog Should Know",
    description: "Learn the essential commands that form the foundation of good dog behavior, including sit, stay, come, and heel.",
    type: "video",
    category: "basic-training",
    thumbnail: "/images/dog-01.jpg",
    url: "#video-1",
    duration: "15:24",
    dateAdded: "2024-06-15",
    featured: true
  },
  {
    id: 2,
    title: "Understanding Leash Reactivity",
    description: "Discover the causes of leash reactivity and proven techniques to help your dog stay calm when meeting other dogs on walks.",
    type: "article",
    category: "behavior",
    thumbnail: "/images/dog-02.jpg",
    url: "#article-1",
    dateAdded: "2024-06-10",
    featured: true
  },
  {
    id: 3,
    title: "Puppy Socialization Checklist",
    description: "A comprehensive guide to properly socialize your puppy during the critical early months to ensure a well-adjusted adult dog.",
    type: "guide",
    category: "puppies",
    thumbnail: "/images/dog-03.jpg",
    url: "#guide-1",
    dateAdded: "2024-06-05",
    featured: false
  },
  {
    id: 4,
    title: "Choosing the Right Food for Your Dog",
    description: "Learn how to decode dog food labels and choose the most nutritious option for your pet's specific needs.",
    type: "article",
    category: "nutrition",
    thumbnail: "/images/dog-04.jpg",
    url: "#article-2",
    dateAdded: "2024-05-28",
    featured: false
  },
  {
    id: 5,
    title: "Managing Separation Anxiety",
    description: "Strategies and training techniques to help dogs who suffer from separation anxiety when left alone.",
    type: "video",
    category: "behavior",
    thumbnail: "/images/dog-with-owner.jpg",
    url: "#video-2",
    duration: "22:17",
    dateAdded: "2024-05-20",
    featured: false
  },
  {
    id: 6,
    title: "Canine First Aid Essentials",
    description: "Learn the basics of canine first aid to be prepared for common emergencies until you can reach veterinary care.",
    type: "webinar",
    category: "health",
    thumbnail: "/images/testimonial-james.jpg",
    url: "#webinar-1",
    duration: "45:00",
    dateAdded: "2024-05-15",
    featured: true
  },
  {
    id: 7,
    title: "Advanced Recall Training",
    description: "Take your dog's recall to the next level with these advanced techniques for reliable off-leash control.",
    type: "video",
    category: "basic-training",
    thumbnail: "/images/testimonial-maria.jpg",
    url: "#video-3",
    duration: "18:45",
    dateAdded: "2024-05-10",
    featured: false
  },
  {
    id: 8,
    title: "Crate Training: Step by Step",
    description: "A comprehensive guide to crate training your dog for both house training and creating a safe personal space.",
    type: "guide",
    category: "puppies",
    thumbnail: "/images/amy-profile.jpg",
    url: "#guide-2",
    dateAdded: "2024-05-05",
    featured: false
  },
];

// Type and category information with display names and icons
const resourceTypes = [
  { value: "all", label: "All Types", icon: "grid" },
  { value: "video", label: "Videos", icon: "video" },
  { value: "article", label: "Articles", icon: "document" },
  { value: "guide", label: "Guides", icon: "book" },
  { value: "webinar", label: "Webinars", icon: "presentation" }
];

const resourceCategories = [
  { value: "all", label: "All Categories", icon: "tag" },
  { value: "basic-training", label: "Basic Training", icon: "training" },
  { value: "behavior", label: "Behavior", icon: "behavior" },
  { value: "nutrition", label: "Nutrition", icon: "food" },
  { value: "health", label: "Health & Wellness", icon: "health" },
  { value: "puppies", label: "Puppies", icon: "puppy" }
];

// Icon component
const Icon = ({ name }: { name: string }) => {
  switch (name) {
    case "grid":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
      );
    case "video":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      );
    case "document":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      );
    case "book":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      );
    case "presentation":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
        </svg>
      );
    case "tag":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
        </svg>
      );
    case "training":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
      );
    case "behavior":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      );
    case "food":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      );
    case "health":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      );
    case "puppy":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      );
    default:
      return null;
  }
};

// Resource card component
const ResourceCard = ({ resource }: { resource: Resource }) => {
  const getTypeLabel = (type: string) => {
    const typeObj = resourceTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };
  
  const getCategoryLabel = (category: string) => {
    const categoryObj = resourceCategories.find(c => c.value === category);
    return categoryObj ? categoryObj.label : category;
  };
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case "video":
        return (
          <div className="absolute left-3 top-3 bg-sky-800/70 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <Icon name="video" />
            <span className="ml-1">Video</span>
          </div>
        );
      case "webinar":
        return (
          <div className="absolute left-3 top-3 bg-purple-800/70 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <Icon name="presentation" />
            <span className="ml-1">Webinar</span>
          </div>
        );
      case "article":
        return (
          <div className="absolute left-3 top-3 bg-green-800/70 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <Icon name="document" />
            <span className="ml-1">Article</span>
          </div>
        );
      case "guide":
        return (
          <div className="absolute left-3 top-3 bg-amber-800/70 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <Icon name="book" />
            <span className="ml-1">Guide</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <Image
          src={resource.thumbnail}
          alt={resource.title}
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
        />
        {getTypeIcon(resource.type)}
        
        {resource.featured && (
          <div className="absolute right-3 top-3 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            Featured
          </div>
        )}
        
        {resource.duration && (
          <div className="absolute right-3 bottom-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
            {resource.duration}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span className="bg-gray-100 rounded-full px-2 py-1 mr-2">
            {getCategoryLabel(resource.category)}
          </span>
          <span>{formatDate(resource.dateAdded)}</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{resource.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>
        
        <Link
          href={resource.url}
          className="inline-flex items-center text-sky-600 hover:text-sky-800 font-medium text-sm"
        >
          {resource.type === 'video' || resource.type === 'webinar' ? 'Watch Now' : 'Read More'} 
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Filter resources based on search term, type, and category
  const filteredResources = resourcesData.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || resource.type === selectedType;
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });
  
  // Get featured resources
  const featuredResources = resourcesData.filter(resource => resource.featured);
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-sky-800">Training Resources</h1>
      
      {/* Featured Resources Carousel */}
      {featuredResources.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredResources.slice(0, 3).map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          {/* Type Filter */}
          <div>
            <select
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {resourceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Category Filter */}
          <div>
            <select
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {resourceCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Resource List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">All Resources</h2>
          <p className="text-gray-600 text-sm">{filteredResources.length} resources found</p>
        </div>
        
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No resources found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                  setSelectedCategory("all");
                }}
                className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700 transition-colors inline-flex items-center"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 