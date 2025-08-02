// routes/chatRoutes.js
const express = require('express');
const { createOrFetchChat, getUserChats } = require('../controllers/chatController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();
router.post('/', authenticate, createOrFetchChat);
router.get('/', authenticate, getUserChats);

module.exports = router;
