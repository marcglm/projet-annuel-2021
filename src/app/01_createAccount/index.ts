import {encodedPassword} from "../../security/passwordManagement";
import User, {verificationOfActivation, verificationOfPinCode} from "../../models/User";
import UserRepository from "../../repository/UserRepository";

export const createUser = async (req: any) : Promise<User> => {

    const existingUser = await UserRepository.findByEmail(req.payload.email);
    if (!existingUser) throw new Error("You need to receive an invitation link first !");
    verificationOfActivation(existingUser);
    verificationOfPinCode(req.payload.pinCode,existingUser.pinCode);

    const hashPassword = await encodedPassword(req.payload.password)

    let updatedUser: User = {
        firstName : req.payload.firstName,
        lastName : req.payload.lastName,
        email: req.payload.email,
        password: hashPassword,
        scope:existingUser.scope,
        isActive: true
    }
    await UserRepository.updateUser(updatedUser)
    return updatedUser;
}

export const createEmployee = async (req: any) => {
    const existedEmployee = await UserRepository.findByEmail(req.payload.email);

    if (!existedEmployee) throw new Error("Your manager must send you an invitation link first !");
    verificationOfActivation(existedEmployee);
    verificationOfPinCode(req.payload.pinCode,existedEmployee.pinCode);

    const hashPassword = await encodedPassword(req.payload.password)

    let employee: User = {
        firstName : req.payload.firstName,
        lastName : req.payload.lastName,
        email: req.payload.email,
        password: hashPassword,
        scope:existedEmployee.scope,
        isActive: true
    }
    await UserRepository.updateUser(employee)
    return employee;
}

export const createManager = async (req: any) : Promise<User> => {
    const existedManager = await UserRepository.findByEmail(req.payload.email);
    if (!existedManager) throw new Error("The administrator must send you an invitation link first !");
    verificationOfActivation(existedManager);
    verificationOfPinCode(req.payload.pinCode, existedManager.pinCode);

    const hashPassword = await encodedPassword(req.payload.password)

    let updatedEmployee: User = {
        email: req.payload.email,
        firstName : req.payload.firstName,
        lastName : req.payload.lastName,
        password: hashPassword,
        scope:existedManager.scope,
        isActive: true
    }

    await UserRepository.updateUser(updatedEmployee)
    return updatedEmployee;

}

