const mongoose = require('../connections/db'); // Ensure the correct path to your db.js file

// Airport Schema
const stationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    stationCode: { type: String, required: true }
});

const Station = mongoose.model('Stations', stationSchema);

// Flight Schema

const trainSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true,
      unique: true
    },
    schedules: [{
      date: {
        type: Date,
        required: true
      },
      stoppages: [{
        station: {
          type: String,
          required: true
        },
        arrivalTime: {
          type: Date, // Format: "HH:mm"
          required: false
        },
        departureTime: {
          type: Date, // Format: "HH:mm"
          required: false
        }
      }],
      availableSeats: {
        type: Number,
        required: true,
        min: 0
      }
    }]
  });
  trainSchema.index({ 'schedules.date': 1 });
  trainSchema.index({ 'schedules.stoppages.station': 1 });
const Train = mongoose.model('Trains', trainSchema);

module.exports = { Train, Station };