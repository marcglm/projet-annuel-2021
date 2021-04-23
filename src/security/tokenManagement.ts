const jwt = require("jsonwebtoken");
import JwtHapi = require("@hapi/jwt");

const createToken = (user)=>{
    /* let scopes;
     // Check if the user object passed in
     // has admin set to true, and if so, set
     // scopes to admin
     if (user.admin) {
         scopes = 'admin';
     }*/
    // Sign the JWT
    return jwt.sign(
        { id: user._id/*, scope: scopes*/ },
        ''+process.env.TOKEN,
        { algorithm: 'HS256', expiresIn: "1h" } ); // A VOIR

}

export const generateHapiToken = (user) =>{

    return JwtHapi.token.generate(
        {user : user._id},
        {
            key : ""+process.env.TOKEN,
            algorithm: 'HS256'
        });
}

export const decodeHapiToken = (encryptedToken) => {
    return JwtHapi.token.decode(encryptedToken);
}