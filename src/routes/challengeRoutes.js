const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const { protect } = require('../middleware/authMiddleware');

// All routes are JWT protected
router.get('/', protect, challengeController.getAllChallenges);
// Filter by category (must come before :id route)
router.get('/category/:category', protect, challengeController.getByCategory);
router.get('/:id', protect, challengeController.getChallengeById);
router.post('/', protect, challengeController.createChallenge);
router.put('/:id', protect, challengeController.updateChallenge);
router.delete('/:id', protect, challengeController.deleteChallenge);

module.exports = router;
