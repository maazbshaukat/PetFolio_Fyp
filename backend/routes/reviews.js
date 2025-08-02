const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/Review');

const router = express.Router();

// GET average rating and total reviews for a seller
router.get('/:sellerId/average', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: 'Invalid seller ID' });
    }
    const agg = await Review.aggregate([
      { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: '$sellerId',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
    if (agg.length === 0) {
      return res.json({ avgRating: 0, totalReviews: 0 });
    }
    res.json({
      avgRating: agg[0].avgRating,
      totalReviews: agg[0].totalReviews
    });
  } catch (error) {
    console.error('Error fetching average rating:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a review for seller
router.post('/:sellerId', async (req, res) => {
  try {
    const { rating, reviewText, userId } = req.body;
    const sellerId = req.params.sellerId;

    if (!mongoose.Types.ObjectId.isValid(sellerId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user or seller ID' });
    }

    const review = new Review({
      userId,
      sellerId,
      rating,
      reviewText
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all reviews for a seller
router.get('/:sellerId', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: 'Invalid seller ID' });
    }

    const reviews = await Review.find({ sellerId }).populate('userId', 'name');
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
