import {comparePassword} from "../../security/passwordManagement";
import User, {verificationOfUserExistence} from "../../models/User";
import {convertToObject} from "../../utils/conversion";
import UserRepository from "../../repository/UserRepository";

export const connectUser = async (request:any):Promise<User> => {

    let userRequest = convertToObject(request.payload);

    const userFounded = await UserRepository.findByEmail(request.payload.email);
    verificationOfUserExistence(userFounded)

    if(!await comparePassword(userFounded.password, userRequest.password)) throw new Error("Wrong password");

    return userFounded;
}