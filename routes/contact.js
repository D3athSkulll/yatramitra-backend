const express = require("express");
require("dotenv").config();
const nodemailer = require("nodemailer");
const router = express.Router();
router.use(express.json());

router.post("/post", (req, res) => {
    const {name, email, number, message} = req.body;
    if(!name || !email || !number || !message){
        return res.status(400).json({message:"Please fill all the fields"});
    }
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });
    const messageBody = `Name: ${name}\nEmail: ${email}\nNumber: ${number}\nMessage: \n${message}`;
    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `Contact request from ${name}`,
        text: messageBody
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log(err);
            return res.status(500).json({message:"Internal server error"});
        }
        res.status(200).json({message:"Email sent successfully"});
    });
});
module.exports = router;    