const jwt = require("jsonwebtoken");
import JwtHapi = require("@hapi/jwt");
import User from "../models/User";


export const generateHapiToken = (user: User) =>{

    return JwtHapi.token.generate(
        {
            user : user._id,
            scope:user.role
        },
        {
            key : ""+process.env.TOKEN,
            algorithm: 'HS256'
        });
}
