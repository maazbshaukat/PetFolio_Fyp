// controllers/messageController.js
const Message = require('../models/Message');
const mongoose = require('mongoose');

exports.createMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;

    const message = await Message.create({
      chatId,
      senderId: new mongoose.Types.ObjectId(req.user.userId),
      text
    });

    res.status(201).json(message);
  } catch (err) {
    console.error('Error creating message:', err);
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  const messages = await Message.find({ chatId: req.params.chatId });
  res.status(200).json(messages);
};

exports.markMessagesAsRead = async (req, res) => {
  try {
    const result = await Message.updateMany(
      { chatId: req.params.chatId, senderId: { $ne: req.user.userId }, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ updated: result.nModified });
  } catch (err) {
    console.error('Error marking messages as read:', err);
    res.status(500).json({ message: 'Failed to update read status' });
  }
};

exports.getUnreadCounts = async (req, res) => {
  try {
    const counts = await Message.aggregate([
      { $match: { isRead: false, senderId: { $ne: new mongoose.Types.ObjectId(req.user.userId) } } },
      { $group: { _id: "$chatId", count: { $sum: 1 } } }
    ]);
    res.status(200).json(counts);
  } catch (err) {
    console.error('Error fetching unread counts:', err);
    res.status(500).json({ message: 'Failed to fetch unread counts' });
  }
};