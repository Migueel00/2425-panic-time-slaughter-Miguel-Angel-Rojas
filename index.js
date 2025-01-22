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
    travesy();
    afternoon(characters);
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
                console.log(`${character.name} wins 2 points of strength`);
                character.stats.strength += 2;
                break;

            case 2:
                console.log(`${character.name} wins 2 points of dexterity`);
                character.stats.dexterity += 2;
                break;

            case 3:
                console.log(`${character.name} wins 1 points of strength and another of dexterity`);
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

function travesy(){
    const roll = die10.roll();
    console.log('The team walks ' + roll + 'km');
}

function afternoon(characters){

    catatony(characters);
}

const catatony = (characters) => {
    const randomCharacter = Math.floor(Math.random() * characters.length);
    console.log(`The joker rolls the die and select ${characters[randomCharacter].name} to do the first action`);
    
    const finalCharacters = characters.filter(character => character.name !== characters[randomCharacter].name);
    
    const randomCharacter2 = Math.floor(Math.random() * finalCharacters.length);

    handleAction(characters[randomCharacter], finalCharacters[randomCharacter2], finalCharacters);


    const orderedCharacters = orderCharactersByDexterity(finalCharacters);

    orderedCharacters.map(character => {
        const filteredArray = orderedCharacters.filter(filtered => character.name !== filtered.name);
        const random = Math.floor(Math.random() * filteredArray.length);
        handleAction(character, filteredArray[random], filteredArray);
    });
}

const orderCharactersByDexterity = (characters) => {
    return characters.sort((a, b) => (
        b.stats.dexterity - a.stats.dexterity
    ));
}

const handleAction = (character, otherCharacter, filteredArray) => {
    const occupation = character.occupation;

    switch(occupation){
        case 'warrior':
            handleActionWarrior(character, otherCharacter);
            break;

        case 'gambler':
            handleGamblerAction(character, otherCharacter);
            break;

        case 'thug':
            handleThugAction(character, otherCharacter);
            break;

        case 'mage':
            handleActionMage(character, otherCharacter);
            break;

        case 'peasant':
            handlePeasant(character, filteredArray);
            break;
    }
}

const handleActionMage = (mage, otherCharacter) => {
    const roll = die100.roll();

    if(roll <= mage.stats.dexterity){
        const weaponDamage = calculateWeaponDamage(mage.equipment.weapons[0]);
        const totalDamage = Math.ceil(weaponDamage + (mage.stats.dexterity / 4));
        otherCharacter.stats.strength -= totalDamage;
        console.log(`The ${mage.name} goes crazy and attack ${otherCharacter.name} hurting ${totalDamage}`);
    }

    return;
}

const handleActionWarrior = (warrior, otherCharacter) => {
    const roll = die100.roll();

    if(roll <= warrior.stats.dexterity){

        const weaponDamage = calculateWeaponDamage(warrior.equipment.weapons[0]);
        const totalDamage = Math.ceil(weaponDamage + (warrior.stats.strength / 4));
        otherCharacter.stats.strength -= totalDamage;
        console.log(`${warrior.name} goes crazy and attack ${otherCharacter.name} and hits ${totalDamage} Damage`)
    }
}

const handleThugAction = (thug, otherCharacter) => {
    const roll3 = die3.roll();

    switch(roll3){
        case 1:
            thug.equipment.pouch.gold += 1;
            otherCharacter.equipment.pouch.gold -= 1;
            console.log(`The thug take a lingot of gold from ${otherCharacter.name}`);
            break;

        case 2:
            const coins = Math.ceil(thug.stats.dexterity / 2);
            thug.equipment.pouch.coins += coins;
            otherCharacter.equipment.pouch.coins -= coins;
            console.log(`The thug take ${coins} coins from ${otherCharacter.name}`);
            break;

        case 3:
            thug.equipment.quiver += 1;
            otherCharacter.equipment.quiver -= 1;
            console.log(`The thug take on arrow from ${otherCharacter.name} quiver`);
            break;
    }

    const roll100 = die100.roll();

    if(roll100 <= thug.stats.dexterity){
        const weaponDamage = calculateWeaponDamage(thug.equipment.weapons[0]);
        const totalDamage = Math.ceil(weaponDamage + (thug.stats.dexterity / 4));
        otherCharacter.stats.strength -= totalDamage;
        thug.equipment.quiver -= 1;
        console.log(`The thug goes crazy and attak ${otherCharacter.name} hurting ${totalDamage}`);
    }
}

const calculateWeaponDamage = (weapon) => {
    let damage = 0;
    for(let i = 1;  i < weapon.num_die_damage; i++){
        damage += die4.roll();
    }

    return weapon.quality < 0 ? Math.ceil(damage + (weapon.quality / 5)) : 0;
}

const handlePeasant = (peasant, otherCharacters) => {
    for(let i = 0; i < 3; i++){
        const random = Math.floor(Math.random() * otherCharacters.length);
        const otherCharacter = otherCharacters[random];
        giveFoodIfPeasantHave(peasant, otherCharacter);
    }
}

const giveFoodIfPeasantHave = (peasant, otherCharacter) => {
    if(peasant.equipment.saddlebag.length > 0){
        const random = Math.floor( Math.random() * peasant.equipment.saddlebag.length);
        otherCharacter.equipment.saddlebag.push(peasant.equipment.saddlebag[random]);
        peasant.equipment.saddlebag.splice(random, 1);
        console.log(`The peasant have foond and gives ${otherCharacter.name} some food`);
    }
}

const handleGamblerAction = (gambler, otherCharacter) => {
    console.log(`Gambler action: `);
    const roll = die2.roll();

    switch(roll){
        case 1:
            givePreciousStoneIfHave(gambler, otherCharacter);
            break;

        case 2:
            givePreciousStoneIfHave(otherCharacter, gambler);
            break;
    }
}

const givePreciousStoneIfHave = (winner, loser) => {
    if(loser.equipment.pouch.precious_stones.length > 0){
        const random = Math.floor( Math.random() * loser.equipment.pouch.precious_stones);
        winner.equipment.pouch.precious_stones.push(loser.equipment.pouch.precious_stones[random]);
        loser.equipment.pouch.precious_stones.splice(random, 1);
        console.log(`${winner.name} wins and take on precious stone from ${loser.name}`);
    }
}

gameCicle();
