const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  socketId: String,
  joinedAt: { type: Date, default: Date.now },
  country: String,
  interests: [String]
});

module.exports = mongoose.model('User', userSchema);