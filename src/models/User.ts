import {ObjectId} from "bson";

export default interface User {
    _id?: ObjectId
    email: string
    firstName: string
    lastName: string
    password:string
    scope?:string[]
    manager?: string
    pinCode?:string
    isActive:boolean
}

export function verificationOfUserEmail(user: User) {
    if (user) throw new Error("Email already exist");
}

export function verificationOfUserExistence(user: User) {
    if (!user) throw new Error("No such User !");
}

export function verificationOfPinCode(pinCode: string, userPinCOde: string | undefined) {
    if(pinCode != userPinCOde) throw new Error(" Pin code invalid !");
}

