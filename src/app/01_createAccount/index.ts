import {badRequest, Boom} from "@hapi/boom";
import {encodedPassword} from "../../security/passwordManagement";
import {registerValidation} from "../../utils/Validation";
//import UserRepository from "../../repository/UserRepository";
import NewUserRepository from "../../repository/NewUserRepository";
import User from "../../models/User";
import {UserAlreadyExistedError, UserRequiredCredentialsError} from "../../errors/UserError";
import NewUser from "../../models/NewUser";

export const createUser = async (req):Promise<any> => {
    //console.log("-----UUTILISATEUR CREE------", req.payload)

    const {error} = registerValidation(req.payload);

    if (error) throw new UserRequiredCredentialsError(error);

    const isEmailExist = await NewUserRepository.findByEmail(req.payload.email);
    if (isEmailExist) throw new UserAlreadyExistedError("Email already exist");

    const hashPassword = await encodedPassword(req.payload.password)
    let user: NewUser = {
        username : req.payload.username,
        email:req.payload.email,
        password: hashPassword,
        role : req.payload.role,
        manager : req.payload.manager,
        isValid : req.payload.isValid,
    }
    //console.log("message" , user)
    return await NewUserRepository.insert(user);
}