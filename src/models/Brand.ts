import {ObjectId} from "bson";
import User from "./User";
import Team from "./Team";

export default interface Brand {
    _id?: ObjectId
    emailManager:User
    listEmailEmployee:Array<Team>
}

