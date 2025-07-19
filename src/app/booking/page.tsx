"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";

export default function BookingPage() {
  const router = useRouter();
  
  // Redirect to events calendar page
  useEffect(() => {
    router.replace("/events/calendar");
  }, [router]);

  // Return an empty div while the redirect happens
  return <div></div>;
} 