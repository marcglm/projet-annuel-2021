import {ObjectId} from "bson";

export default interface User {
    _id?: ObjectId
    email: string
    password: string
    role?: string
}



