import {badRequest, Boom} from "@hapi/boom";
import {encodedPassword} from "../../security/passwordManagement";
import {registerValidation} from "../../utils/Validation";
import UserRepository from "../../repository/UserRepository";
import User from "../../models/User";
import {UserAlreadyExistedError, UserRequiredCredentialsError} from "../../Errors/UserError";

export const createUser = async (req):Promise<any> => {
    //console.log("-----UUTILISATEUR CREE------", req.payload)

    const {error} = registerValidation(req.payload);

    if (error) throw new UserRequiredCredentialsError(error);

    const isEmailExist = await UserRepository.findByEmail(req.payload.email);
    if (isEmailExist) throw new UserAlreadyExistedError("Email already exist");

    const hashPassword = await encodedPassword(req.payload.password)
    let user:User = {
       email:req.payload.email,
        password: hashPassword
    }
    //console.log("message" , user)
    return await UserRepository.insert(user);
}