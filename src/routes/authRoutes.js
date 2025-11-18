const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// JWT auth
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// OAuth (placeholders for now)
router.get('/oauth/google', authController.googleAuth);
router.get('/oauth/google/callback', authController.googleCallback);
router.get('/oauth/github', authController.githubAuth);
router.get('/oauth/github/callback', authController.githubCallback);

module.exports = router;
