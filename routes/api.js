const express = require("express");
const {isLoggedIn} = require("../middleware/login");
require("dotenv").config();
const flight = require("./flight");
const train = require("./train");
const bus = require("./bus");
const User = require("../models/user");
const router = express.Router();

router.use("/flight", flight);
router.use("/train",train);
router.use("/bus",bus);
router.get("/tickets",async (req,res)=>{
    try{
        const email = req.user.email;
        const user = await User.findOne({email});
        res.json(user.tickets);
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
});
module.exports = router;