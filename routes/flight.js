const express = require("express");
const {Airline, Airport, Flight} = require("../models/flightSearch");
const {isLoggedIn} = require("../middleware/login");
require("dotenv").config();

const calculateDuration = (departureTime, arrivalTime) => {
    const [departureHour, departureMinute] = departureTime.split(':').map(Number);
    const [arrivalHour, arrivalMinute] = arrivalTime.split(':').map(Number);

    const departureDate = new Date();
    departureDate.setHours(departureHour, departureMinute, 0);
    
    const arrivalDate = new Date();
    arrivalDate.setHours(arrivalHour, arrivalMinute, 0);

    if (arrivalDate < departureDate) {
        arrivalDate.setDate(arrivalDate.getDate() + 1);
    }

    return arrivalDate - departureDate;
};

const router = express.Router();

router.get("/autocomplete", async (req, res) => {
    const { query } = req.query;
    try {
        const searchRegex = new RegExp(`^${query}`, 'i');
        const airports = await Airport.find({
            $or: [
                { name: searchRegex },
                { city: searchRegex },
                { country: searchRegex },
                { iata_code: searchRegex }
            ]
        }).limit(10); 

        res.json(airports);
    } catch (e) {
        console.log(e);
        res.status(500).json([]);
    }
});
router.get('/search', async (req, res) => {
    const { origin, destination, departureDate, adults } = req.query;

    try {
        const data = await Flight.find({
            origin: origin,
            destination: destination,
            dates: departureDate,
            availableSeats: { $gt: adults }
        }).lean();
        const airlines = await Airline.find().lean();
        //Create airline map to map id to name
        const airlineMap = airlines.reduce((map, airline) => {
            map[airline._id] = airline.name;
            return map;
        }, {});

        const processedFlights = data.map(flight => {
            const travelTime = calculateDuration(flight.departure_time, flight.arrival_time);
            
            const airlineName = airlineMap[flight.airline_id] || 'Unknown';

            return {
                ...flight,
                travel_time: travelTime,
                airline_name: airlineName // Add airline name
            };
        });

        processedFlights.sort((a, b) => a.travel_time - b.travel_time);
        res.json(processedFlights);
    } catch (e) {
        console.error(e); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;