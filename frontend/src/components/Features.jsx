import React from 'react';

const features = [
  { title: 'Pet Details', icon: '🐾' },
  { title: 'Discover Pets Nearby', icon: '📍' },
  { title: 'AI Breed Identification', icon: '🤖' },
];

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why PetFolio?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#f9f6ff] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
