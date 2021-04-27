import Invitation from "../models/Invitation";

export default interface InviteResponse {
    from: string
    to: string
    status: string
}

export function responseToInviteResponse(response: Invitation) {
    return {
        from: response.emailManager,
        to:response.responseMailChimp[0].email,
        status:response.responseMailChimp[0].status
    };
}