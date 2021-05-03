import {encodedPassword} from "../../security/passwordManagement";
import User from "../../models/User";
import UserRepository from "../../repository/UserRepository";

export const createUser = async (req: any) : Promise<User> => {

    const existingUser = await UserRepository.findByEmail(req.payload.email);
    if (!existingUser) throw new Error("Your manager need to send you an invitation link first !");

    if(!req.payload.isActive) throw new Error("account already created !");

    if(req.payload.pinCode != existingUser.pinCode) throw new Error(" Pin code invalid !");

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

export const createEmployee = async (req: any) : Promise<User> => {
    const existingUser = await UserRepository.findByEmail(req.payload.email);
    if (!existingUser) throw new Error("Your manager need to send you an invitation link first !");
    if(existingUser.isActive) throw new Error("account already created !");

    if(req.payload.pinCode != existingUser.pinCode) throw new Error(" Pin code invalid !");

    const hashPassword = await encodedPassword(req.payload.password)

    let updatedEmployee: User = {
        email: req.payload.email,
        firstName : req.payload.firstName,
        lastName : req.payload.lastName,
        password: hashPassword,
        isActive: true
    }

    await UserRepository.updateNewEmployee(updatedEmployee)
    return updatedEmployee;

}

