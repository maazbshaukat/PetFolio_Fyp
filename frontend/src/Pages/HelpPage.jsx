import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HelpPage = () => {
  return (
    <div>
      <Navbar />
      <section className="px-4 md:px-20 py-12 bg-[#f9f6ff]">
        <h1 className="text-3xl font-bold text-center mb-8">Help & Support</h1>

        {/* FAQs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <ul className="space-y-4 text-gray-700">
            <li>
              <strong>Q: How do I post a pet ad?</strong>
              <p className="ml-4">A: Go to "Post an Ad" from the navbar, fill in your pet details, and click submit.</p>
            </li>
            <li>
              <strong>Q: Is it free to list pets?</strong>
              <p className="ml-4">A: Yes, listing pets on PetFolio is currently free for all users.</p>
            </li>
            <li>
              <strong>Q: How can I contact the seller?</strong>
              <p className="ml-4">A: Open a pet’s details page and click “Show Phone Number” or use the “Chat” button.</p>
            </li>
            <li>
              <strong>Q: Is there an AI breed detection feature?</strong>
              <p className="ml-4">A: Yes! You can upload pet images and our AI helps identify the breed accurately.</p>
            </li>
          </ul>
        </div>

        {/* About Us */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">About PetFolio</h2>
          <p className="text-gray-700 leading-relaxed">
            PetFolio is a modern platform that connects pet lovers with sellers, breeders, and adopters.
            Our mission is to create a safe, easy, and enjoyable environment for buying, selling, and discovering pets.
            From dogs and cats to parrots and exotic breeds, we’ve got something for every animal lover.
            <br /><br />
            Features like AI breed detection, user ratings, and personalized profiles make PetFolio a trusted choice for your next pet connection.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HelpPage;
