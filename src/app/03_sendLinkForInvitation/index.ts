import UserRepository from "../../repository/UserRepository";
import {decodeHapiToken} from "../../security/tokenManagement";
import User from "../../models/User";
import Invitation from "../../models/Invitation";
const mailchimpTx = require('@mailchimp/mailchimp_transactional')("0zOTl9NoVM74vwzgTUr2vw");

export const sendInvitationLink = async (request:any):Promise<Invitation> => {

    //Get the decoded token
    let authorizationHeader = request.headers.authorization;
    let decodedToken = decodeHapiToken(authorizationHeader);

    //get a manager with Id
    let managerId = decodedToken.decoded.payload.user;
    let managerObject = await UserRepository.findById(managerId);

    let emailManager = managerObject.email;
    let emailEmployee = request.payload.email;

    let isEmailExisted = await UserRepository.findByEmail(emailEmployee);
    if (isEmailExisted) throw new Error("Email already exist");

    let user: User = {
        firstName : "",
        lastName : "",
        email: emailEmployee,
        password: "",
        role:"EMPLOYEE",
        manager:emailManager,
        isActive: false
    }

    await UserRepository.insert(user);

    const message = {
        from_email: "pros@cadeaudelamaison.com",
        subject: "Hello world",
        text: "Welcome to Mailchimp Transactional!",
        to: [
            {
                email: emailEmployee,
                type: "to"
            }
        ]
    };
    let responseMailChimp = await mailchimpTx.messages.send({message});
    return {
        responseMailChimp,
        emailManager
    }

}
