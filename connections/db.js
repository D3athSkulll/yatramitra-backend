const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.DB)
.then(() => {
    console.log("Connected to database");
})
.catch((e) => {
    console.log(e);
});
module.exports = mongoose;