const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



//Fonction Haschage de password
const hashPassword = (password, cb) =>{
    // Generate a salt at level 10 strength
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            return cb(err, hash);
        });
    });
}

//Fonction qui créée un token
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
        process.env.TOKEN,
        { algorithm: 'HS256', expiresIn: "1h" } );

}

module.exports = {
    hashPassword,
    createToken,
};