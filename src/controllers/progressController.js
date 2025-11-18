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

    // FIX 1: Prevent infinite XP farming
    // Check if user has already completed this challenge
    const existingProgress = await Progress.findOne({
      user: userId,
      challenge: challengeId
    });

    if (existingProgress) {
      return res.status(400).json({ success: false, message: 'Challenge already completed' });
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

    // FIX 2: Correct Streak Calculation (Calendar Days)
    const today = new Date();
    // Normalize today to midnight (00:00:00) to represent the "current day"
    today.setHours(0, 0, 0, 0);

    let last = null;
    if (user.lastCompletionDate) {
      last = new Date(user.lastCompletionDate);
      // Normalize last date to midnight
      last.setHours(0, 0, 0, 0);
    }

    if (!last) {
      // First ever completion
      user.currentStreak = 1;
    } else {
      // Calculate difference in days
      const diffTime = Math.abs(today - last);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Completed another challenge on the same day; streak remains same
      } else if (diffDays === 1) {
        // Completed on the next calendar day; increment streak
        user.currentStreak += 1;
      } else {
        // Missed a day (diff > 1); reset streak
        user.currentStreak = 1;
      }
    }

    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }

    // Save the actual timestamp for record keeping
    user.lastCompletionDate = new Date();
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