require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const characterRoute = require('./src/routes/characterRoute');


const PORT = process.env.PORT || 3000;
const app = express();
const mongodbRoute = process.env.CONNECTIONG_STRING;

app.use('/api/characters', characterRoute);

async function  start() {
    try {
        await mongoose.connect(mongodbRoute);
        app.listen(PORT, () => {
            console.log(`Servidor levantado en el puerto ${PORT}`);
        });
        console.log("Conexion con mongo correcta");
    } catch (error) {
    
        console.log(`Error al conectar a la base de datos ${error}`);
    }    
}

start();
