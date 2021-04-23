import UserRepository from "../../repository/UserRepository";
import {comparePassword} from "../../security/passwordManagement";
import User from "../../models/User";

export const connectUser = async (email: string, password: string):Promise<User> => {
    if(!email) throw new Error("Email missing !");
    if(!password) throw new Error("Password missing !");
    const user = await UserRepository.findByEmail(email);
    if(!user) throw new Error("User not present in database");
    if(!await comparePassword(user.password, password)) throw new Error("Wrong password");
    return user;
}