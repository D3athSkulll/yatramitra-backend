const mongoose = require('../connections/db');
 const formDataSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
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
    arrivalTime:{
        type: String,
        required: false
    },
    departureTime:{
        type: String,
        required: true
    },
    departureID:{
        type: String,
        required: true
    },
    arrivalID:{
        type: String,
        required: false
    },
    departurePrice:{
        type: Number,
        required: false
    },
    arrivalPrice:{
        type: Number,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    passengers: [{
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        gender:{
            type: String,
            required: true
        }
    }]
});
const formDB = mongoose.model('formData',formDataSchema);
module.exports = formDB;