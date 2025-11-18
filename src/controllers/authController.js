const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  // For stateless JWT, logout is handled client-side by deleting token
  res.json({ success: true, message: 'Logged out' });
};

// OAuth placeholders – later we can wire with Passport
exports.googleAuth = (req, res) => {
  res.status(501).json({ success: false, message: 'Google OAuth not implemented yet' });
};

exports.googleCallback = (req, res) => {
  res.status(501).json({ success: false, message: 'Google OAuth callback not implemented yet' });
};

exports.githubAuth = (req, res) => {
  res.status(501).json({ success: false, message: 'GitHub OAuth not implemented yet' });
};

exports.githubCallback = (req, res) => {
  res.status(501).json({ success: false, message: 'GitHub OAuth callback not implemented yet' });
};
