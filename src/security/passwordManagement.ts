const jwt = require("jsonwebtoken");
import bcrypt = require("bcrypt");

export const encodedPassword = async (password):Promise<string> => {
    // Generate a salt at level 10 strength
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export const comparePassword = async (cryptedPassword, password):Promise<string> => {
    return await bcrypt.compare(password, cryptedPassword);
}




