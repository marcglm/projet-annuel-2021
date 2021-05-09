import UserRepository from "../../repository/UserRepository";
import {decodeTokenInHeader} from "../../security/tokenManagement";
import User, {verificationOfUserEmail, verificationOfUserExistence} from "../../models/User";
import env from 'dotenv'
env.config()
const mailchimpTx = require('@mailchimp/mailchimp_transactional')(process.env.API_KEY_MAILCHIMP);
const RANDOMSTRING = require("randomstring");


function initUserAndEmailBody(newUserEmail: string, managerEmail:string, role:string ) {
    const activateCode = RANDOMSTRING.generate({length: 10, charset: 'alphanumeric'});
    let newUser: User = {
        firstName: "",
        lastName: "",
        email: newUserEmail,
        password: "",
        scope: [role],
        manager: managerEmail,
        pinCode: activateCode,
        isActive: false
    }

    const message = {
        from_email: "pros@cadeaudelamaison.com",
        subject: "Welcome Manager",
        text: "Welcome to Mailchimp Transactional!\n" +
            " Here is your code to activate your account : " + activateCode,
        to: [
            {
                email: newUserEmail,
                type: "to"
            }
        ]
    };
    return { message , newUser};
}

export const sendInvitationLink = async (request:any) => {

    let newUserAndMessage;
    let userId = decodeTokenInHeader(request);
    let userCaller = await UserRepository.findById(userId);
    verificationOfUserExistence(userCaller)
    let scope = userCaller.scope?.pop();

    if( scope === 'MANAGER'){
        let emailNewEmployee = request.payload.email;
        let emailManager = userCaller.email;
        let existingEmployee = await UserRepository.findByEmail(emailNewEmployee);
        verificationOfUserEmail(existingEmployee);

        newUserAndMessage = initUserAndEmailBody(emailNewEmployee, emailManager,"EMPLOYEE");

        let message = newUserAndMessage.message
        await UserRepository.insert(newUserAndMessage.newUser);
        await mailchimpTx.messages.send({message});

    }
    else if (scope === 'ADMIN' ){
            let emailNewManager = request.payload.email;
            let emailAdmin = "";
            let existingManager = await UserRepository.findByEmail(emailNewManager);
            verificationOfUserEmail(existingManager);

            newUserAndMessage = initUserAndEmailBody(emailNewManager, emailAdmin,"MANAGER");

            let message = newUserAndMessage.message
            await UserRepository.insert(newUserAndMessage.newUser);
            await mailchimpTx.messages.send({message});

    }


}
