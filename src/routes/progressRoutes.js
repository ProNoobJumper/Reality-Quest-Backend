const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/challenges/:id/complete
router.post('/challenges/:id/complete', protect, progressController.completeChallenge);

module.exports = router;
