import Hapi = require('@hapi/hapi');
import {generateHapiToken, HapiJwt, validate} from "./src/security/tokenManagement";
import {pluginsSwagger} from "./src/swagger/swaggerInit";
import {inviteHTTPStatus, signinHTTPStatus, signupHTTPStatus} from "./src/swagger/httpStatus";
import {inviteValidation, signinValidation, signupValidation} from "./src/swagger/validatePayload";
import {errorPayload} from "./src/utils/api_utils";
import BaseResponse from "./src/responsemodel/BaseResponse";
import CreateUserResponse from "./src/responsemodel/CreateUserResponse";
import {createUser} from "./src/app/01_createAccount";
import {userToUserResponse} from "./src/responsemodel/UserResponse";
import ConnectUserResponse from "./src/responsemodel/ConnectUserResponse";
import {connectUser} from "./src/app/02_LoginAccount";
import {userToUserConnectedResponse} from "./src/responsemodel/UserConnectedResponse";
import InviteUserResponse from "./src/responsemodel/InviteUserResponse";
import {sendInvitationLink} from "./src/app/03_sendLinkForInvitation";
import {responseToInviteResponse} from "./src/responsemodel/InviteResponse";

const server = Hapi.server({
    port: process.env.PORT || '8080',
    host: '0.0.0.0'
});

export const init = async  () => {
    await server.initialize();

    await server.register(HapiJwt);
    await server.register(pluginsSwagger);

    server.auth.strategy('restricted', 'jwt',
        {
            keys: "" + process.env.TOKEN,
            validate,
            verify: false
        });


    server.auth.default('restricted');

    server.route({
        method: 'POST',
        path: '/signup',
        options: {
            description:'Add a new employee',
            notes:['Create a new employee with an email, a password, a confirmation password, a firstname and a lastname'],
            tags:['api'],
            auth: false,
            plugins:{ 'hapi-swagger' : { responses : signupHTTPStatus } },
            validate: {
                payload: signupValidation,
                failAction: (request, h, err) => {
                    return h.response(errorPayload(err)).takeover().code(400)
                }
            },
        },
        handler: async (req, res) : Promise<BaseResponse<CreateUserResponse>> => {

            const user = await createUser(req);
            return {
                code: 0,
                payload: {
                    user: userToUserResponse(user),
                    token: generateHapiToken(user)
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/signin',
        options: {
            description:'Connect an employee/manager',
            notes:['Connect an employee/manager with an email and a password'],
            tags:['api'],
            auth: false,
            plugins:{ 'hapi-swagger' : { responses : signinHTTPStatus } },
            validate: {
                payload: signinValidation,
                failAction: (request, h, err) => {
                    return h.response(errorPayload(err)).takeover().code(400)
                }
            }
        },
        handler: async (req, res):Promise<BaseResponse<ConnectUserResponse>> => {
            try {
                let user = await connectUser(req);
                return {
                    code:0,
                    payload:{
                        user : userToUserConnectedResponse(user),
                        token :generateHapiToken(user)
                    }
                };
            } catch (err) {
                return errorPayload<ConnectUserResponse>(err);
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/invite',
        options: {
            description:'Send an invitation link to an employee',
            notes:['Send a link by email for an employee to create an account'],
            tags:['api'],
            auth:false,
            plugins:{ 'hapi-swagger' : { responses : inviteHTTPStatus } },
            validate: {
                payload: inviteValidation,
                failAction: (request, h, err) => {
                    return h.response(errorPayload(err)).takeover().code(400)
                }
            }
        },
        handler: async (request, res):Promise<BaseResponse<InviteUserResponse>> => {
            try {
                let response = await sendInvitationLink(request);
                return {
                    code:0,
                    payload:{
                        invitation: responseToInviteResponse(response)
                    }
                };
            }catch (err){
                return errorPayload<InviteUserResponse>(err);

            }
        }
    });
    return server;
};
