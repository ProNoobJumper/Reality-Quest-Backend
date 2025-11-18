const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String }, // for local JWT users
    googleId: { type: String },
    githubId: { type: String },
    xp: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompletionDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
