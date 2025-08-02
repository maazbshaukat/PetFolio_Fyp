const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteAccount } = require('../controllers/profileController');
const { authenticate } = require('../middlewares/authMiddleware');
const User = require('../models/User');

// -------------------- Profile Routes --------------------
router.get('/me', authenticate, getProfile);
router.put('/update', authenticate, updateProfile);
router.delete('/delete', authenticate, deleteAccount);

// -------------------- Favorites Routes --------------------

// Get user's favorites
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate({
      path: 'favorites',
      populate: { path: 'owner', select: 'name location' },
    });
    res.json(user.favorites);
  } catch (err) {
    console.error('Failed to fetch favorites:', err);
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
});

// Add to favorites
router.post('/favorites/:petId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.favorites.includes(req.params.petId)) {
      user.favorites.push(req.params.petId);
      await user.save();
    }
    res.json({ message: 'Added to favorites' });
  } catch (err) {
    console.error('Failed to add favorite:', err);
    res.status(500).json({ message: 'Failed to add to favorites' });
  }
});

// Remove from favorites
router.delete('/favorites/:petId', authenticate, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { favorites: req.params.petId },
    });
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error('Failed to remove favorite:', err);
    res.status(500).json({ message: 'Failed to remove from favorites' });
  }
});

module.exports = router;
