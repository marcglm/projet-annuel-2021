import {encodedPassword} from "../../security/passwordManagement";
import {registerValidation} from "../../utils/validation";
import NewUserRepository from "../../repository/NewUserRepository";
import NewUser from "../../models/NewUser";

export const createUser = async (req: any) : Promise<NewUser> => {

    const {error} = registerValidation(req.payload);

    if (error) throw new Error(error);

    const isEmailExist = await NewUserRepository.findByEmail(req.payload.email);
    if (isEmailExist) throw new Error("Email already exist");

    const hashPassword = await encodedPassword(req.payload.password)

    let user: NewUser = {
        username : req.payload.username,
        email:req.payload.email,
        password: hashPassword,
        role : req.payload.role,
        manager : req.payload.manager,
        isValid : req.payload.isValid,
    }
    return await NewUserRepository.insert(user);
}