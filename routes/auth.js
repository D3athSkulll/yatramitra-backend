require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const model = require("../models/pass");
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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    req.session.token = token;
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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    req.session.token = token;
    return res.json({ message: "Registration and login successful", token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});
router.post("/protected",isLoggedIn,(req,res,next)=>{
  res.json({message:"You are logged in"});
})
router.post('/logout', (req, res) => {
  // JWT does not require server-side logout. Client should just discard the token.
  res.json({ message: "Logout successful" });
});

module.exports = router;