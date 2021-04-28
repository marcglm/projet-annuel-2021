import Hapi = require('@hapi/hapi');
import env = require('dotenv');
import {generateHapiToken, HapiJwt, validate} from "./src/security/tokenManagement";
import {connectUser} from "./src/app/02_LoginAccount";
import {createUser} from "./src/app/01_createAccount";
import BaseResponse from "./src/responsemodel/BaseResponse";
import {errorPayload} from "./src/utils/api_utils";
import CreateUserResponse from "./src/responsemodel/CreateUserResponse";
import {userToUserResponse} from "./src/responsemodel/UserResponse";
import ConnectUserResponse from "./src/responsemodel/ConnectUserResponse";
import {userToUserConnectedResponse} from "./src/responsemodel/UserConnectedResponse";
import {sendInvitationLink} from "./src/app/03_sendLinkForInvitation";
import InviteUserResponse from "./src/responsemodel/InviteUserResponse";
import {responseToInviteResponse} from "./src/responsemodel/InviteResponse";
import {inviteHTTPStatus, signinHTTPStatus, signupHTTPStatus} from "./src/swagger/httpStatus";
import {inviteValidation, signinValidation, signupValidation} from "./src/swagger/validatePayload";
import {pluginsSwagger} from "./src/swagger/swaggerInit";
import {init} from "./initServer";
env.config();

const start = async () => {
    let server = await init()
    await server.start()
    console.log(`Started server, listening on ${server.info.uri}`);
}
process.on('unhandledRejection', (err) => {
    console.error("unhandledRejection");
    console.error(err);
    process.exit(1);
});

start()
