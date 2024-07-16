const express = require("express");
const Amadeus = require("amadeus");
require("dotenv").config();
const amadeus = new Amadeus({
    clientId: process.env.ID,
    clientSecret: process.env.SECRET,
  });
const router = express.Router();

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.status(401).json({message:"Not logged in"}); // Redirect unauthenticated requests to login page
  }
  
router.get("/autocomplete", isLoggedIn, async (req, res) => {
    const { query } = req;
    console.log(req.user);
    try{
            const { data } = await amadeus.referenceData.locations.cities.get({
                keyword: query.keyword,
                subType: amadeus.location.any
            });
            res.json(data);
        }
    catch(e){
        console.log(e);
        res.status(500).json([]);
    }
});
router.get('/flights',isLoggedIn, async (req, res) => {
    const {query} = req;
    try{
        const ob = {
            originLocationCode: query.origin,
            destinationLocationCode: query.destination,
            departureDate: query.departureDate,
            adults: query.adults,
            children: query.children,
            infants: query.infants,
            travelClass: query.travelClass,
            currencyCode: "INR"
        };
        if (req.query.returnDate){
            ob.returnDate = req.query.returnDate;
        }
        const {data} = await amadeus.shopping.flightOffersSearch.get(ob);
        res.json(data);
    }
    catch(e){
        console.log(e);
        res.status(500).json([]);
    }
});
module.exports = router;