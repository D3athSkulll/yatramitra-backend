const express = require("express");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE);
const {isLoggedIn} = require("../middleware/login");
const router = express.Router();
const formDB = require("../models/formData");
const userSchema = require("../models/user");
const { Flight } = require("../models/flightSearch");
const { Train } = require("../models/trainSearch");
const sendEmail = require("../helper/mail");
router.use(express.json());
function generatePNR(){
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}
async function sendEmailAndSave(data, payment){
    const user = await userSchema.findOne({email: data.email});
    data.pnr = generatePNR();
    user.tickets.air.push(data);
    try{
        await user.save();
        sendEmail(data, payment);
    }
    catch(err){
        console.log(err);
    }
}
router.post("/data",async(req,res)=>{
    const {paymentID} = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentID);
    if(paymentIntent.status !== "succeeded") return res.status(401).json({message:"Payment not completed"});
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
    const billingAddress = paymentMethod;
    const uniqueID = paymentIntent.metadata.uniqueId;
    try{
        const data = await formDB.findById(uniqueID);
        sendEmailAndSave(data.toObject(),{amount: data.price, billingAddress});
        res.status(200).json({message:"Data saved"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Data not found"});
    }
});
router.post("/save",isLoggedIn, async(req,res)=>{
    const formData = req.body;
    const {source,destination,departure,arrival,passengers, type, departureID, arrivalID, arrivalTime, departureTime} = formData;
    var price = 0;
    var arPrice=undefined;
    var depPrice = 0;
    if(type === "flight"){
        price += (await Flight.findOne({flight_number:departureID})).price;
        arPrice = price;
        if (arrivalID){
            price += (await Flight.findOne({flight_number:arrivalID})).price;
            depPrice = (price-arPrice)*passengers.length;
        }
    }
    else if(type === "train"){
        price += (await Train.findOne({number:departureID})).price;
        arPrice = price;
    }
    arPrice = arPrice * passengers.length;
    price = price * passengers.length;
    const uniqueId = await formDB.create({
        source,
        destination,
        departure,
        arrival,
        price,
        passengers,
        type,
        departureID,
        arrivalID,
        arrivalTime,
        departureTime,
        email: req.user.email,
        departurePrice: depPrice,
        arrivalPrice: arPrice
    });
    const paymentIntent = await stripe.paymentIntents.create({
        amount: price*100, 
        currency: 'inr',
        metadata: { uniqueId: String(uniqueId._id) }, 
    });
    res.json({clientSecret: paymentIntent.client_secret});
});
module.exports = router;    