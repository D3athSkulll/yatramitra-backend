const passport = require('passport'); 
const express = require("express");
const crypt = require("bcrypt");
const router = express.Router();
const model = require("../models/pass");
router.use(express.json());
// Assuming you have a route that handles login POST requests
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { failureRedirect: '/failed', failureMessage: true }, (err, user, info) => {
    if (err) {
      return next(err); // Handle error
    }
    if (!user) {
      // Here, instead of redirecting, send a custom message
      return res.status(401).json({ message: "Your credentials are incorrect. Please try again." });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err); // Handle login error
      }
      // Successful authentication
      return res.json(req.user); // Or wherever you want to redirect after successful login
    });
  })(req, res, next);
});
router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user already exists
        let user = await model.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password and create a new user
        const hash = await crypt.hash(password, 8);
        user = new model({
            email: email,
            password: hash
        });
        await user.save();

        // Automatically log the user in after registration
        req.login(user, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Error logging in the user" });
            }
            // Redirect or send a success message
            return res.json(req.user);
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error" });
    }
});
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.status(401).json({message:"Not logged in"}); // Redirect unauthenticated requests to login page
  }
  
  router.get('/protected', isLoggedIn, (req, res) => {
    res.json(req.user);
  });
module.exports = router;