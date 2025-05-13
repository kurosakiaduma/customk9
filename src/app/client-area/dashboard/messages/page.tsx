"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Define types for our messages
interface Message {
  id: number;
  text: string;
  timestamp: string;
  isFromUser: boolean;
}

interface Sender {
  id: number;
  name: string;
  role: string;
  avatar: string;
  status: string;
}

interface Conversation {
  id: number;
  sender: Sender;
  messages: Message[];
  lastMessage: string;
  unread: boolean;
  subject: string;
}

// Sample data for messages
const dummyMessages: Conversation[] = [
  {
    id: 1,
    sender: {
      id: 101,
      name: "Sarah Johnson",
      role: "Trainer",
      avatar: "/images/dog-with-owner.jpg", // Using an existing image as placeholder
      status: "online",
    },
    messages: [
      {
        id: 1001,
        text: "Hi John! I wanted to update you on Max's progress. He's doing great with the recall command, even in environments with mild distractions. We should work on extending the distance next session.",
        timestamp: "2024-07-14T10:30:00",
        isFromUser: false,
      },
      {
        id: 1002,
        text: "That's great to hear! He's been practicing at home too. I've noticed he responds better when I use a higher-pitched voice.",
        timestamp: "2024-07-14T11:15:00",
        isFromUser: true,
      },
      {
        id: 1003,
        text: "Good observation! Dogs often respond better to higher pitches. Keep using that technique. For our next session, can you bring some of his favorite high-value treats? We'll use them for the distance recall exercises.",
        timestamp: "2024-07-14T11:20:00",
        isFromUser: false,
      }
    ],
    lastMessage: "2024-07-14T11:20:00",
    unread: true,
    subject: "Training Progress Update",
  },
  {
    id: 2,
    sender: {
      id: 102,
      name: "CustomK9 Kenya",
      role: "Admin",
      avatar: "/images/amy-profile.jpg", // Using an existing image as placeholder
      status: "offline",
    },
    messages: [
      {
        id: 2001,
        text: "Hello John, we're excited to let you know that we've added new training videos to our resource library. These videos focus on leash reactivity and can help with Bella's training.",
        timestamp: "2024-07-13T15:00:00",
        isFromUser: false,
      },
      {
        id: 2002,
        text: "You can access these videos from the Resources section of your dashboard once it's fully implemented. We hope you find them useful!",
        timestamp: "2024-07-13T15:01:00",
        isFromUser: false,
      }
    ],
    lastMessage: "2024-07-13T15:01:00",
    unread: false,
    subject: "New Resources Available",
  },
  {
    id: 3,
    sender: {
      id: 103,
      name: "Michael Clark",
      role: "Trainer",
      avatar: "/images/testimonial-james.jpg", // Using an existing image as placeholder
      status: "offline",
    },
    messages: [
      {
        id: 3001,
        text: "Hi John, I wanted to confirm our upcoming private behavior consultation for Bella scheduled for Friday at 2:00 PM at your home.",
        timestamp: "2024-07-12T09:45:00",
        isFromUser: false,
      },
      {
        id: 3002,
        text: "Thanks for confirming. Is there anything I should prepare before the session?",
        timestamp: "2024-07-12T10:30:00",
        isFromUser: true,
      },
      {
        id: 3003,
        text: "Great question! Please have some of Bella's favorite toys and treats available. Also, try to document any specific behaviors you'd like to address, including when they typically occur. This will help us make the most of our session time.",
        timestamp: "2024-07-12T11:15:00",
        isFromUser: false,
      },
      {
        id: 3004,
        text: "Will do! She's been showing some anxiety when visitors arrive, so that's definitely something I want to focus on.",
        timestamp: "2024-07-12T11:30:00",
        isFromUser: true,
      }
    ],
    lastMessage: "2024-07-12T11:30:00",
    unread: false,
    subject: "Upcoming Consultation Confirmation",
  },
  {
    id: 4,
    sender: {
      id: 104,
      name: "Emily Wilson",
      role: "Trainer",
      avatar: "/images/testimonial-maria.jpg", // Using an existing image as placeholder
      status: "online",
    },
    messages: [
      {
        id: 4001,
        text: "Hello John, I'll be leading the socialization class that Rocky is scheduled to attend on July 25th. I wanted to introduce myself and provide some information about what to expect.",
        timestamp: "2024-07-10T14:20:00",
        isFromUser: false,
      }
    ],
    lastMessage: "2024-07-10T14:20:00",
    unread: true,
    subject: "Introduction and Class Information",
  }
];

// Format the timestamp to a readable format
const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format the date for message groups
const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

// Get time passed since the message was sent
const getTimePassed = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} hours ago`;
  } else if (diffInMinutes < 2880) {
    return 'Yesterday';
  } else {
    return formatDate(timestamp);
  }
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(dummyMessages);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Set the first conversation as selected by default
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => 
    conv.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Mark conversation as read when selected
  const handleConversationSelect = (conversation: Conversation): void => {
    if (conversation.unread) {
      const updatedConversations = conversations.map(conv => 
        conv.id === conversation.id ? { ...conv, unread: false } : conv
      );
      setConversations(updatedConversations);
    }
    setSelectedConversation(conversation);
  };
  
  // Send a new message
  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;
    
    const updatedMessage: Message = {
      id: Date.now(),
      text: newMessage,
      timestamp: new Date().toISOString(),
      isFromUser: true,
    };
    
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedConversation.id 
        ? { 
            ...conv, 
            messages: [...conv.messages, updatedMessage],
            lastMessage: updatedMessage.timestamp
          } 
        : conv
    );
    
    setConversations(updatedConversations);
    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, updatedMessage],
      lastMessage: updatedMessage.timestamp
    });
    setNewMessage('');
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-sky-800">Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(80vh-100px)]">
        {/* Conversations List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
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
          </div>
          
          {/* Conversations */}
          <div className="overflow-y-auto h-[calc(80vh-170px)]">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conversation => (
                <button
                  key={conversation.id}
                  className={`w-full px-4 py-3 flex items-start border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                    selectedConversation?.id === conversation.id ? 'bg-sky-50' : ''
                  }`}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <div className="relative flex-shrink-0 mr-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={conversation.sender.avatar}
                        alt={conversation.sender.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    {conversation.sender.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className={`font-medium truncate ${conversation.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {conversation.sender.name}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {getTimePassed(conversation.lastMessage)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.subject}</p>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {conversation.messages[conversation.messages.length - 1].text}
                    </p>
                  </div>
                  {conversation.unread && (
                    <div className="w-2 h-2 bg-sky-600 rounded-full ml-2 mt-2"></div>
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No conversations found.
              </div>
            )}
          </div>
        </div>
        
        {/* Conversation View */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={selectedConversation.sender.avatar}
                        alt={selectedConversation.sender.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    {selectedConversation.sender.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedConversation.sender.name}</h3>
                    <p className="text-xs text-gray-500">{selectedConversation.sender.role}</p>
                  </div>
                </div>
                <div>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Messages */}
              <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
                <div className="space-y-8">
                  {/* Subject as first message */}
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-800 inline-block bg-white px-4 py-1 rounded-full shadow-sm">
                      {selectedConversation.subject}
                    </h3>
                  </div>
                  
                  {selectedConversation.messages.map((message, index) => {
                    // Check if we need to show date separator
                    const showDateSeparator = index === 0 || 
                      formatDate(message.timestamp) !== formatDate(selectedConversation.messages[index - 1].timestamp);
                    
                    return (
                      <div key={message.id}>
                        {showDateSeparator && (
                          <div className="flex justify-center my-4">
                            <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                        )}
                        
                        <div className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] ${message.isFromUser ? 'order-2' : 'order-1'}`}>
                            {!message.isFromUser && (
                              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mb-1 inline-block">
                                <Image
                                  src={selectedConversation.sender.avatar}
                                  alt={selectedConversation.sender.name}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className={`rounded-2xl p-3 inline-block ${
                              message.isFromUser 
                                ? 'bg-sky-600 text-white rounded-tr-none' 
                                : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                            }`}>
                              <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                            </div>
                            <div className={`text-xs text-gray-500 mt-1 ${message.isFromUser ? 'text-right' : 'text-left'}`}>
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                      placeholder="Type your message..."
                      rows={2}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    ></textarea>
                    <button 
                      type="button"
                      className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                      </svg>
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors shadow-sm"
                    disabled={!newMessage.trim()}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No conversation selected</h3>
                <p className="text-gray-600 mb-4">Select a conversation from the list to view messages.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 