import {encodedPassword} from "../../security/passwordManagement";
import User from "../../models/User";
import UserRepository from "../../repository/UserRepository";

export const createUser = async (req: any) : Promise<User> => {

    const existingUser = await UserRepository.findByEmail(req.payload.email);
    if (existingUser){
        throw new Error("Email already exist");
    }

    const hashPassword = await encodedPassword(req.payload.password)

    let user: User = {
        firstName : req.payload.firstName,
        lastName : req.payload.lastName,
        email: req.payload.email,
        password: hashPassword,
        isActive: true
    }
    return await UserRepository.insert(user);
}