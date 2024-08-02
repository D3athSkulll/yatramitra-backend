const express = require("express");
const {isLoggedIn} = require("../middleware/login");
require("dotenv").config();
const flight = require("./flight");
const train = require("./train");
const router = express.Router();

router.use("/flight", flight);
router.use("/train",train);
module.exports = router;