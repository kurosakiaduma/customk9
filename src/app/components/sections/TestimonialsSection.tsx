import Image from "next/image";

// This could be moved to a data file later
const testimonials = [
  {
    text: "The training methods I learned completely transformed my relationship with my dog. He&apos;s so much calmer and happier now.",
    name: "Maria K.",
    location: "Nairobi",
    imageSrc: "/images/testimonial-maria.jpg"
  },
  {
    text: "I never understood why my dog was behaving the way she did until our consultation. The insights were invaluable.",
    name: "James O.",
    location: "Mombasa",
    imageSrc: "/images/testimonial-james.jpg"
  },
  {
    text: "The classes were excellent and well-structured. My puppy and I both learned so much in just a few weeks.",
    name: "Sarah M.",
    location: "Nakuru",
    imageSrc: "/images/testimonial-sarah.jpg"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-sky-800 text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Dog Owners Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-sky-700/50 backdrop-blur-sm p-0 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group">
              {testimonial.imageSrc && (
                <div className="w-full h-48 relative">
                  <Image 
                    src={testimonial.imageSrc}
                    alt={`${testimonial.name} testimonial`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-8">
                <p className="italic mb-6 text-sky-50">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-4">
                  {!testimonial.imageSrc && (
                    <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{testimonial.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sky-200">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 