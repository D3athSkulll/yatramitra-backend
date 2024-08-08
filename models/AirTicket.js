const mongoose = require('../connections/db'); 
const airTicketSchema = new mongoose.Schema({
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
  departureflightID:{
    type:String,
    required:true
  },
  arrival: {
    type: Date,
    required: false
  },
  arrivalflightID:{
    type:String,
    required:false
  },
  arrivalTime:{
    type: String,
    required: false
  },
  departureTime:{
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  class:{
    type:String,
    required:false
  },
  pnr:{
    type:String,
    required:true
  },
  passengers:[{
    name:{
      type:String,
      required:true
    },
    age:{
      type:Number,
      required:true
  }}
]
});

module.exports = airTicketSchema;