import Image from "next/image";
import { ReactNode } from "react";

type ServiceCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
};

export default function ServiceCard({ 
  title, 
  description, 
  icon, 
  imageSrc, 
  imageAlt 
}: ServiceCardProps) {
  return (
    <div className="bg-gradient-to-br from-sky-200/60 via-sky-100/40 to-white/40 backdrop-blur-md p-8 rounded-xl border border-sky-300/40 shadow-[0_10px_30px_rgba(0,140,255,0.15)] hover:shadow-[0_15px_30px_rgba(0,140,255,0.25)] transition-all duration-300 hover:translate-y-[-5px] group hover:bg-gradient-to-br hover:from-sky-300/60 hover:via-sky-200/50 hover:to-white/50">
      {imageSrc ? (
        <div className="w-full h-48 mb-6 rounded-lg overflow-hidden relative group-hover:shadow-lg transition-all duration-300 group-hover:ring-2 group-hover:ring-sky-300/70">
          <Image 
            src={imageSrc}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : icon ? (
        <div className="w-16 h-16 bg-sky-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 group-hover:bg-sky-600/40 transition-all duration-300 border border-sky-400/40 group-hover:ring-2 group-hover:ring-sky-300/70 group-hover:ring-offset-2 group-hover:ring-offset-transparent">
          {icon}
        </div>
      ) : null}
      <h3 className="text-xl font-bold mb-3 text-sky-800 group-hover:text-sky-600 transition-colors">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
} 