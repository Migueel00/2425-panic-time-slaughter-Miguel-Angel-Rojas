const timeService = require('../services/timeService');

const getAllTimes = async(req, res) => {
    try {
        const times =  await timeService.getAllTimes();
        res.status(200).send({
            status: "OK",
            data: times
        })

    }
    catch(error){
        res
        .status(error?.status || 500)
        .send({
            status: "FAILED",
            message: "Error al realizar la peticion",
            data: { error: error?.message || error}
        })
    }
}

module.exports = {
    getAllTimes
}