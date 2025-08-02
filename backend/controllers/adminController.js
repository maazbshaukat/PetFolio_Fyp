const User = require('../models/User');
const Pet = require('../models/Pet');
const AdminLog = require('../models/AdminLog');

// 🧠 Helper to log admin actions
const logAction = async (adminId, action) => {
  await AdminLog.create({ adminId, action });
};

exports.getAllUsers = async (req, res) => {
  const search = req.query.search || '';
  const users = await User.find({
    email: { $regex: search, $options: 'i' }
  });
  res.json(users);
};

exports.banUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(id, { isBanned: true });
  await logAction(req.user.userId, `Banned user ${id}`);
  res.json({ message: 'User banned' });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  await logAction(req.user.userId, `Deleted user ${id}`);
  res.json({ message: 'User deleted' });
};

exports.getAllListings = async (req, res) => {
  const search = req.query.search || '';
  const listings = await Pet.find({
    $or: [
      { breed: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } }
    ]
  }).populate('owner', 'email name');
  res.json(listings);
};

exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Pet.findByIdAndDelete(id);
  await logAction(req.user.userId, `Deleted pet listing ${id}`);
  res.json({ message: 'Listing deleted' });
};

exports.getLogs = async (req, res) => {
  const logs = await AdminLog.find().populate('adminId', 'email');
  res.json(logs);
};

// ✅ STATS CONTROLLER
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const deletedUsers = await AdminLog.countDocuments({ action: /delete user/i });

    const totalListings = await Pet.countDocuments();
    const deletedListings = await AdminLog.countDocuments({ action: /delete pet listing/i });

    res.json({ totalUsers, deletedUsers, totalListings, deletedListings });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
