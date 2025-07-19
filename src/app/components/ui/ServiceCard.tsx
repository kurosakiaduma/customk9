import Image from "next/image";
import { ReactNode } from "react";

type ServiceCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  onBookNowClick?: () => void;
};

export default function ServiceCard({ 
  title, 
  description, 
  icon, 
  imageSrc, 
  imageAlt,
  onBookNowClick
}: ServiceCardProps) {
  if (imageSrc) {
    return (
      <div className="bg-white overflow-hidden rounded-xl shadow-[0_10px_30px_rgba(0,140,255,0.15)] hover:shadow-[0_15px_30px_rgba(0,140,255,0.25)] transition-all duration-300 hover:translate-y-[-5px] group">
        {/* Image takes full width at top of card */}
        <div className="w-full h-56 relative">
          <Image 
            src={imageSrc}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Content section below image */}
        <div className="p-6 bg-gradient-to-br from-sky-100/80 to-white/90 backdrop-blur-md">
          <h3 className="text-xl font-bold mb-3 text-sky-800 group-hover:text-sky-600 transition-colors">{title}</h3>
          <p className="text-gray-700 leading-relaxed mb-4">{description}</p>
          
          {/* Book Now button */}
          <button
            onClick={onBookNowClick}
            className="mt-2 px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-400 font-semibold rounded-full transition-colors shadow-md transform hover:scale-105 flex items-center justify-center text-sm w-full"
          >
            <span>Book Now</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
  
  // Original card design for icons
  return (
    <div className="bg-gradient-to-br from-sky-200/60 via-sky-100/40 to-white/40 backdrop-blur-md p-8 rounded-xl border border-sky-300/40 shadow-[0_10px_30px_rgba(0,140,255,0.15)] hover:shadow-[0_15px_30px_rgba(0,140,255,0.25)] transition-all duration-300 hover:translate-y-[-5px] group hover:bg-gradient-to-br hover:from-sky-300/60 hover:via-sky-200/50 hover:to-white/50">
      {icon && (
        <div className="w-16 h-16 bg-sky-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 group-hover:bg-sky-600/40 transition-all duration-300 border border-sky-400/40 group-hover:ring-2 group-hover:ring-sky-300/70 group-hover:ring-offset-2 group-hover:ring-offset-transparent">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold mb-3 text-sky-800 group-hover:text-sky-600 transition-colors">{title}</h3>
      <p className="text-gray-700 leading-relaxed mb-4">{description}</p>
      
      {/* Book Now button */}
      <button
        onClick={onBookNowClick}
        className="mt-4 px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-400 font-semibold rounded-full transition-colors shadow-md transform hover:scale-105 flex items-center justify-center text-sm"
      >
        <span>Book Now</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
} 