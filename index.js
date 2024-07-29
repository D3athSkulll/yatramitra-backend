const express = require("express");
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require("dotenv").config();
const app = express();
const api = require("./routes/api");
const auth = require("./routes/auth");
const payment = require("./routes/payment");

const JWT_SECRET = process.env.SECRET; // Replace with your actual secret
app.use(cookieParser());
app.use(session({ secret: JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// JWT Middleware

// Routes
app.use("/api", api);
app.use("/auth", auth);
app.use("/payment", payment);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});