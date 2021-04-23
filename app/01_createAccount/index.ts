import {encodedPassword} from "../../security/passwordManagement";
import {registerValidation} from "../../utils/Validation";
import UserRepository from "../../repository/UserRepository";
import User from "../../models/User";
import {UserAlreadyExistedError, UserRequiredCredentialsError} from "../../Errors/UserError";
import { Request } from "@hapi/hapi";
import {convertToObject} from "../../utils/Convertion";
//import {convertToObject} from "../../utils/Convertion";

export const createUser = async (request: Request, role: string):Promise<any> => {

    const {error} = registerValidation(request.payload);
    if (error) throw new UserRequiredCredentialsError(error);

    let userObject = await convertToObject(request.payload);

    const isEmailExist = await UserRepository.findByEmail(userObject.email);
    if (isEmailExist) throw new UserAlreadyExistedError("Email already exist");

    const hashPassword = await encodedPassword(userObject.password)

    let user:User = {
       email:userObject.email,
        password: hashPassword,
        role:role
    }
    return await UserRepository.insert(user);
}

export const createUserTest = async (request:Request, role:string):Promise<any> => {
    const {error} = registerValidation(request.payload);
    if (error) throw new UserRequiredCredentialsError(error);

    let userObject = await convertToObject(request.payload);

    const hashPassword = await encodedPassword(userObject.password)

    let user:User = {
        email:userObject.email,
        password: hashPassword,
        role:role
    }

    return user;

}