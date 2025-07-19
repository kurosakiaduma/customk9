import ServiceCard from "../ui/ServiceCard";
import { useRouter } from "next/navigation";

// This could be moved to a data file later
const servicesData = [
  {
    title: "Behavior Consultations",
    description: "One-on-one sessions to address specific behavior challenges and develop personalized training plans.",
    icon: "🔍",
    imageSrc: "/images/behavior-consultation.jpg",
    imageAlt: "Dog behavior consultation"
  },
  {
    title: "Training Classes",
    description: "Group classes focusing on positive reinforcement techniques for dogs of all ages and skill levels.",
    icon: "👨‍🏫",
    imageSrc: "/images/training-classes.jpg",
    imageAlt: "Dog training classes"
  },
  {
    title: "Welfare",
    description: "Professional assessment of animal welfare conditions and recommendations to ensure optimal care standards.",
    icon: "🏠",
    imageSrc: "/images/welfare.jpg",
    imageAlt: "Dog welfare assessment"
  }
];

export default function ServicesSection() {
  const router = useRouter();

  const handleBookNow = () => {
    // Redirect to client area/booking page
    router.push("/client-area");
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-sky-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-200/30 via-transparent to-transparent"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-sky-700">Our Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={<span className="text-3xl">{service.icon}</span>}
              imageSrc={service.imageSrc}
              imageAlt={service.imageAlt}
              onBookNowClick={handleBookNow}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 