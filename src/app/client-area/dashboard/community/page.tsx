"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Define types for the community forum
interface ForumUser {
  id: number;
  name: string;
  avatar: string;
  role: "member" | "trainer" | "admin";
  joined: string;
  postCount: number;
}

interface ForumPost {
  id: number;
  title: string;
  content: string;
  date: string;
  author: ForumUser;
  likes: number;
  replies: number;
  category: string;
  tags: string[];
  isPinned?: boolean;
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  postCount: number;
  icon: string;
}

// Sample data for community forum
const forumUsers: ForumUser[] = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/images/dog-01.jpg", // Using dog images as placeholders
    role: "member",
    joined: "2024-01-15",
    postCount: 12
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "/images/dog-with-owner.jpg",
    role: "trainer",
    joined: "2023-06-20",
    postCount: 45
  },
  {
    id: 3,
    name: "Michael Clark",
    avatar: "/images/testimonial-james.jpg",
    role: "trainer",
    joined: "2023-08-10",
    postCount: 32
  },
  {
    id: 4,
    name: "Emily Wilson",
    avatar: "/images/testimonial-maria.jpg",
    role: "trainer",
    joined: "2023-11-05",
    postCount: 28
  },
  {
    id: 5,
    name: "CustomK9 Admin",
    avatar: "/images/amy-profile.jpg",
    role: "admin",
    joined: "2023-01-01",
    postCount: 87
  }
];

const forumCategories: ForumCategory[] = [
  {
    id: "training-tips",
    name: "Training Tips",
    description: "Share and discuss training techniques and tips for different breeds and behaviors.",
    postCount: 128,
    icon: "training"
  },
  {
    id: "behavior-issues",
    name: "Behavior Issues",
    description: "Get help with common and uncommon dog behavior problems.",
    postCount: 95,
    icon: "behavior"
  },
  {
    id: "puppies",
    name: "Puppy Corner",
    description: "Advice and discussions for new puppy owners.",
    postCount: 87,
    icon: "puppy"
  },
  {
    id: "health-nutrition",
    name: "Health & Nutrition",
    description: "Discuss diet, health concerns, and wellness for your dog.",
    postCount: 76,
    icon: "health"
  },
  {
    id: "success-stories",
    name: "Success Stories",
    description: "Share your training success stories and celebrate achievements.",
    postCount: 54,
    icon: "star"
  },
  {
    id: "general-discussion",
    name: "General Discussion",
    description: "For all other dog-related topics and community chat.",
    postCount: 110,
    icon: "chat"
  }
];

const forumPosts: ForumPost[] = [
  {
    id: 1,
    title: "How did you handle leash reactivity?",
    content: "My 18-month German Shepherd has started barking at other dogs when on leash. We've tried...",
    date: "2024-07-12T14:30:00",
    author: forumUsers[0],
    likes: 8,
    replies: 12,
    category: "behavior-issues",
    tags: ["leash-training", "reactivity", "german-shepherd"],
    isPinned: false
  },
  {
    id: 2,
    title: "Welcome to the CustomK9 Community Forum!",
    content: "We're excited to have you join our community of dog lovers and trainers. This is a space where...",
    date: "2024-06-01T10:00:00",
    author: forumUsers[4],
    likes: 42,
    replies: 15,
    category: "general-discussion",
    tags: ["welcome", "community-rules"],
    isPinned: true
  },
  {
    id: 3,
    title: "Best treats for positive reinforcement?",
    content: "I'm looking for recommendations on high-value treats that aren't too unhealthy. My Lab...",
    date: "2024-07-14T09:15:00",
    author: forumUsers[0],
    likes: 15,
    replies: 20,
    category: "training-tips",
    tags: ["treats", "positive-reinforcement", "labrador"],
    isPinned: false
  },
  {
    id: 4,
    title: "Monthly Training Challenge: Recall from Distractions",
    content: "This month's training challenge focuses on improving your dog's recall even with distractions...",
    date: "2024-07-01T11:30:00",
    author: forumUsers[1],
    likes: 27,
    replies: 18,
    category: "training-tips",
    tags: ["recall", "challenge", "distraction-training"],
    isPinned: true
  },
  {
    id: 5,
    title: "Introducing new puppy to resident dog",
    content: "We're bringing home a new puppy next week and I'm nervous about introducing her to our 3-year old...",
    date: "2024-07-13T16:45:00",
    author: forumUsers[0],
    likes: 11,
    replies: 14,
    category: "puppies",
    tags: ["introductions", "multi-dog-household"],
    isPinned: false
  },
  {
    id: 6,
    title: "From fearful to confident - Our journey",
    content: "I wanted to share our story about how training has transformed my rescue dog from fearful to confident...",
    date: "2024-07-10T13:20:00",
    author: forumUsers[0],
    likes: 31,
    replies: 8,
    category: "success-stories",
    tags: ["rescue", "confidence", "success-story"],
    isPinned: false
  }
];

// Format the date nicely
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

// Icon component for categories
const CategoryIcon = ({ name }: { name: string }) => {
  switch (name) {
    case "training":
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
      );
    case "behavior":
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      );
    case "puppy":
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      );
    case "health":
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      );
    case "star":
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
      );
    case "chat":
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
      );
  }
};

// Forum post card component
const PostCard = ({ post }: { post: ForumPost }) => {
  const getRoleBadge = (role: string) => {
    switch(role) {
      case "trainer":
        return (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium ml-2">
            Trainer
          </span>
        );
      case "admin":
        return (
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium ml-2">
            Admin
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className={`p-4 bg-white border border-gray-200 rounded-lg ${post.isPinned ? 'border-l-4 border-l-amber-500' : ''}`}>
      {post.isPinned && (
        <div className="flex items-center text-amber-600 text-sm mb-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
          </svg>
          Pinned Post
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg hover:text-sky-700 transition-colors">
          <Link href={`/client-area/dashboard/community/post/${post.id}`}>
            {post.title}
          </Link>
        </h3>
        <span className="text-xs text-gray-500">
          {formatDate(post.date)}
        </span>
      </div>
      
      <p className="text-gray-600 mt-2 mb-3 text-sm line-clamp-2">
        {post.content}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              sizes="24px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <span className="text-sm text-gray-700">
            {post.author.name}
            {getRoleBadge(post.author.role)}
          </span>
        </div>
        
        <div className="flex text-xs text-gray-500 space-x-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            {post.replies} replies
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            {post.likes} likes
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
        {post.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 cursor-pointer">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Filter posts based on search term and selected category
  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort posts to show pinned posts first
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-sky-800">Community Forum</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar with categories */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search discussions..."
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
          
          {/* New Post Button */}
          <button
            className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"></path>
            </svg>
            New Discussion
          </button>
          
          {/* Categories */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 bg-sky-50 border-b border-gray-200">
              <h2 className="font-semibold text-sky-800">Categories</h2>
            </div>
            <div className="p-2">
              <button
                className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                  selectedCategory === "all" ? "bg-sky-100 text-sky-700" : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory("all")}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
                All Categories
              </button>
              
              {forumCategories.map(category => (
                <button
                  key={category.id}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                    selectedCategory === category.id ? "bg-sky-100 text-sky-700" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="mr-2 text-gray-600">
                    <CategoryIcon name={category.icon} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-medium truncate">{category.name}</div>
                    <div className="text-xs text-gray-500">{category.postCount} posts</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-3 space-y-4">
          {filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {sortedPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No discussions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or start a new discussion.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSearchTerm("");
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
    </div>
  );
} 