import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation as SwiperNavigation, Pagination } from 'swiper/modules';

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
            <Link 
              href="/booking" 
              className="px-8 py-4 bg-yellow-500 text-white hover:bg-yellow-400 font-bold rounded-full transition-colors shadow-xl animate-pulse hover:animate-none transform hover:scale-105 flex items-center justify-center"
            >
              <span className="mr-2">Book Now</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 