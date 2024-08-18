const express = require("express");
const session = require('express-session');
const cors = require('cors');
const path = require("path");
const cookieParser = require('cookie-parser');

require("dotenv").config();
const app = express();
const api = require("./routes/api");
const auth = require("./routes/auth");
const payment = require("./routes/payment");
const { isLoggedIn } = require("./middleware/login");

const JWT_SECRET = process.env.SECRET;
app.use(cookieParser());
app.use(session({ secret: JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use("/login", (req,res)=>{
  res.sendFile(path.join(__dirname, "../frontend/public/views/login.html"));
});
app.use("/auth", auth);
app.use(isLoggedIn);
app.use("/api", api);
app.use("/payment", payment);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});