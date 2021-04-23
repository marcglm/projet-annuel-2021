import {comparePassword} from "../../security/passwordManagement";
<<<<<<< HEAD:src/app/02_LoginAccount/index.ts
=======
import {UserNotFoundError, UserPasswordWrongError} from "../../errors/UserError";
>>>>>>> email:app/02_LoginAccount/index.ts
import User from "../../models/User";
import NewUserRepository from "../../repository/NewUserRepository";

export const connectUser = async (email: string, password: string):Promise<User> => {
    if(!email) throw new Error("Email missing !");
    if(!password) throw new Error("Password missing !");
<<<<<<< HEAD:src/app/02_LoginAccount/index.ts
    const user = await UserRepository.findByEmail(email);
    if(!user) throw new Error("User not present in database");
    if(!await comparePassword(user.password, password)) throw new Error("Wrong password");
=======
    const user = await NewUserRepository.findByEmail(email);
    if(!user) throw new UserNotFoundError("User not present in database");
    if(!await comparePassword(user.password, password)) throw new UserPasswordWrongError("Wrong password");
>>>>>>> email:app/02_LoginAccount/index.ts
    return user;
}