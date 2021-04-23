import UserConnectedResponse from "./UserConnectedResponse";

export default interface ConnectUserResponse {
    user: UserConnectedResponse
    token: string
}