import {db} from "./db";
import {InsertResult, UpdateResult} from "monk";
import User from "../models/User";
import Team from "../models/Team";
import Brand from "../models/Brand";


export default class TeamRepository{
    static async findEmailManagerById(id: string): Promise<Array<User>> {
        let call = db.get('team');
        return await call.findOne({
            _id: id
        });
    }

    static async findEmailEmployeeByEmailManager(email : string):Promise<Array<User>>{
        let call = db.get('team');
        return await call.find({
            email
        });

    }

    static async findByEmailManager(email : string):Promise<any>{
        let call = db.get('team');
        return await call.find({email});

    }

    static async update(emailManager:string,emailEmployee:string):Promise<UpdateResult> {
        let call = db.get('team');

        return await call.update(
            {"emailManager": emailManager},
            {
                $push: {
                    listEmployee: {
                        emailEmployee
                    }
                }
            },
        );
    }


    static async insert(emailManager: string) {
        let call = db.get('team');
        return await call.insert(emailManager);
    }

    static async insertManager(manager: any) {
        let call = db.get('team');
        return await call.insert(manager);

    }
}