const mongoose = require("mongoose");
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
        type: String,
        required: true
    },
    arrival: {
        type: String,
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