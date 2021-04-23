import bcrypt = require("bcrypt");

export const encodedPassword = async (password: any):Promise<string> => {
    // Generate a salt at level 10 strength
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export const comparePassword = async (cryptedPassword: string, password: string):Promise<boolean> => {
    return await bcrypt.compare(password, cryptedPassword);
}




