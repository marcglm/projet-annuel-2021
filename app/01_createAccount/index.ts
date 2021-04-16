import {badRequest, Boom} from "@hapi/boom";
import {hashPassword} from "../../passwordManagement";
import {registerValidation} from "../../utils/Validation";
import UserRepository from "../../repository/UserRepository";
import User from "../../models/User";

export const createUser = async (req):Promise<any> => {
    console.log("---------------------", req.payload)
    const {error} = registerValidation(req.payload);

    // throw validation errors
    if (error) return badRequest(error.details[0].message);

    const isEmailExist = await UserRepository.findByEmail(req.payload.email);

    // throw error when email already registered
    //TO DO : Améliorer le message d'erreur
    if (isEmailExist) return badRequest('Email already exists');
    const password = await hashPassword(req.payload.password)
    // hash the password
    let user:User = {
       email:req.payload.email,
        password
    }
    console.log("message" , user)
    return await UserRepository.insert(user);
}