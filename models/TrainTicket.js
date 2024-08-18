const mongoose = require('../connections/db'); 
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
  departureID:{
    type:String,
    required:true
  },
  departureTime:{
    type:String,
    required:true
  },
  price: {
    type: Number,
    required: true
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

module.exports = trainTicketSchema;