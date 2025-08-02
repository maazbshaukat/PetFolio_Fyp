import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 bg-purple-700 text-white text-center">
      <p>© 2025 PetFolio. All rights reserved.</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a href="#" className="hover:underline">Facebook</a>
        <a href="#" className="hover:underline">Twitter</a>
        <a href="#" className="hover:underline">Instagram</a>
      </div>
    </footer>
  );
};

export default Footer;
