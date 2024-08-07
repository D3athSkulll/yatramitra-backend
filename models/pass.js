const mongoose = require("../connections/db");
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  });
  const User = mongoose.model("login", userSchema);
  module.exports = User;