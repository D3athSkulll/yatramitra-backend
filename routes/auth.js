require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const router = express.Router();
const model = require("../models/user");
const nodemailer = require("nodemailer");
const { forgot } = require("../models/forgot");
const { isLoggedIn } = require('../middleware/login');

const JWT_SECRET = process.env.SECRET; // Replace with your actual secret

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await model.findOne({ email: email }).exec();
    if (!user) {
      return res.status(401).json({ message: "Your credentials are incorrect. Please try again." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Your credentials are incorrect. Please try again." });
    }

    const token = jwt.sign({ id: user._id, email }, JWT_SECRET, { expiresIn: '2h' });
    console.log(token);
    return res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  const { email, password, name, number } = req.body;
  try {
    let user = await model.findOne({ email: email }).exec();
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = 10; // Adjust cost factor for bcrypt
    const hash = await bcrypt.hash(password, saltRounds);
    user = new model({
      email: email,
      password: hash,
      name,
      number,
      tickets: {
        air: [],
        train: [],
        bus: []
      }
    });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
    // req.session.token = token;
    console.log(token);
    return res.json({ message: "Registration and login successful", token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  console.log(req.body);
  try {
    let reset = await forgot.findOneAndDelete({ token: token });
    if (!reset) {
      return res.status(400).json({ message: "Invalid token" });
    }
    if (reset.expires < Date.now()) {
      return res.status(400).json({ message: "Token expired" });
    }
    const user = await model.findOne({ email: reset.email });
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    user.password = hash;
    await user.save();
    return res.status(200).json({ data: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
})
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    let user = await model.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; 
    await forgot.findOneAndUpdate({ email: email},
      { email, token, expires },
      { upsert: true, new: true }
    );
    const resetLink = `/reset-password?token=${token}`;
    const mail = process.env.EMAIL;
    const pass = process.env.PASS;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: mail,
            pass: pass
        }
    });
    const mailOptions = {
        from:{
            name: "Yatra Mitra",
            address: email
        },
        to: email,
        subject: "Forgot Password",
        text: `You are receiving this because you (or someone else) have requested to reset your password. Please click the following link, or paste it into your browser to complete the process: ${resetLink}`,
    };
    transporter.sendMail(mailOptions, (err, info)=>{
        if(err){
            console.log(err);
        }
    });
  } catch (error) {
  }
  return res.status(200).json({ message: "Email sent" });
});
router.get("/verify",isLoggedIn,(req,res)=>{
  return res.status(200).json({message:"User is logged in"});
});

module.exports = router;