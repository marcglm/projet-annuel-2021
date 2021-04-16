import {IMonkManager} from "monk";

const monk = require('monk')

// Connection URL
const url = `mongodb+srv://adminUser:adminPassword@cluster0.ekc8h.mongodb.net/projetAnnuelTest?retryWrites=true&w=majority`;
console.log(url)
export const db:IMonkManager = monk(url);