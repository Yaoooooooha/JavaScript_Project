const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  // Google Login
  googleID: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // 大頭貼
  thumbnail: {
    type: String,
  },
  email: {
    type: String,
  },
  // local login
  password: {
    type: String,
    minLength: 8,
    maxLength: 1024,
  },
});

module.exports = mongoose.model("User", userSchema);
