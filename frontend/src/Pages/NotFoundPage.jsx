import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f6ff]">
      <Navbar />
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <motion.h1
          className="text-7xl font-extrabold text-purple-700 mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        >
          404
        </motion.h1>
        <motion.p
          className="text-2xl text-gray-700 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Whoops! The page you're looking for doesn’t exist.
        </motion.p>
        <motion.img
          src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
          alt="Lost Dog"
          className="w-40 h-40 mb-6"
          initial={{ y: -20 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/"
            className="bg-purple-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-600"
          >
            Go Back Home
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
