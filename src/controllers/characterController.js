const characterService = require('../services/characterService');

const getAllCharacters = async(req, res) => {
    try {
        const characters = await characterService.getAllCharacters();

        res.status(200).send({
            status: "OK",
            data: characters
        });

    }catch(error){
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
    getAllCharacters
}