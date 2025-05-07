import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation as SwiperNavigation, Pagination } from 'swiper/modules';
import Navbar from "../layout/Navigation";

// This could be moved to a data file later
const dogImages = [
  "/images/dog-01.jpg",
  "/images/dog-02.jpg",
  "/images/dog-03.jpg",
  "/images/dog-04.jpg",
  "/images/dog-05.jpg",
  "/images/dog-06.jpg",
  "/images/dog-07.jpg",
  "/images/dog-08.jpg",
  "/images/dog-09.jpg",
  "/images/dog-10.jpg",
  "/images/dog-11.jpg",
  "/images/dog-12.jpg",
];

export default function HeroSection() {
  return (
    <section className="relative h-[100vh] flex items-center overflow-hidden">
      <Navbar />
      
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full relative">
          {/* Image Carousel */}
          <Swiper
            spaceBetween={0}
            centeredSlides={true}
            effect="fade"
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            speed={1500}
            navigation={true}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[Autoplay, EffectFade, Pagination, SwiperNavigation]}
            className="h-full w-full"
          >
            {dogImages.map((image, index) => (
              <SwiperSlide key={index} className="h-full w-full">
                <div className="relative h-full w-full">
                  <Image
                    src={image}
                    alt={`Beautiful dog image ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                    className="transition-opacity duration-1000"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-20">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 animate-slide-up drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Educating Kenya on <span className="text-sky-200">Dog Welfare</span> and <span className="text-sky-200">Positive Training</span>
          </h1>
          <p className="text-xl text-white mb-8 animate-slide-up animation-delay-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Empowering owners with knowledge to build better relationships with their dogs through positive, humane methods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-500">
            <Link href="#services" 
              className="px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full transition-colors text-center shadow-lg">
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 