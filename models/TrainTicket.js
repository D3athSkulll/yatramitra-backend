const mongoose = require('mongoose');

const trainTicketSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  departure: {
    type: Date,
    required: true
  },
  arrival: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  class:{
    type:String,
    required:true
  },
  pnr:{
    type:String,
    required:true
  }
});

module.exports = trainTicketSchema;