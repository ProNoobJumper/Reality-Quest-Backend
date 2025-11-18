const Progress = require('../models/Progress');
const User = require('../models/User');
const Challenge = require('../models/Challenge');

exports.completeChallenge = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const challengeId = req.params.id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    // Record completion
    const progress = await Progress.create({
      user: userId,
      challenge: challengeId,
    });

    // Update XP and streak
    const user = await User.findById(userId);
    const xpReward = challenge.xpReward || 10;

    user.xp += xpReward;

    const today = new Date();
    const last = user.lastCompletionDate ? new Date(user.lastCompletionDate) : null;

    if (!last) {
      user.currentStreak = 1;
    } else {
      const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        user.currentStreak += 1;
      } else if (diffDays > 1) {
        user.currentStreak = 1; // reset streak
      }
    }

    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }

    user.lastCompletionDate = today;
    await user.save();

    res.status(201).json({
      success: true,
      data: {
        progress,
        xp: user.xp,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
    });
  } catch (err) {
    next(err);
  }
};
