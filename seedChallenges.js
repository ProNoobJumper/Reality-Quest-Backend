require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('./src/models/Challenge');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/realityquest';

const seedChallenges = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const challenges = [
      {
        title: '10K Steps a Day',
        description: 'Walk at least 10,000 steps every day for 2 weeks.',
        category: 'Health',
        difficulty: 'Medium',
        xpReward: 20,
      },
      {
        title: '30 Minutes of Learning',
        description: 'Spend at least 30 minutes learning something new each day.',
        category: 'Learning',
        difficulty: 'Easy',
        xpReward: 15,
      },
      {
        title: 'No Snooze Week',
        description: 'Wake up on your first alarm for 7 days straight.',
        category: 'Discipline',
        difficulty: 'Hard',
        xpReward: 30,
      },
      {
        title: 'Deep Work Sprint',
        description: 'Do 1 hour of focused, distraction-free work each day for 5 days.',
        category: 'Productivity',
        difficulty: 'Medium',
        xpReward: 25,
      },
      {
        title: 'Random Act of Kindness',
        description: 'Do one small kind act every day for a week.',
        category: 'Other',
        difficulty: 'Easy',
        xpReward: 10,
      },
    ];

    await Challenge.insertMany(challenges);
    console.log('Seeded challenges successfully');
  } catch (err) {
    console.error('Error seeding challenges:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedChallenges();
