const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const progressRoutes = require('./routes/progressRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const errorHandler = require('./middleware/errorHandler');
// const logger = require('./middleware/logger'); // REMOVED

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
// app.use(logger); // REMOVED: Redundant because of morgan

// Serve static frontend from /public
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api', progressRoutes);
app.use('/api', leaderboardRoutes);

app.use(errorHandler);

module.exports = app;