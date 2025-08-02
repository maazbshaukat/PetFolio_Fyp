import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section
      className="relative py-20 px-4 bg-gradient-to-br from-[#f9f6ff] to-[#ffffff] overflow-hidden text-center"
      style={{
        backgroundImage: `url('/public/paw-pattern.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '100px',
        backgroundPosition: 'center',
        opacity: 0.96,
      }}
    >
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Connect, Choose, and Create New Bonds
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Where buying, selling, and discovering pets is seamless. With AI-powered breed recognition and modern discovery tools, PetFolio gives you the edge.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link to="/discover-pets">
            <button className="bg-purple-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-800 shadow-md transition">
              Explore Pets
            </button>
          </Link>
          <Link to="/post-an-ad">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 shadow-md transition">
              Post an Ad
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
