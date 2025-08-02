const Chat = require('../models/Chat');
const mongoose = require('mongoose');

exports.createOrFetchChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // Check if chat already exists between sender and receiver
    let chat = await Chat.findOne({ members: { $all: [senderId, receiverId] } });

    if (!chat) {
      // Create new chat
      chat = await Chat.create({ members: [senderId, receiverId] });
    }

    // ✅ Populate members before sending
    const populatedChat = await chat.populate('members', 'name email');

    res.status(200).json(populatedChat);
  } catch (error) {
    console.error('Error in createOrFetchChat:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.userId);

    const chats = await Chat.find({ members: userObjectId })
      .populate('members', 'name email');

    res.status(200).json(chats);
  } catch (err) {
    console.error('Error in getUserChats:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// exports.getUserChats = async (req, res) => {
//   const chats = await Chat.find({
//   members: mongoose.Types.ObjectId(req.user.userId)
// }).populate('members', 'name');
//   // const chats = await Chat.find({ members: req.user.id }).populate('members', 'name');
//   res.status(200).json(chats);
// };
