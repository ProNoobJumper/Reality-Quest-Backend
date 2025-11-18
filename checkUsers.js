require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/realityquest';

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const users = await User.find().select('name email xp currentStreak longestStreak').lean();
    console.log('Users in DB:', users.length);
    console.log(users);
  } catch (err) {
    console.error('Error querying users:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
