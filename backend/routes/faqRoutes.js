const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');
const faqController = require('../controllers/faqController');

// Public access
router.get('/', faqController.getAllFaqs);

// Admin access
router.post('/', authenticate, adminOnly, faqController.createFaq);
router.put('/:id', authenticate, adminOnly, faqController.updateFaq);
router.delete('/:id', authenticate, adminOnly, faqController.deleteFaq);

module.exports = router;
