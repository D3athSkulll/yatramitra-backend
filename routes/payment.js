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
const { Bus } = require("../models/busSearch");
router.use(express.json());
function generatePNR(){
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}
function generateSeatAssignments(passengers, totalSeats, type) {
    return passengers.map((passenger, index) => {
      const seatsRemain = totalSeats - index;
      
      const row = Math.ceil(seatsRemain / 4);
      const col = seatsRemain % 4 || 4; // Ensure column is 1-based (1, 2, 3, 4)
      
      const colLetter = String.fromCharCode(64 + col);
      if(type === "arr"){
        return {
            ...passenger,
            arrseat: `${row}${colLetter}`
          };
      }
      return {
        ...passenger,
        depseat: `${row}${colLetter}`
      };
    });
  }
async function sendEmailAndSave(data, payment){
    console.log(data, payment);
    
    const user = await userSchema.findOne({email: data.email});
    data.pnr = generatePNR();
    if(data.type === "flight"){
    user.tickets.air.push(data);
    }
    else if(data.type === "train"){
        user.tickets.train.push(data);
    }
    else if(data.type === "bus"){
        user.tickets.bus.push(data);
    }
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
        const data = await formDB.findByIdAndDelete(uniqueID);
        sendEmailAndSave(data.toObject(),{amount: data.price, billingAddress});
        res.status(200).json({message:"Data saved"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Data not found"});
    }
});
router.post("/save",isLoggedIn, async(req,res)=>{
    const formData = req.body;
    var {source,destination,departure,arrival,passengers, type, departureID, arrivalID, arrivalTime, departureTime} = formData;
    var price = 0;
    var arPrice=undefined;
    var depPrice = 0;
    if(type === "flight"){
        var flight = (await Flight.findOne({flight_number:departureID}));
        const schedule = flight.dates.find(schedule => schedule.date===departure);
        price+= flight.price;
        depPrice = price;
        passengers = generateSeatAssignments(passengers,schedule.availableSeats,'dep');
        schedule.availableSeats -= passengers.length;
        flight.save();
        if (arrivalID){
            flight = (await Flight.findOne({flight_number:arrivalID}));
            price += flight.price;
            const schedule = flight.dates.find(schedule =>schedule.date===arrival);
            passengers = generateSeatAssignments(passengers,schedule.availableSeats,'arr');
            schedule.availableSeats -= passengers.length;
            arPrice = price - depPrice;
            flight.save();
        }

    }
    else if(type === "train"){
        const startOfDay = new Date(departure);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(departure);
        endOfDay.setHours(23, 59, 59, 999);

        const train =  (await Train.findOne({number:departureID}));
        const sourceIndex = train.schedules[0].stoppages.findIndex(stoppage => stoppage.station === source);
        const destinationIndex = train.schedules[0].stoppages.findIndex(stoppage => stoppage.station === destination);
        const sourcePrice = train.schedules[0].stoppages[sourceIndex].price;
        const destinationPrice = train.schedules[0].stoppages[destinationIndex].price;
        
        const schedule = train.schedules.find(schedule => 
            schedule.date >= startOfDay && schedule.date <= endOfDay &&
            schedule.stoppages.some(stoppage => stoppage.station === source)
          );
        schedule.availableSeats -= passengers.length;
        price = destinationPrice - sourcePrice;
        departureID = departureID +" - " + train.name;
        depPrice = price;
    }
    else if(type === "bus"){
        var bus = (await Bus.findOne({bus_number:departureID}));
        const schedule = bus.dates.find(schedule => schedule.date===departure);
        price+= bus.price;
        depPrice = price;
        passengers = generateSeatAssignments(passengers,schedule.availableSeats,'dep');
        schedule.availableSeats -= passengers.length;
        bus.save();
        if (arrivalID){
            bus = (await Bus.findOne({bus_number:arrivalID}));
            price += bus.price;
            const schedule = bus.dates.find(schedule =>schedule.date===arrival);
            passengers = generateSeatAssignments(passengers,schedule.availableSeats,'arr');
            schedule.availableSeats -= passengers.length;
            arPrice = price - depPrice;
            bus.save();
        }
    }
    depPrice = depPrice * passengers.length;
    if( arPrice){
        arPrice = arPrice * passengers.length;
    }
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