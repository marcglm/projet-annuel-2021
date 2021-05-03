import UserRepository from "../../repository/UserRepository";
import {decodeHapiToken} from "../../security/tokenManagement";
import User from "../../models/User";
const mailchimpTx = require('@mailchimp/mailchimp_transactional')("0zOTl9NoVM74vwzgTUr2vw");
const RANDOMSTRING = require("randomstring");

export const sendInvitationLink = async (request:any) => {

    const EMPLOYEE_ROLE = "EMPLOYEE"
    const activateCode = RANDOMSTRING.generate({length: 10, charset: 'alphanumeric'});

    //Get the decoded token
    let authorizationHeader = request.headers.authorization.split(" ")[1];
    let decodedToken = decodeHapiToken(authorizationHeader);

    //get a manager with Id
    let managerId = decodedToken.decoded.payload.user;
    let managerObject = await UserRepository.findById(managerId);

    let emailManager = managerObject.email;
    let emailEmployee = request.payload.email;

    let existingUser = await UserRepository.findByEmail(emailEmployee);
    if (existingUser) throw new Error("Email already exist");


    let newEmployee: User = {
        firstName : "",
        lastName : "",
        email: emailEmployee,
        password: "",
        role:EMPLOYEE_ROLE,
        manager:emailManager,
        pinCode:activateCode,
        isActive: false
    }

    await UserRepository.insert(newEmployee);


    const message = {
        from_email: "pros@cadeaudelamaison.com",
        subject: "Hello world",
        text: "Welcome to Mailchimp Transactional!\n" +
            " Here is your code to activate your account"+activateCode,
        to: [
            {
                email: emailEmployee,
                type: "to"
            }
        ]
    };
    await mailchimpTx.messages.send({message});

}
