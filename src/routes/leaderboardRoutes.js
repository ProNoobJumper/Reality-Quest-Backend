const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/leaderboard
router.get('/leaderboard', protect, leaderboardController.getLeaderboard);

module.exports = router;
