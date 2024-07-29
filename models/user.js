const mongoose = require("../connections/db");
const AirTicket = require("./AirTicket");
const TrainTicket = require("./TrainTicket");
const busTicket = require("./BusTicket");
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
    number:{
      type: String,
      required: true
    },
    tickets: {
      air: [AirTicket],
      train: [TrainTicket],
      bus: [busTicket]
    }
  });
  
  const User = mongoose.model("User", userSchema);
  module.exports = User;