const mongoose = require('../connections/db'); // Ensure the correct path to your db.js file

// Airline Schema
const airlineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    iata_code: { type: String, required: true }
});

const Airline = mongoose.model('Airlines', airlineSchema);

// Airport Schema
const airportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    iata_code: { type: String, required: true }
});

const Airport = mongoose.model('Airports', airportSchema);

// Flight Schema
const flightSchema = new mongoose.Schema({
    flight_number: { type: String, required: true },
    airline_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Airlines', required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    dates: [{ type: String, required: true }], // Array of departure dates
    departure_time: { type: String, required: true }, // Time in 24:00:00 format
    arrival_time: { type: String, required: true }, // Time in 24:00:00 format
    availableSeats: { type: Number, required: true },
    price: {type: Number, required: true}
});

const Flight = mongoose.model('Flights', flightSchema);

module.exports = { Airline, Airport, Flight };