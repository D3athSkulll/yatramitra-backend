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
  const targetDate = req.body.Date;
  const trains = await search(targetDate, departureStation, arrivalStation);
  res.json(trains);
});
async function search(departureDate, departureStation, arrivalStation) {
  const startOfDay = new Date(departureDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(departureDate);
  endOfDay.setHours(23, 59, 59, 999);

  const trains = await Train.aggregate([
    {
      $match: {
        schedules: {
          $elemMatch: {
            date: { $gte: startOfDay, $lt: endOfDay },
            stoppages: {
              $elemMatch: { station: departureStation },
            }
          }
        }
      }
    },
    {
      $addFields: {
        matchedSchedule: {
          $filter: {
            input: '$schedules',
            as: 'schedule',
            cond: {
              $and: [
                { $gte: ['$$schedule.date', startOfDay] },
                { $lt: ['$$schedule.date', endOfDay] },
                {
                  $anyElementTrue: {
                    $map: {
                      input: '$$schedule.stoppages',
                      as: 'stop',
                      in: { $eq: ['$$stop.station', departureStation] }
                    }
                  }
                }
              ]
            }
          }
        }
      }
    },
    { $unwind: '$matchedSchedule' },
    { $unwind: '$matchedSchedule.stoppages' },
    {
      $match: {
        'matchedSchedule.stoppages.station': departureStation
      }
    },
    {
      $addFields: {
        departureStoppage: '$matchedSchedule.stoppages',
        arrivalStoppage: {
          $arrayElemAt: [
            {
              $filter: {
                input: '$matchedSchedule.stoppages',
                as: 'stop',
                cond: { $eq: ['$$stop.station', arrivalStation] }
              }
            },
            0
          ]
        }
      }
    },
    {
      $match: {
        'arrivalStoppage': { $exists: true },
        $expr: {
          $lt: ['$departureStoppage.arrivalTime', '$arrivalStoppage.arrivalTime']
        }
      }
    },
    {
      $project: {
        name: 1,
        number: 1,
        'departureStoppage': 1,
        'arrivalStoppage': 1,
        'matchedSchedule.availableSeats': 1
      }
    },
    {
      $sort: {
        'departureStoppage.departureTime': 1
      }
    }
  ]);
  return trains;
}
module.exports = router;