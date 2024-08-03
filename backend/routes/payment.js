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
    const { uniqueID } = req.body; 
    const amount = await calculateAmount(uniqueID);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, 
        currency: 'inr',
        metadata: { uniqueID }, 
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
router.post("/save",async(req,res)=>{
    const {formData} = req.body;
    const {source,destination,departure,arrival,passengers} = formData;
    const price = 1000;
    const uniqueId = await formDB.create({
        source,
        destination,
        departure,
        arrival,
        price,
        passengers,
        type:formData.type
    });
    const amount = await calculateAmount(price);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, 
        currency: 'inr',
        metadata: { uniqueId: String(uniqueId) }, 
    });

    res.json({clientSecret: paymentIntent.client_secret});
});
async function calculateAmount(amount) {
    return amount*100;
}

module.exports = router;    