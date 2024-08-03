const mongoose = require('../connections/db');
 const formDataSchema = new mongoose.Schema({
    type: {
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
        required: true
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
        }
    }]
});
module.exports = formDataSchema;