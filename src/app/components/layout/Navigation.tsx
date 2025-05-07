import Link from "next/link";
import { useState, useEffect } from "react";

type NavLink = {
  href: string;
  label: string;
};

// This could be moved to a data file later
const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#class-booking", label: "Class Booking" },
  { href: "#gallery", label: "Gallery" },
  { href: "#references", label: "References" },
  { href: "#blog", label: "Blog" },
  { href: "#client-area", label: "Client Area" },
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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-[#0099ff]/60 backdrop-blur-md shadow-lg border-b border-white/10" : "bg-transparent"
    }`}>
      <div className="container mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center items-center">
          <div className="flex justify-center py-3">
            {navLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.href} 
                className="text-white hover:text-white hover:bg-white/10 transition-colors rounded-md font-semibold uppercase text-sm px-5 py-2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center py-3 px-4">
          <div className="text-white font-bold text-xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">CustomK9 Kenya</div>
          <button 
            className="text-white focus:outline-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0099ff]/60 backdrop-blur-md border-t border-white/10 shadow-lg">
            <div className="flex flex-col py-2">
              {navLinks.map((link, index) => (
                <Link 
                  key={index}
                  href={link.href} 
                  className="text-white hover:bg-white/10 transition-colors py-2 px-4 font-semibold uppercase text-sm" 
                  onClick={() => setMobileMenuOpen(false)}
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