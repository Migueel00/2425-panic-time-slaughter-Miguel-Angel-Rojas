const mongoose = require('mongoose');
const { Schema } = mongoose;

const saddlebagSchema = new Schema({
    name: String,
    description: String,
    recover_stamina: String
});

module.exports = mongoose.model('saddlebag', saddlebagSchema);