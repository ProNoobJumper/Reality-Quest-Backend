const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
