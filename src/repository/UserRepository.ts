import {db} from "./db";
import User from "../models/User";
import {InsertResult, UpdateResult} from "monk";


export default class UserRepository{
    static async findById(id: string): Promise<User> {
        let call = db.get('users');
        return await call.findOne({
            _id: id
        });
    }

    static async findByEmail(email : string):Promise<User>{
        let call = db.get('users');
        return await call.findOne({
            email
        });

    }

    static async insert(user: User): Promise<User> {
        let call = db.get('users');
        return await call.insert(user);
    }

    static async updateUser(user: User):Promise<UpdateResult> {
        let call = db.get('users');
        return await call.update(
            {email:user.email},
            { $set: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    password: user.password,
                    isActive: user.isActive
                }
            }

        )
    }


    static async delete(email: string): Promise<User> {
        let call = db.get('users');
        return await call.findOneAndDelete({
            email
        })
    }

}