const time = require('../models/timeModel');

const getAllTimes = async() => {
    try {
        const times = await time.find();
        return times;
    }
    catch(error){
        throw error;
    }
}

module.exports = {
    getAllTimes
}