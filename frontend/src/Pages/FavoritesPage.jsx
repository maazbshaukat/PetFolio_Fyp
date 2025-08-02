import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch favorites from backend
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:5000/api/profile/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data);
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // ✅ Remove from favorites
  const handleToggleFavorite = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await axios.delete(`http://localhost:5000/api/profile/favorites/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites((prev) => prev.filter((pet) => pet._id !== id));
    } catch (err) {
      console.error('Failed to remove from favorites:', err);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="px-4 md:px-20 py-12 bg-[#f9f6ff] min-h-screen">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Favourites & Saved Searches</h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading favorites...</p>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((pet) => (
              <div
                key={pet._id}
                className="bg-white border rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 relative"
              >
                <div className="relative">
                  <img
                    src={pet.images?.[0] || '/no-image.jpg'}
                    alt={pet.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleToggleFavorite(pet._id)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-400"
                    title="Remove from favorites"
                  >
                    <FaHeart className="text-lg" />
                  </button>
                </div>

                <div className="p-4">
                  <p className="font-semibold text-lg text-[#014D4E] mb-1">
                    PKR {pet.price.toLocaleString()}
                  </p>
                  <p className="text-gray-800 font-medium leading-tight mb-2">{pet.name}</p>
                  <p className="text-sm text-gray-600">{pet.location}</p>
                  <Link
                    to={`/pet/${pet._id}`}
                    className="block mt-4 bg-purple-700 text-white text-center py-2 rounded hover:bg-purple-600"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No favorites yet.</p>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
