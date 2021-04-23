import {encodedPassword} from "../../security/passwordManagement";
import User from "../../models/User";
import UserRepository from "../../repository/UserRepository";

export const createUser = async (req: any) : Promise<User> => {

    const isEmailExist = await UserRepository.findByEmail(req.payload.email);
    if (isEmailExist) throw new Error("Email already exist");

    const hashPassword = await encodedPassword(req.payload.password)

    let user: User = {
        username : req.payload.username,
        email:req.payload.email,
        password: hashPassword,
        role : req.payload.role,
        manager : req.payload.manager,
        isActive : req.payload.isActivated,
    }
    return await UserRepository.insert(user);
}