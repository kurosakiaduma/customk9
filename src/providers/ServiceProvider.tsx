"use client";

import { ReactNode, useEffect, useState } from 'react';
import ServiceFactory from '@/services/ServiceFactory';
import { config } from '@/config/config';

interface ServiceProviderProps {
  children: ReactNode;
}

export default function ServiceProvider({ children }: ServiceProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      // Initialize services if not already initialized
      ServiceFactory.initialize(config);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize services:', error);
    }
  }, []);

  // Show loading state while initializing
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
} 