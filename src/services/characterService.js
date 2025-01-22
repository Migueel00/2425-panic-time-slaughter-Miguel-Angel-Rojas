const Character = require('../models/characterModel');

const getAllCharacters = async() => {
    try {
        const characters = await Character.find().populate(['equipment.weapons', 'equipment.saddlebag', 'equipment.pouch.precious_stones']).exec();
        return characters;
    }   
    catch(error){
        throw error;
    }
}

module.exports = {
    getAllCharacters
}