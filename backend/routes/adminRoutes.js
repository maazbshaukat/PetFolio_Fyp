const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');
const adminController = require('../controllers/adminController');

// User Management
router.get('/users', authenticate, adminOnly, adminController.getAllUsers);
router.patch('/users/ban/:id', authenticate, adminOnly, adminController.banUser);
router.delete('/users/:id', authenticate, adminOnly, adminController.deleteUser);

// Pet Listing Management
router.get('/listings', authenticate, adminOnly, adminController.getAllListings);
router.delete('/listings/:id', authenticate, adminOnly, adminController.deleteListing);

router.get('/stats', authenticate, adminOnly, adminController.getStats);


// Logs
router.get('/logs', authenticate, adminOnly, adminController.getLogs);

module.exports = router;
