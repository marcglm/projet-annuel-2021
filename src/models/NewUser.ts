import {ObjectId} from "bson";

export default interface NewUser {
    _id?: ObjectId
    email:string
    username: string
    password:string
    role:string
    manager: string
    isValid:boolean
}