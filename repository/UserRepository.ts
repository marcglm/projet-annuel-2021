import {db} from "./db";
import User from "../models/User";
import {InsertResult} from "monk";


export default class UserRepository{
    static async findById(id: string): Promise<User> {
        let call = db.get('users');
        return await call.findOne({
            email: id
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
}