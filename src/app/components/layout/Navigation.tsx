"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Types for navigation
type NavLink = {
  href: string;
  label: string;
  isExternal?: boolean;
  dropdown?: NavLink[];
};

type NavSection = {
  title: string;
  links: NavLink[];
};

// Navigation data structure - could be moved to a separate file
const mainNavLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { 
    href: "/services", 
    label: "Services",
    dropdown: [
      { href: "/services/puppy-manners", label: "PUPPY MANNERS AND SOCIALIZATION" },
      { href: "/services/basic-obedience", label: "BASIC OBEDIENCE" },
      { href: "/services/refresher-obedience", label: "REFRESHER OBEDIENCE" },
      { href: "/services/intro-to-agility", label: "INTRO TO AGILITY" },
      { href: "/services/show-handling", label: "SHOW HANDLING / RING CRAFT" },
      { href: "/services/loose-leash-walking", label: "LOOSE LEASH WALKING" },
      { href: "/services/beginning-tracking", label: "BEGINNING TRACKING FOR FUN" },
      { href: "/services/clicker-training", label: "CLICKER TRAINING" },
      { href: "/services/supervised-playtime", label: "SUPERVISED PLAYTIME" },
      { href: "/services/dog-and-family-training", label: "DOG AND FAMILY TRAINING" },
      { href: "/services/welfare", label: "WELFARE" },
      { href: "/services/trap-neuter-release", label: "TRAP, NEUTER AND RELEASE (TNR)" },
      { href: "/services/crate-rental", label: "CRATE RENTAL" },
      { href: "/services/education", label: "EDUCATION" }
    ]
  },
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
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

  // Function to handle dropdown toggle
  const toggleDropdown = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeDropdown === label) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(label);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Skip if clicked element is a part of dropdown trigger
      if ((e.target as Element).closest('.dropdown-trigger')) {
        return;
      }
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Function to handle navigation item click - useful for analytics later
  const handleNavClick = (label: string) => {
    // Close mobile menu when a link is clicked
    setIsMenuOpen(false);
    
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
              <div key={index} className="relative group">
                {link.dropdown ? (
                  <>
                    <button 
                      className="dropdown-trigger text-white hover:text-white hover:bg-white/10 transition-colors rounded-md font-semibold uppercase text-sm px-5 py-2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] flex items-center"
                      onClick={(e) => toggleDropdown(link.label, e)}
                      aria-expanded={activeDropdown === link.label}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 ml-1 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div 
                      className={`absolute left-0 mt-1 w-64 bg-[#333]/90 backdrop-blur-md rounded-md shadow-lg py-2 z-20 
                        dropdown-menu md:group-hover:delay-100
                        ${activeDropdown === link.label ? '!opacity-100 !visible' : ''}
                      `}
                    >
                      {link.dropdown.map((dropdownLink, dropdownIndex) => (
                        <Link 
                          key={dropdownIndex}
                          href={dropdownLink.href}
                          className="block px-4 py-2 text-sm text-white hover:bg-sky-600 transition-colors"
                          onClick={() => {
                            handleNavClick(dropdownLink.label);
                            setActiveDropdown(null);
                          }}
                        >
                          {dropdownLink.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link 
                    href={link.href} 
                    className="text-white hover:text-white hover:bg-white/10 transition-colors rounded-md font-semibold uppercase text-sm px-5 py-2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
                    onClick={() => handleNavClick(link.label)}
                    target={link.isExternal ? "_blank" : undefined}
                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
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
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0099ff]/70 backdrop-blur-md border-t border-white/10 shadow-lg">
            <div className="flex flex-col py-2">
              {mainNavLinks.map((link, index) => (
                <div key={index}>
                  {link.dropdown ? (
                    <>
                      <button 
                        className="w-full text-left text-white hover:bg-white/10 transition-colors py-3 px-4 font-semibold uppercase text-sm flex justify-between items-center dropdown-trigger"
                        onClick={(e) => toggleDropdown(link.label, e)}
                        aria-expanded={activeDropdown === link.label}
                      >
                        {link.label}
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {activeDropdown === link.label && (
                        <div className="bg-sky-900/50 py-2">
                          {link.dropdown.map((dropdownLink, dropdownIndex) => (
                            <Link 
                              key={dropdownIndex}
                              href={dropdownLink.href}
                              className="block py-2 px-8 text-sm text-white hover:bg-white/10 transition-colors"
                              onClick={() => {
                                handleNavClick(dropdownLink.label);
                                setActiveDropdown(null);
                                setIsMenuOpen(false);
                              }}
                            >
                              {dropdownLink.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link 
                      href={link.href} 
                      className="text-white hover:bg-white/10 transition-colors py-3 px-4 font-semibold uppercase text-sm" 
                      onClick={() => handleNavClick(link.label)}
                      target={link.isExternal ? "_blank" : undefined}
                      rel={link.isExternal ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 