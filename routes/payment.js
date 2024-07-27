const express = require("express");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE);
const {isLoggedIn} = require("../middleware/login");
const mongoose = require("../connections/db");
const formDataSchema = require("../models/formData");
const router = express.Router();
const formDB = mongoose.model("formData", formDataSchema);
router.use(express.json());
router.post("/create", async (req, res) => {
    const { uniqueID } = req.body; // Your form data from the client
    const amount = await calculateAmount(uniqueID);
    //amount = parseInt(amount);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Implement this based on your pricing
        currency: 'inr',
        metadata: { uniqueID }, // Include the unique ID in metadata
    });

    res.json({clientSecret: paymentIntent.client_secret, uniqueID});
});
router.post("/data",async(req,res)=>{
    const {paymentIntentId} = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if(paymentIntent.status !== "succeeded") return res.json({message:"Payment not completed"});
    const uniqueID = paymentIntent.metadata.uniqueID;
    const data = await formDB.findById(uniqueID);
    res.json(data);
});
router.post("/save",isLoggedIn,async(req,res)=>{
    const {formData} = req.body;
    const {source,destination,departure,arrival,price,passengers} = formData;
    const uniqueId = await formDB.create({
        source,
        destination,
        departure,
        arrival,
        price,
        passengers,
        type:formData.type
    });
    res.json({id:uniqueId._id});
});
async function calculateAmount(uniqueID) {
    const data = await formDB.findById(uniqueID);
    let amount = data.price;
    return amount*100;
}

module.exports = router;    