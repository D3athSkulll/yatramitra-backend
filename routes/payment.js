const express = require("express");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE);
const {isLoggedIn} = require("../middleware/login");
const mongoose = require("../connections/db");
const formDataSchema = require("../models/formData");
const router = express.Router();
const nodemailer = require("nodemailer");
const formDB = mongoose.model("formData", formDataSchema);
const userSchema = require("../models/user");
const genHTML = require("../middleware/html");
router.use(express.json());
function generatePNR(){
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}
async function sendEmailAndSave(data, payment){
    const user = await userSchema.findOne({email: data.email});
    data.pnr = generatePNR();
    user.tickets.air.push(data);
    await user.save();
    const html = genHTML(data, payment);
    const email = process.env.EMAIL;
    const pass = process.env.PASS;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: email,
            pass: pass
        }
    });
    const mailOptions = {
        from:{
            name: "Yatra Mitra",
            address: email
        },
        to: data.email,
        subject: "Flight Ticket",
        html: html
    };
    transporter.sendMail(mailOptions, (err, info)=>{
        if(err){
            console.log(err);
        }
    });
    console.log("Email sent and data saved");
}
router.post("/data",async(req,res)=>{
    const {paymentIntentId} = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if(paymentIntent.status !== "succeeded") return res.status(401).json({message:"Payment not completed"});
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
    const billingAddress = paymentMethod;
    const uniqueID = paymentIntent.metadata.uniqueId;
    try{
        const data = await formDB.findById(uniqueID);
        sendEmailAndSave(data.toObject(),{amount: data.price/100, billingAddress});
        res.status(200).json({message:"Data saved"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Data not found"});
    }
});
router.post("/save",isLoggedIn, async(req,res)=>{
    const formData = req.body;
    const {source,destination,departure,arrival,passengers, type, price, flightID, arrivalflightID, arrivalTime, departureTime} = formData;
    console.log(arrivalflightID);
    const uniqueId = await formDB.create({
        source,
        destination,
        departure,
        arrival,
        price,
        passengers,
        type,
        departureflightID: flightID,
        arrivalflightID,
        arrivalTime,
        departureTime,
        email: req.user.email
    });
    const paymentIntent = await stripe.paymentIntents.create({
        amount: price, 
        currency: 'inr',
        metadata: { uniqueId: String(uniqueId._id) }, 
    });
    res.json({clientSecret: paymentIntent.client_secret});
});
module.exports = router;    