import {ObjectId} from "bson";

export default interface User {
    _id?: ObjectId
    email: string
    firstName: string
    lastName: string
    password:string
    role?:string
    manager?: string
    isActive:boolean
}



