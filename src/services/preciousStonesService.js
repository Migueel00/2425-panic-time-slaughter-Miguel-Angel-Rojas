const preciousStonesModel = require('../models/preciousStonesModel');

const getAllPreciousStones = async() => {
    try{
        const preciousStones = await preciousStonesModel.find();
        return preciousStones;
    }
    catch(error){
        throw error;
    }
}

module.exports = {
    getAllPreciousStones
}