import User from "../models/User";
import UserResponse from "./UserResponse";

export default interface CreateUserResponse {
  user: UserResponse
  token: string
}