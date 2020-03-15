const mongoose = require("mongoose");

// User schema
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String
  })
);

module.exports = User;
