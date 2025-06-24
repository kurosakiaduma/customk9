import React from 'react';

interface Dog {
  name: string;
  breed?: string;
}

interface DogSelectionProps {
  bookingType: 'individual' | 'group';
  onSelect: (selectedDogs: Dog[]) => void;
}

const DogSelection: React.FC<DogSelectionProps> = ({ bookingType, onSelect }) => {
  // Placeholder: just call onSelect with an empty array
  React.useEffect(() => {
    onSelect([]);
  }, [onSelect]);

  return (
    <div>
      <p>Dog selection for booking type: <b>{bookingType}</b> will appear here.</p>
    </div>
  );
};

export default DogSelection; 