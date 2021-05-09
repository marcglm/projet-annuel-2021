import {encodedPassword} from "../../security/passwordManagement";
import User, {verificationOfPinCode} from "../../models/User";
import UserRepository from "../../repository/UserRepository";

export const createUser = async (req: any) : Promise<User> => {

    const existingUser = await UserRepository.findByEmail(req.payload.email);
    if (!existingUser) throw new Error("You need to receive an invitation link first !");
    if(existingUser.isActive) throw new Error("account already activated !");
    verificationOfPinCode(req.payload.pinCode,existingUser.pinCode);

    let scope = existingUser.scope?.pop();


    if(scope == 'MANAGER'){

    }
    if(scope == 'EMPLOYEE'){

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

export const createEmployee = async (req: any) => {
    const existingEmployee = await UserRepository.findByEmail(req.payload.email);
    if (!existingEmployee) throw new Error("Your manager need to send you an invitation link first !");

    if(existingEmployee.isActive) throw new Error("account already activated !");

    verificationOfPinCode(req.payload.pinCode,existingEmployee.pinCode);

    const hashPassword = await encodedPassword(req.payload.password)

    let employee: User = {
        firstName : req.payload.firstName,
        lastName : req.payload.lastName,
        email: req.payload.email,
        password: hashPassword,
        isActive: true
    }
    return await UserRepository.insert(employee);

}

export const createManager = async (req: any) : Promise<User> => {
    const existingUser = await UserRepository.findByEmail(req.payload.email);
    if (!existingUser) throw new Error("The administrator need to send you an invitation link first !");
    if(existingUser.isActive) throw new Error("account already activated !");

    verificationOfPinCode(req.payload.pinCode,existingUser.pinCode);

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

