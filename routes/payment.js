const express = require("express");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE);
const {isLoggedIn} = require("../middleware/login");
const mongoose = require("../connections/db");
const formDataSchema = require("../models/formData");
const router = express.Router();
const formDB = mongoose.model("formData", formDataSchema);
const userSchema = require("../models/user");
router.use(express.json());
function generatePNR(){
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}
async function sendEmailAndSave(data){
    console.log(data);
    const user = await userSchema.findOne({email: data.email});
    data.pnr = generatePNR();
    console.log(data);
    user.tickets.air.push(data);
    await user.save();
    console.log("Email sent and data saved");
}
router.post("/data",async(req,res)=>{
    const {paymentIntentId} = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if(paymentIntent.status !== "succeeded") return res.status(401).json({message:"Payment not completed"});
    // console.log(paymentIntent.metadata);
    const uniqueID = paymentIntent.metadata.uniqueId;
    // console.log(uniqueID);
    try{
        const data = await formDB.findById(uniqueID);
        // console.log(data);
        sendEmailAndSave(data.toObject());
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Data not found"});
    }
});
router.post("/save",isLoggedIn, async(req,res)=>{
    const formData = req.body;
    const {source,destination,departure,arrival,passengers, type, price, flightID, arrivalTime, departureTime} = formData;
    const uniqueId = await formDB.create({
        source,
        destination,
        departure,
        arrival,
        price,
        passengers,
        type,
        flightID,
        arrivalTime,
        departureTime,
        email: req.user.email
    });
    const amount = await calculateAmount(price);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, 
        currency: 'inr',
        metadata: { uniqueId: String(uniqueId._id) }, 
    });
    res.json({clientSecret: paymentIntent.client_secret});
});
async function calculateAmount(amount) {
    return amount*100;
}

module.exports = router;    