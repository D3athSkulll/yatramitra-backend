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
  arrival: {
    type: Date,
    required: false
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