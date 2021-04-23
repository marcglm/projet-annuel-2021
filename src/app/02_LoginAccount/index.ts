import {comparePassword} from "../../security/passwordManagement";
import User from "../../models/User";
import {convertToObject} from "../../utils/conversion";
import UserRepository from "../../repository/UserRepository";

export const connectUser = async (request:any):Promise<User> => {

    let userRequest = convertToObject(request.payload);

    const userFounded = await UserRepository.findByEmail(request.payload.email);
    if (!userFounded) throw new Error("No such user");

    if(!await comparePassword(userFounded.password, userRequest.password)) throw new Error("Wrong password");

    return userFounded;
}