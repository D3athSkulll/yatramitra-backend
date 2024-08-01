const express = require("express");
const request = require('request');
require("dotenv").config();
const router = express.Router();
require("dotenv").config();
const rapidAPIKey = process.env.rapidAPIKey;
router.get("/autocomplete", async (req, res) => {
    const request = require('request');

    const options = {
      method: 'GET',
      url: 'https://irctc1.p.rapidapi.com/api/v1/searchStation',
      qs: {query: req.query.keyword},
      headers: {
        'x-rapidapi-key': rapidAPIKey,
        'x-rapidapi-host': 'irctc1.p.rapidapi.com'
      }
    };
    
    request(options, function (error, response, body) {
        if (error) res.status(500).json({error});
    
        res.json(JSON.parse(body));
    });
});
router.get('/search', async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations',
        qs: {
          fromStationCode: req.query.from,
          toStationCode: req.query.to,
          dateOfJourney: req.query.date
        },
        headers: {
          'x-rapidapi-key': rapidAPIKey,
          'x-rapidapi-host': 'irctc1.p.rapidapi.com'
        }
      };
      
      request(options, function (error, response, body) {
          if (error) res.status(500).json({error});
          res.json(JSON.parse(body));
      });
      
      
});
module.exports = router;