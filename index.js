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
const contact = require("./routes/contact");
const { isLoggedIn } = require("./middleware/login");
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.SECRET;
app.use(cookieParser());
app.use(session({ secret: JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(cors());
app.use(express.json());
app.use("/auth", auth);
app.use("/contact", contact);
app.use(isLoggedIn);
app.use("/api", api);
app.use("/payment", payment);

app.listen(port, () => {
  console.log("Server is running on port 3000");
});