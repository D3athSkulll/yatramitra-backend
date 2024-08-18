require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const model = require("../models/user");
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
    return res.json({ message: "Login successful", token, user });
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
router.get("/verify",isLoggedIn,(req,res)=>{
  return res.status(200).json({message:"User is logged in"});
});

module.exports = router;