import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaPhone, FaMapMarkerAlt, FaStar, FaChevronLeft, FaChevronRight, FaHeart } from 'react-icons/fa';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [ratingData, setRatingData] = useState({ avgRating: 0, totalReviews: 0 });

  // Fetch pet details and check if favorited
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/pets/details/${id}`);
        setPet(res.data);

        // Fetch reviews average for seller dynamically
        if (res.data.owner?._id) {
          const ratingRes = await axios.get(`http://localhost:5000/api/reviews/${res.data.owner._id}/average`);
          setRatingData(ratingRes.data || { avgRating: 0, totalReviews: 0 });
        }

        // Check if favorited
        const token = localStorage.getItem('token');
        if (token) {
          const favRes = await axios.get(`http://localhost:5000/api/profile/favorites`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const isFav = favRes.data.some((fav) => fav._id === id);
          setIsFavorite(isFav);
        }

      } catch (err) {
        console.error('Failed to fetch pet details:', err);
      }
    };
    fetchPet();
  }, [id]);

  if (!pet) return <div>Loading pet details...</div>;

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % pet.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + pet.images.length) % pet.images.length);
  };

  // Toggle favorite logic (API)
  const handleFavoriteToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to favorite this ad.');
        return;
      }

      if (isFavorite) {
        await axios.delete(`http://localhost:5000/api/profile/favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5000/api/profile/favorites/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  // Helper to render stars for average rating (rounded down)
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} />);
    }
    // Optionally add half star or empty stars if needed
    return stars;
  };

  return (
    <div>
      <Navbar />
      <section className="px-4 md:px-20 py-8 bg-[#f9f6ff] min-h-screen">
        <div className="mb-4">
          <Link to="/discover-pets" className="text-sm text-purple-700 font-semibold hover:underline">
            ← Back to Pet Listings
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3 relative">
            <img
              src={pet.images[currentImageIndex]}
              alt={pet.name}
              className="rounded-lg w-full h-[400px] object-cover object-center"
            />
            {pet.images.length > 1 && (
              <>
                <button onClick={handlePrevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md">
                  <FaChevronLeft />
                </button>
                <button onClick={handleNextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md">
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>

          <div className="w-full md:w-1/3 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-500 text-sm">Listed by private user</p>
              <h2 className="text-lg font-bold">{pet.owner?.name || 'Unknown Seller'}</h2>
              <p className="text-sm text-gray-600">Member since {new Date(pet.owner?.createdAt).toLocaleDateString() || 'N/A'}</p>
              <div className="flex flex-col gap-2 mt-4">
                <button onClick={() => setShowPhone(!showPhone)} className="border border-gray-300 py-2 rounded hover:bg-gray-50">
                  <FaPhone className="inline mr-2" />
                  {showPhone ? pet.owner?.phone || 'No number' : 'Show phone number'}
                </button>
                <Link
                  to={`/chats?userId=${pet.owner?._id}`}
                  className="border border-gray-300 py-2 rounded hover:bg-gray-50 text-center block"
                >
                  💬 Chat
                </Link>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm font-medium mb-1">Location</p>
              <div className="flex items-center text-gray-700">
                <FaMapMarkerAlt className="mr-2" />
                {pet.owner?.location || pet.location}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-yellow-500">
                  {renderStars(ratingData.avgRating)}
                </div>
                <p className="text-sm text-gray-600 ml-2">
                  Based on {ratingData.totalReviews} review{ratingData.totalReviews !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => navigate(`/user-reviews/${pet.owner._id}`)}
                className="mt-2 bg-purple-700 text-white py-1 px-3 rounded text-sm hover:bg-purple-600"
              >
                Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Title Box */}
        <div className="bg-white mt-6 p-6 rounded-lg shadow-md relative">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-1">PKR {pet.price.toLocaleString()}</h2>
              <p className="text-lg font-semibold">{pet.name}</p>
              <p className="text-md text-purple-600 font-medium">{pet.breed}</p>
              <p className="text-sm text-gray-600">{pet.gender}, {pet.age} Year{pet.age > 1 ? 's' : ''} Old</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm text-gray-700 font-medium">Vaccinated:</span>
                <span className={`text-sm font-medium ${pet.vaccinated ? 'text-green-600' : 'text-red-500'}`}>
                  {pet.vaccinated ? 'Yes' : 'No'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">1 week ago</p>
            </div>
            <button onClick={handleFavoriteToggle}>
              <FaHeart className={`text-xl ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`} />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white mt-4 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{pet.description}</p>
          <div className="mt-6">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
              AI Prediction: {pet.breed} (90%)
            </span>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PetDetailsPage;
