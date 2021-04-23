import Hapi = require('@hapi/hapi');
import HapiJwt = require('@hapi/jwt');
import env = require('dotenv');
import Boom = require("@hapi/boom");
import {generateHapiToken} from "./src/security/tokenManagement";
import {connectUser} from "./src/app/02_LoginAccount";
import UserRepository from "./src/repository/UserRepository";
import {convertToObject} from "./src/utils/conversion";
import {addManager, sendInvitationLink} from "./src/app/03_sendLinkForInvitation";
import {createUser} from "./src/app/01_createAccount";
import BaseResponse from "./src/responsemodel/BaseResponse";
import User from "./src/models/User";
import {errorPayload} from "./src/utils/api_utils";

env.config();

const PATH_BASE = ''

export const init = async function() {

    const server = Hapi.server({
        port: process.env.PORT || '8080',
        host: '0.0.0.0'
    });

    const validate = async function (
        artifacts: { decoded: { payload: { user: string } } },
        request: any,
        h: any
    ) {
        const user = await UserRepository.findById(artifacts.decoded.payload.user)
        if (!user || !user.role) return {isValid: false};
        else return {isValid: true};
    };

    await server.register(HapiJwt);

    server.auth.strategy('restricted', 'jwt',
        {
            keys: "" + process.env.TOKEN,
            validate,
            verify: false
        });

    server.auth.default('restricted');

    // Creation d'un nouvel utilisateur
    /*server.route({
        method: 'POST',
        path: PATH_BASE + '/adduser/{role}',
        options: {
            auth: false,
        },
        handler: async (request, res) => {
            try {
                const account = await createUser(request, request.params.role);
                return res.response({id_token: generateHapiToken(account)}).code(201);
            } catch (err) {
                //TO DO : voir comment effectuer le return de maniere propre
                return Boom.badRequest(err.message)
            }
        }
    });*/

    server.route({
        method: 'POST',
        path: PATH_BASE + '/adduser/{role}',
        options: {
            auth: false,
        },
        handler: async (req, res) : Promise<BaseResponse<User>> => {
            try{
                const account = await createUser(req);
                return {
                    code: 0,
                    payload: account
                }
            } catch(err) {
                return errorPayload<User>(err);
            }
        }
    });

    // Connexion à l'aide d'identifiants
    server.route({
        method: 'POST',
        path: PATH_BASE + '/login',
        options: {
            auth: {
                access: {
                    scope: ["employee", "manager"]
                }
            }
        },
        handler: async (req, res) => {
            try {
                const userConverted = convertToObject(req.payload);
                let user = await connectUser(userConverted.email, userConverted.password);
                let token = generateHapiToken(user);
                return { user, token };
            } catch (err) {
                return Boom.badRequest(err.message)
            }
        }
    });

    server.route({
        method: 'POST',
        path: PATH_BASE + '/sendmail',
        options: {
            auth: {
                access: {
                    scope: "manager"
                }
            }
        },
        handler: async (request, res) => {
            let promise = await sendInvitationLink(request);
            return res.response(promise)
        }
    });

    console.log(`Starting server, listening on ${server.settings.host}:${server.settings.port}`);
    await server.start();
};

process.on('unhandledRejection', (err) => {
    console.error("unhandledRejection");
    console.error(err);
    process.exit(1);
});

init()