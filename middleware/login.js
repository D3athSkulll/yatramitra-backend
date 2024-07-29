const jwt = require('jsonwebtoken');
require("dotenv").config();
const JWT_SECRET = process.env.SECRET; // Replace with your actual secret

const isLoggedIn = (req, res, next) => {
  const token = req.session.token?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = {
    isLoggedIn
}