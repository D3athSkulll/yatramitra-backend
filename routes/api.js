const express = require("express");
const {isLoggedIn} = require("../middleware/login");
require("dotenv").config();
const flight = require("./flight");
const train = require("./train");
const bus = require("./bus");
const router = express.Router();

router.use("/flight", flight);
router.use("/train",train);
router.use("/bus",bus);
module.exports = router;