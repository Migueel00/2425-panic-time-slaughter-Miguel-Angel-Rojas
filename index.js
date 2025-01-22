require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const characterRoute = require('./src/routes/characterRoute');
const Die = require('./src/helpers/Die');


const PORT = process.env.PORT || 3000;
const app = express();
const mongodbRoute = process.env.CONNECTIONG_STRING;

// router
app.use('/api/characters', characterRoute);

// connection mongoDb
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

// Die creation
const die100 = new Die(100);
const die20 = new Die(20);
const die4 = new Die(4);
const die3 = new Die(3);
const die2 = new Die(2);
const die10 = new Die(10);

