const express = require("express");
const Amadeus = require("amadeus");
const {isLoggedIn} = require("../middleware/login");
require("dotenv").config();

const amadeus = new Amadeus({
    clientId: process.env.ID,
    clientSecret: process.env.SECRET,
  });
const router = express.Router();

router.get("/autocomplete", async (req, res) => {
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
router.get('/flights', async (req, res) => {
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
        console.log(data);
        res.json(data);
    }
    catch(e){
        console.log(e);
        res.status(500).json([]);
    }
});
//payment gateway

router.post("/payment-intent", async (req, res) => {
    const { paymentIntentId } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        console.log(paymentIntent.metadata);
        res.json(paymentIntent);
    } catch (e) {
        console.log(e);
        res.status(500).json({message:"Error"});
    }
});
router.post("/book", async (req, res) => {
    const {body} = req;
    try{
        const {data} = await amadeus.booking.flightOrders.post(body);
        res.json(data);
    }
    catch(e){
        console.log(e);
        res.status(500).json([]);
    }
});
module.exports = router;