import User from "../models/User";

export default interface UserResponse {
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  scope?: string
}

export function userToUserResponse(user: User) {
  let scope = user.scope?.pop();

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isActive: user.isActive,
    scope
  };
}