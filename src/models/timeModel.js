const mongoose = require('mongoose');

const { Schema } = mongoose;

const timeSchema = new Schema({
    day_number: Number,
    day_week: String,
    km_traveled: Number,
    km_total: Number
});

module.exports = mongoose.model('time', timeSchema);