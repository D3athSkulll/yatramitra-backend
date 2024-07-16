const mongoose = require("../connections/db");
const AirTicket = require("./AirTicket");
const TrainTicket = require("./TrainTicket");
const cabTicket = require("./CabTicket");
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    tickets: {
      air: [AirTicket],
      train: [TrainTicket],
      cab: [cabTicket]
    }
  });
  
  const User = mongoose.model("User", userSchema);
  module.exports = User;