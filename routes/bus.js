const express = require("express");
const {Bus, City, busComapny} = require("../models/busSearch");
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
router.get("/busData/:id", isLoggedIn, async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Bus.findOne({
            bus_number: id
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
        const cities = await City.find({
            $or: [
                { city: searchRegex },
                { country: searchRegex },
            ]
        }).limit(10); 

        res.json(cities);
    } catch (e) {
        console.log(e);
        res.status(500).json([]);
    }
});
router.post('/search', async (req, res) => {
    const { origin, destination, departureDate, returnDate, adults } = req.body;
    try {
        const data = await Bus.find({
            origin: origin,
            destination: destination,
            'dates.date': departureDate,
            'dates.availableSeats': { $gt: adults }
        }).lean();
        const companies = await busComapny.find().lean();
        //Create airline map to map id to name
        const companieMap = companies.reduce((map, airline) => {
            map[airline._id] = airline.name;
            return map;
        }, {});

        const processedBuss = data.map(bus => {
            const travelTime = calculateDuration(bus.departure_time, bus.arrival_time);
            
            const companyName = companieMap[bus.airline_id] || 'Unknown';
            const {dates, airline_id, ...busData} = bus;
            return {
                ...busData,
                travel_time: travelTime,
                companyName,
            };
        });

        processedBuss.sort((a, b) => a.travel_time - b.travel_time);
        var returnBussProcessed = [];
        if(returnDate){
            const returnBuss = await Bus.find({
                origin: origin,
                destination: destination,
                dates: departureDate,
                availableSeats: { $gt: adults }
            }).lean();
    
             returnBussProcessed = returnBuss.map(bus => {
                const travelTime = calculateDuration(bus.departure_time, bus.arrival_time);
                
                const airlineName = airlineMap[bus.airline_id] || 'Unknown';
                const {dates, airline_id, ...busData} = bus;
                return {
                    ...busData,
                    travel_time: travelTime,
                    airline_name: airlineName,
                };
            });
    
        }
        
        returnBussProcessed.sort((a, b) => a.travel_time - b.travel_time);
        const final = {
            isOneWay: returnDate === undefined,
            departureBus: processedBuss,
            returnBus: returnBussProcessed,
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