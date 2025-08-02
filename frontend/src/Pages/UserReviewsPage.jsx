import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserReviewsPage = () => {
  const { sellerId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [ratingData, setRatingData] = useState({ avgRating: 0, totalReviews: 0 });

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${sellerId}`);
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  // Fetch average rating
  const fetchAverage = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${sellerId}/average`);
      setRatingData(res.data);
    } catch (err) {
      console.error('Failed to fetch average rating:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchAverage();
  }, [sellerId]);

  // Submit review handler with detailed logs
  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    let userId = null;

    try {
      const userRaw = localStorage.getItem('user');
      console.log("📦 Raw user from localStorage:", userRaw);

      if (userRaw) {
        const parsed = JSON.parse(userRaw);
        console.log("✅ Parsed user object:", parsed);
        userId = parsed._id;
      }
    } catch (err) {
      console.error('❌ Error parsing user from localStorage:', err);
    }

    console.log("🪪 Token:", token);
    console.log("👤 UserID:", userId);

    if (!token || !userId) {
      alert("You must be logged in to submit a review.");
      return;
    }

    if (rating === 0 || reviewText.trim() === '') {
      alert('Please provide both rating and review text.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/reviews/${sellerId}`,
        { rating, reviewText, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Review submitted successfully");
      setRating(0);
      setHoverRating(0);
      setReviewText('');
      fetchReviews();
      fetchAverage();
    } catch (err) {
      console.error('❌ Review submission failed:', err.response?.data || err.message);
    }
  };

  const renderStars = (count) => (
    <div className="flex text-yellow-500">
      {Array(count).fill().map((_, i) => <FaStar key={i} />)}
    </div>
  );

  return (
    <div>
      <Navbar />
      <section className="p-6 min-h-screen bg-[#f9f6ff] max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Reviews & Ratings</h2>

        {/* Average Rating Display */}
        <div className="mb-6 bg-white p-4 rounded shadow text-center">
          <h3 className="text-xl font-bold">{ratingData.avgRating.toFixed(1)}/5 ⭐</h3>
          <p className="text-gray-600">
            Based on {ratingData.totalReviews} review{ratingData.totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Leave a Review */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h4 className="text-lg font-bold mb-2">Leave a Review</h4>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-2xl ${
                  star <= (hoverRating || rating) ? 'text-yellow-500' : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows="3"
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <button
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-600"
            onClick={handleSubmit}
          >
            Submit Review
          </button>
        </div>

        {/* List of User Reviews */}
        <h4 className="text-xl font-bold mb-4">User Reviews</h4>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} className="bg-white p-4 mb-4 rounded shadow">
              <p className="font-bold">{rev.userId.name}</p>
              {renderStars(rev.rating)}
              <p>{rev.reviewText}</p>
            </div>
          ))
        )}
      </section>
      <Footer />
    </div>
  );
};

export default UserReviewsPage;
