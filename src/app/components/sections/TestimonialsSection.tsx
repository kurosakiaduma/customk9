// This could be moved to a data file later
const testimonials = [
  {
    text: "The training methods I learned completely transformed my relationship with my dog. He's so much calmer and happier now.",
    name: "Maria K.",
    location: "Nairobi"
  },
  {
    text: "I never understood why my dog was behaving the way she did until our consultation. The insights were invaluable.",
    name: "James O.",
    location: "Mombasa"
  },
  {
    text: "The classes were excellent and well-structured. My puppy and I both learned so much in just a few weeks.",
    name: "Sarah M.",
    location: "Nakuru"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-sky-800 text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Dog Owners Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-sky-700/50 p-8 rounded-xl">
              <p className="italic mb-6">"{testimonial.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sky-600 rounded-full"></div>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sky-200">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 