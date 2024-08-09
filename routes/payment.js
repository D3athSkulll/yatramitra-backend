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
const { Flight } = require("../models/flightSearch");
const pdf = require("html-pdf");
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
    pdf.create(html, {format: "A4"}).toBuffer((err, buffer)=>{
        if(err) return console.log(err);
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
                html: html,
                attachments: [{
                    filename: `${data.pnr}.pdf`,
                    content: buffer,
                    encoding: 'base64'
                }]
            };
            transporter.sendMail(mailOptions, (err, info)=>{
                if(err){
                    console.log(err);
                }
            });
    });

    
    console.log("Email sent and data saved");
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
    const {source,destination,departure,arrival,passengers, type, flightID, arrivalflightID, arrivalTime, departureTime} = formData;
    var price = 0;
    var arPrice=undefined;
    var depPrice = 0;
    price += (await Flight.findOne({flight_number:flightID})).price;
    arPrice = price;
    if (arrivalflightID){
        price += (await Flight.findOne({flight_number:arrivalflightID})).price;
        depPrice = (price-arPrice)*passengers.length;
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
        departureflightID: flightID,
        arrivalflightID,
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