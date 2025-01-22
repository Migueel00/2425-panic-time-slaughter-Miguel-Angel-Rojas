const mongoose = require('mongoose');
const { Schema } = mongoose;

const preciousStonesSchema = new Schema({
    name: String,
    description: String,
    value: Number
});

module.exports = mongoose.model('precous_stones', preciousStonesSchema);