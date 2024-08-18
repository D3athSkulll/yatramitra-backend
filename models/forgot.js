const mongoose = require('../connections/db');
const model = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    token: { type: String, required: true },
    expires: {type: Date, required: true}
});
const forgot = mongoose.model('Forgot', model);
module.exports = {forgot};