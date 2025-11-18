const Challenge = require('../models/Challenge');

exports.getAllChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ isActive: true });
    res.json({ success: true, data: challenges });
  } catch (err) {
    next(err);
  }
};

exports.getChallengeById = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    res.json({ success: true, data: challenge });
  } catch (err) {
    next(err);
  }
};

exports.createChallenge = async (req, res, next) => {
  try {
    const { title, description, category, difficulty, xpReward } = req.body;
    const challenge = await Challenge.create({
      title,
      description,
      category,
      difficulty,
      xpReward,
      createdBy: req.user ? req.user._id : null,
    });
    res.status(201).json({ success: true, data: challenge });
  } catch (err) {
    next(err);
  }
};

exports.updateChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    res.json({ success: true, data: challenge });
  } catch (err) {
    next(err);
  }
};

exports.deleteChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    res.json({ success: true, message: 'Challenge deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const challenges = await Challenge.find({ category, isActive: true });
    res.json({ success: true, data: challenges });
  } catch (err) {
    next(err);
  }
};
