import { useState } from 'react';

interface ServiceSelectionProps {
    bookingType: 'individual' | 'group';
    onSelect: (service: string) => void;
}

const individualServices = [
    {
        id: 'basic-obedience',
        name: 'Basic Obedience',
        description: 'Foundation training including sit, stay, come, and leash walking',
        duration: '1 hour',
        price: 'KSh 2,500'
    },
    {
        id: 'advanced-obedience',
        name: 'Advanced Obedience',
        description: 'Advanced commands, off-leash control, and behavior modification',
        duration: '1 hour',
        price: 'KSh 3,000'
    },
    {
        id: 'puppy-training',
        name: 'Puppy Training',
        description: 'Early socialization, basic commands, and house training for puppies',
        duration: '1 hour',
        price: 'KSh 2,000'
    }
];

const groupServices = [
    {
        id: 'group-basic',
        name: 'Group Basic Training',
        description: 'Learn basic commands in a social setting with other dogs',
        duration: '1.5 hours',
        price: 'KSh 1,500'
    },
    {
        id: 'puppy-socialization',
        name: 'Puppy Socialization',
        description: 'Structured play and basic training for puppies 8-16 weeks',
        duration: '1.5 hours',
        price: 'KSh 1,200'
    },
    {
        id: 'agility-basics',
        name: 'Agility Basics',
        description: 'Introduction to agility equipment and basic handling',
        duration: '1.5 hours',
        price: 'KSh 2,000'
    }
];

export default function ServiceSelection({ bookingType, onSelect }: ServiceSelectionProps) {
    const [selectedService, setSelectedService] = useState('');
    const services = bookingType === 'individual' ? individualServices : groupServices;

    const handleSelect = (serviceId: string) => {
        setSelectedService(serviceId);
        onSelect(serviceId);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">
                Select a {bookingType === 'individual' ? 'Personal' : 'Group'} Training Service
            </h2>
            
            <div className="grid gap-6">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`p-6 border rounded-lg cursor-pointer transition-all ${
                            selectedService === service.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-200'
                        }`}
                        onClick={() => handleSelect(service.id)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                                <p className="text-gray-600 mb-4">{service.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {service.duration}
                                    </span>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {service.price}
                                    </span>
                                </div>
                            </div>
                            {selectedService === service.id && (
                                <div className="w-6 h-6 text-blue-500">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 