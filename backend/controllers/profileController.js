const User = require('../models/User');
const Pet = require('../models/Pet');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const updates = req.body;
  const allowedFields = ['name', 'dob', 'gender', 'about', 'phone', 'profilePic'];
  const filtered = {};

  allowedFields.forEach(field => {
    if (updates[field] !== undefined) filtered[field] = updates[field];
  });

  const user = await User.findByIdAndUpdate(req.user.userId, filtered, { new: true }).select('-password');
  res.json({ message: 'Profile updated successfully', user });
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Delete user’s pets
    await Pet.deleteMany({ owner: userId });

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Account deletion failed:', err);
    res.status(500).json({ message: 'Server error while deleting account' });
  }
};
