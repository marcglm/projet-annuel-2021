import User from "../models/User";

export default interface UserResponse {
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  role?: string
}

export function userToUserResponse(user: User) {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isActive: user.isActive,
    role: user.scope
  };
}