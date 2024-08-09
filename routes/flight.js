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
router.get("/flightData/:id", isLoggedIn, async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Flight.findOne({
            flight_number: id
        }).lean();
        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
router.get("/autocomplete", isLoggedIn, async (req, res) => {
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
router.post('/search', async (req, res) => {
    const { origin, destination, departureDate, returnDate, adults } = req.body;
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
            const {dates, airline_id, ...flightData} = flight;
            return {
                ...flightData,
                travel_time: travelTime,
                airline_name: airlineName,
            };
        });

        processedFlights.sort((a, b) => a.travel_time - b.travel_time);
        var returnFlightsProcessed = [];
        if(returnDate){
            const returnFlights = await Flight.find({
                origin: origin,
                destination: destination,
                dates: departureDate,
                availableSeats: { $gt: adults }
            }).lean();
    
             returnFlightsProcessed = returnFlights.map(flight => {
                const travelTime = calculateDuration(flight.departure_time, flight.arrival_time);
                
                const airlineName = airlineMap[flight.airline_id] || 'Unknown';
                const {dates, airline_id, ...flightData} = flight;
                return {
                    ...flightData,
                    travel_time: travelTime,
                    airline_name: airlineName,
                };
            });
    
        }
        
        returnFlightsProcessed.sort((a, b) => a.travel_time - b.travel_time);
        const final = {
            isOneWay: returnDate === undefined,
            departureFlights: processedFlights,
            returnFlights: returnFlightsProcessed,
            adults,
            departureDate,
            arrivalDate: returnDate? returnDate : null
        }
        res.json(final);
    } catch (e) {
        console.error(e); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;