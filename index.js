require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const characterService = require('./src/services/characterService');
const characterRoute = require('./src/routes/characterRoute');
const saddlebagService = require('./src/services/saddlebagService');
const preciousStonesService = require('./src/services/preciousStonesService');
const timeRoute = require('./src/routes/timeRoute');
const Die = require('./src/helpers/Die');


const PORT = process.env.PORT || 3000;
const app = express();
const mongodbRoute = process.env.CONNECTIONG_STRING;

// router
app.use('/api/characters', characterRoute);
app.use('/api/time', timeRoute);

// connection mongoDb
async function start() {
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

async function gameCicle(){
    const characters = await characterService.getAllCharacters();
    await morning(characters);
}

async function morning(characters){
    console.log('-------------');
    // get food
    const saddlebag = await saddlebagService.getAllSaddlebag();
    const preciousStones = await preciousStonesService.getAllPreciousStones();
    // rest
    characters.map(character => {
        const roll = die3.roll();
        
        switch(roll){
            case 1:
                console.log(`${character.name} roll: ${roll} and wins 2 points of strength`);
                character.stats.strength += 2;
                break;

            case 2:
                console.log(`${character.name} roll: ${roll} and wins 2 points of dexterity`);
                character.stats.dexterity += 2;
                break;

            case 3:
                console.log(`${character.name} roll: ${roll} and wins 1 points of strength and another of dexterity`);
                character.stats.strength += 1;
                character.stats.dexterity += 1;
                break;
        }
        // recollet 
        recollect(character, preciousStones, saddlebag);
        console.log('-------------');
    });
}

const recollect = (character, preciousStones, saddlebag) => {

    // recollect
    const roll = die100.roll();

    if(roll <= 30){
        console.log(`${character.name} recollet and gain 1 of gold`);
        character.equipment.pouch.gold += 1;
    }else if(roll <= 80){
        const coins = die20.roll();
        character.equipment.pouch.coins += coins;
        console.log(`${character.name} recollet and gain ${coins} of coins`);
    }else{
        const randomPreciousStone = Math.floor(Math.random() * preciousStones.length);
        character.equipment.pouch.precious_stones.push(preciousStones[randomPreciousStone]._id);
        console.log(`${character.name} recollet and gain a precious stone`);
    }

    // add food 
    const randomFood = Math.floor(Math.random() * saddlebag.length);
    character.equipment.saddlebag.push(saddlebag[randomFood]._id);
    console.log(`${character.name} recollet and gain one piece of food`);
}

gameCicle();
