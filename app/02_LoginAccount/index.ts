import UserRepository from "../../repository/UserRepository";
import {comparePassword} from "../../security/passwordManagement";
import {UserNotFoundError, UserPasswordWrongError} from "../../Errors/UserError";
import User from "../../models/User";
import NewUserRepository from "../../repository/NewUserRepository";

export const connectUser = async (email, password):Promise<User> => {
    if(!email) throw new Error("Email missing !");
    if(!password) throw new Error("Password missing !");
    const user = await NewUserRepository.findByEmail(email);
    if(!user) throw new UserNotFoundError("User not present in database");
    if(!await comparePassword(user.password, password)) throw new UserPasswordWrongError("Wrong password");
    return user;
}