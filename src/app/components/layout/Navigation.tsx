import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

// Types for navigation
type NavLink = {
  href: string;
  label: string;
  isExternal?: boolean;
};

type NavSection = {
  title: string;
  links: NavLink[];
};

// Navigation data structure - could be moved to a separate file
const mainNavLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/booking", label: "Class Booking" },
  { href: "/gallery", label: "Gallery" },
  { href: "/references", label: "References" },
  { href: "/blog", label: "Blog" },
  { href: "/client-area", label: "Client Area" },
];

// For future implementation - could be used for a footer or mega menu
const navSections: NavSection[] = [
  {
    title: "Services",
    links: [
      { href: "/services/behavior-consultations", label: "Behavior Consultations" },
      { href: "/services/training-classes", label: "Training Classes" },
      { href: "/services/welfare", label: "Welfare" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/resources/articles", label: "Articles" },
      { href: "/resources/faqs", label: "FAQs" },
    ],
  },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to handle navigation item click - useful for analytics later
  const handleNavClick = (label: string) => {
    // Close mobile menu when a link is clicked
    setMobileMenuOpen(false);
    
    // Could add analytics tracking here
    console.log(`Navigation item clicked: ${label}`);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-[#0099ff]/60 backdrop-blur-md shadow-lg border-b border-white/10" : "bg-transparent"
    }`}>
      <div className="container mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center py-3">
            <Link href="/" className="text-white font-bold text-2xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] flex items-center">
              <span className="mr-2">CustomK9</span>
              <span className="text-sky-300">Kenya</span>
            </Link>
          </div>
          
          {/* Nav Links */}
          <div className="flex justify-center py-3">
            {mainNavLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.href} 
                className="text-white hover:text-white hover:bg-white/10 transition-colors rounded-md font-semibold uppercase text-sm px-5 py-2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
                onClick={() => handleNavClick(link.label)}
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center py-3 px-4">
          <Link href="/" className="text-white font-bold text-xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] flex items-center">
            <span>CustomK9</span>
            <span className="text-sky-300 ml-1">Kenya</span>
          </Link>
          <button 
            className="text-white focus:outline-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0099ff]/70 backdrop-blur-md border-t border-white/10 shadow-lg">
            <div className="flex flex-col py-2">
              {mainNavLinks.map((link, index) => (
                <Link 
                  key={index}
                  href={link.href} 
                  className="text-white hover:bg-white/10 transition-colors py-3 px-4 font-semibold uppercase text-sm" 
                  onClick={() => handleNavClick(link.label)}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 