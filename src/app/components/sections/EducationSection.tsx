import Image from "next/image";

// This could be moved to a data file later
const educationPoints = [
  "Understand your dog's communication signals",
  "Learn positive reinforcement techniques",
  "Develop a stronger bond with your dog",
  "Address behavioral issues humanely",
  "Create a happier home for both of you"
];

export default function EducationSection() {
  return (
    <section id="education" className="py-20 bg-sky-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-sky-700">Education Makes the Difference</h2>
            <p className="text-lg text-gray-700 mb-6">
              Educating owners results in better communication, better training, and better behavior from their dogs.
              By learning to read canine body language, owners can apply positive, humane methods to train their companions.
            </p>
            <ul className="space-y-4">
              {educationPoints.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-sky-600 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 relative h-80 md:h-96 rounded-xl overflow-hidden">
            <Image
              src="/images/education-dog.jpg"
              alt="Dog education and training"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              className="rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 