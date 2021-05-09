import {IMonkManager} from "monk";
import env from 'dotenv'
env.config()
const monk = require('monk')

// Connection URL
let url;
if(process.env.NODE_ENV == "test") {
    url = process.env.MONGO_LOCAL_USERNAME +':'+process.env.MONGO_LOCAL_PASSWORD + process.env.MONGO_LOCAL_URL;
}
if(process.env.NODE_ENV == "production") {
    url = process.env.MONGO_URL;
}
console.log("Connect to mongo database")
export const db:IMonkManager = monk(url);
