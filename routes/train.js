const express = require("express");
const {Train, Station} = require("../models/trainSearch");
require("dotenv").config();
const router = express.Router();
require("dotenv").config();
router.get("/autocomplete", async (req, res) => {
  const query = req.query.query;
  const searchRegex = new RegExp(`^${query}`, 'i');
  const stations = await Station.find({
    $or: [
      { name: searchRegex },
      { city: searchRegex },
      { stationCode: searchRegex }
    ]
  }).limit(10);
  res.json(stations);
});
router.post('/search', async (req, res) => {
  const departureStation = req.body.departureStation;
  const arrivalStation = req.body.arrivalStation;
  const requiredSeats = parseInt(req.body.seats);
  const targetDate = new Date(req.body.Date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  const trains = await Train.find({
    'schedules.stoppages': {
      $elemMatch: {
        station: departureStation,
        departureTime: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    'schedules.stoppages.station': arrivalStation
  });

  const filteredTrains = trains.map(train => {
    const relevantSchedules = train.schedules.filter(schedule => {
      const departureIndex = schedule.stoppages.findIndex(stoppage => stoppage.station === departureStation);
      const arrivalIndex = schedule.stoppages.findIndex(stoppage => stoppage.station === arrivalStation);

      return departureIndex !== -1 &&
             arrivalIndex !== -1 &&
             departureIndex < arrivalIndex &&
             schedule.availableSeats >= requiredSeats;
    });

    const scheduleData = relevantSchedules.find(schedule => schedule.availableSeats >= requiredSeats);

    if (scheduleData) {
      const departureStoppage = scheduleData.stoppages.find(stoppage => stoppage.station === departureStation);
      const arrivalStoppage = scheduleData.stoppages.find(stoppage => stoppage.station === arrivalStation);

      return {
        trainNumber: train.number,
        trainName: train.name,
        departureStation: departureStation,
        arrivalStation: arrivalStation,
        departureTime: departureStoppage ? departureStoppage.departureTime : null,
        arrivalTime: arrivalStoppage ? arrivalStoppage.arrivalTime : null,
        price: scheduleData.price
      };
    }
    return null;
  }).filter(train => train !== null);

  res.json({data:filteredTrains});
});

module.exports = router;