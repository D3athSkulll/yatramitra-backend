const mongoose = require('../connections/db'); // Ensure the correct path to your db.js file

// Airline Schema
const busCompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    iata_code: { type: String, required: true }
});

const busComapny = mongoose.model('busComapny', busCompanySchema);

// Airport Schema
const citySchema = new mongoose.Schema({
    city: { type: String, required: true },
    country: { type: String, required: true },
});

const City = mongoose.model('City', citySchema);

// Flight Schema
const busSchema = new mongoose.Schema({
    bus_number: { type: String, required: true },
    busCompany_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Airlines', required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    dates: [{
        date: { type: String, required: true }, 
        availableSeats: { type: Number, required: true, min: 0 }, 
      }],
    departure_time: { type: String, required: true }, 
    arrival_time: { type: String, required: true },
    price: {type: Number, required: true}
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = { Bus, City, busComapny };