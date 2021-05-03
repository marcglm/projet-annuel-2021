let Hapi = require('@hapi/hapi');
import {generateHapiToken, HapiJwt, validate} from "./src/security/tokenManagement";
import {pluginsSwagger} from "./src/swagger/swaggerInit";
import {inviteHTTPStatus, signinHTTPStatus, signupEmployeeHTTPStatus, signupHTTPStatus} from "./src/swagger/httpStatus";
import {inviteValidation, signinValidation, signupValidation} from "./src/swagger/validatePayload";
import {errorPayload} from "./src/utils/api_utils";
import CreateUserResponse from "./src/responsemodel/CreateUserResponse";
import {createEmployee, createUser} from "./src/app/01_createAccount";
import {userToUserResponse} from "./src/responsemodel/UserResponse";
import ConnectUserResponse from "./src/responsemodel/ConnectUserResponse";
import {connectUser} from "./src/app/02_LoginAccount";
import {userToUserConnectedResponse} from "./src/responsemodel/UserConnectedResponse";
import InviteUserResponse from "./src/responsemodel/InviteUserResponse";
import {sendInvitationLink} from "./src/app/03_sendLinkForInvitation";
import {ResponseObject, ResponseToolkit} from "@hapi/hapi";

const server = Hapi.server({
    port: process.env.PORT || '3000',
    host: 'localhost'
});


export const init = async  () => {

    await server.register(HapiJwt);
    if (process.env.DEBUG) {
       await server.register(pluginsSwagger);
    }

    server.auth.strategy('restricted', 'jwt',
        {
            keys: "" + process.env.TOKEN,
            validate,
            verify: false
        }
    );
    server.auth.default('restricted');


    server.route({
        method: 'POST',
        path: '/addemployee',
        options: {
            description:'Add a new employee',
            notes:['Create a new employee with an email, a password, a confirmation password, a firstname, a lastname and a pin Code'],
            tags:['api'],
            plugins:{ 'hapi-swagger' : { responses : signupEmployeeHTTPStatus } },
            validate: {
                payload: signupValidation,
                failAction: (request:Request, h :ResponseToolkit, err:Error|undefined) => {
                    return h.response(errorPayload(err)).takeover().code(400)
                }
            }
        },
        handler: async (req:Request, res:ResponseToolkit) : Promise<ResponseObject> => {
            try{

                const user = await createEmployee(req);
                return res.response( {
                    code: 0,
                    payload: {
                        user: userToUserResponse(user),
                        token: generateHapiToken(user)
                    }
                }).code(200)
            }catch (err){
                return res.response(errorPayload<CreateUserResponse>(err)).code(400)
            }

        }
    });

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
                failAction: (request:Request, h :ResponseToolkit, err:Error|undefined) => {
                    return h.response(errorPayload(err)).takeover().code(400)
                }
            }
        },
        handler: async (req:Request, res:ResponseToolkit) : Promise<ResponseObject> => {
            try{
                const user = await createUser(req);
                return res.response( {
                    code: 0,
                    payload: {
                        user: userToUserResponse(user),
                        token: generateHapiToken(user)
                    }
                }).code(200)
            }catch (err){
                return res.response(errorPayload<CreateUserResponse>(err)).code(400)
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
                failAction: (request:Request, h :ResponseToolkit, err:Error|undefined) => {
                    return h.response(errorPayload(err)).takeover().code(400)
                }
            }
        },
        handler: async (req:Request, res:ResponseToolkit):Promise<ResponseObject> => {
            try {
                let user = await connectUser(req);
                return res.response({
                    code:0,
                    payload:{
                        user : userToUserConnectedResponse(user),
                        token :generateHapiToken(user)
                    }
                }).code(200);
            } catch (err) {
                return res.response(errorPayload<ConnectUserResponse>(err)).code(400);
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
            plugins:{ 'hapi-swagger' : { responses : inviteHTTPStatus } },
            validate: {
                payload: inviteValidation,
                failAction: (request:Request, h :ResponseToolkit, err:Error|undefined):ResponseObject => {
                    return h.response(errorPayload<InviteUserResponse>(err)).takeover().code(400)
                }
            }
        },
        handler: async (request:Request, res:ResponseToolkit):Promise<ResponseObject> => {
            try {
                await sendInvitationLink(request);
                return res.response().code(200);
            }catch (err){
                return res.response(errorPayload<InviteUserResponse>(err)).code(400);

            }
        }
    });

    await server.initialize();


    return server;
};
