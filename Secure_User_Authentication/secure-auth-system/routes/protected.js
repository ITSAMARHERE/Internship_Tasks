const express = require('express');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/roleAuth');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deactivateUser
} = require('../controllers/userController');

const router = express.Router();

// Protect all routes in this router
router.use(protect);

// User routes
router.get('/dashboard', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome to your dashboard, ${req.user.username}!`,
    data: {
      user: req.user
    }
  });
});

// Moderator and Admin routes
router.get('/users/:id', restrictTo('moderator', 'admin'), getUserById);

// Admin only routes
router.get('/users', restrictTo('admin'), getAllUsers);
router.patch('/users/:id/role', restrictTo('admin'), updateUserRole);
router.delete('/users/:id', restrictTo('admin'), deactivateUser);

// Test routes for different roles
router.get('/admin-panel', restrictTo('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to admin panel!',
    data: {
      user: req.user
    }
  });
});

router.get('/moderator-panel', restrictTo('moderator', 'admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to moderator panel!',
    data: {
      user: req.user
    }
  });
});

module.exports = router;