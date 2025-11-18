const User = require('../models/User');

// GET /api/leaderboard?by=xp or by=streak
exports.getLeaderboard = async (req, res, next) => {
  try {
    const sortBy = req.query.by === 'streak' ? 'currentStreak' : 'xp';
    const users = await User.find()
      .sort({ [sortBy]: -1 })
      .select('name email xp currentStreak longestStreak')
      .limit(20);

    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};
