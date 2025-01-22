const mongoose = require('mongoose');

const { Schema } = mongoose;

const weaponSchema = new Schema({
    name: String,
    description: String,
    num_die_damage: Number,
    type: String,
    quality: Number
});

module.exports = mongoose.model('weapon', weaponSchema);