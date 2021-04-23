import User from "../models/User";

export default interface UserConnectedResponse {
    email: string
    role?: string
}

export function userToUserConnectedResponse(user: User) {
    return {
        email: user.email,
        role: user.role
    };
}