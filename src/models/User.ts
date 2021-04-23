import {ObjectId} from "bson";

export default interface User {
    _id?: ObjectId
    email: string
    username: string
    password:string
    role:string
    manager: string
    isActive:boolean

}



