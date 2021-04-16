const jwt = require("jsonwebtoken");

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

module.exports = {
    createToken,
};