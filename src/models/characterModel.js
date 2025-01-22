const mongoose = require('mongoose');
const { Schema } = mongoose;
const weapons = require('./weaponModel');
const preciousStones = require('./preciousStonesModel');
const saddlebag = require('./saddlebagModel');


const characterSchema = new Schema({
    name: String,
    occupation: String,
    description: String,
    stats: {
        strength: Number,
        dexterity: Number,
        stamina: Number
    },
    equipment: {
        saddlebag: [{
            type: Schema.Types.ObjectId,
            ref: saddlebag
        }],
        quiver: Number,
        weapons: [{
            type: Schema.Types.ObjectId,
            ref: weapons
        }],
        pouch: {
            coins: Number,
            gold: Number,
            precious_stones: [{
                type: Schema.Types.ObjectId,
                ref: preciousStones
            }]
        },
        miscellaneous: []
    }
});

module.exports = mongoose.model('characters', characterSchema, 'characters');