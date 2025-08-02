// routes/messageRoutes.js
const express = require('express');
const { createMessage, getMessages, markMessagesAsRead, getUnreadCounts } = require('../controllers/messageController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();
router.post('/', authenticate, createMessage);
router.get('/:chatId', authenticate, getMessages);
router.patch('/read/:chatId', authenticate, markMessagesAsRead);
router.get('/unread/count', authenticate, getUnreadCounts);

module.exports = router;
