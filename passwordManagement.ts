const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export const hashPassword = async (password):Promise<string> => {
    // Generate a salt at level 10 strength
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}



