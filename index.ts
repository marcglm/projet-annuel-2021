import Hapi = require('@hapi/hapi');
import HapiJwt = require('@hapi/jwt');
import env = require('dotenv');
import Boom = require("@hapi/boom");
import {generateHapiToken} from "./src/security/tokenManagement";
import {connectUser} from "./src/app/02_LoginAccount";
import UserRepository from "./src/repository/UserRepository";
import {convertToObject} from "./src/utils/conversion";
import {sendInvitationLink} from "./src/app/03_sendLinkForInvitation";
import {createUser} from "./src/app/01_createAccount";
import BaseResponse from "./src/responsemodel/BaseResponse";
import User from "./src/models/User";
import {errorPayload} from "./src/utils/api_utils";
import Joi from "joi";

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
    server.route({
        method: 'POST',
        path: PATH_BASE + '/adduser/',
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().min(6).max(200).required(),
                    repeat_password: Joi.ref('password'),
                    username:Joi.string().required(),
                    role: Joi.string().required(),
                    manager:Joi.string().required().email(),
                    isActivated: Joi.boolean().required()
                }),
                failAction: (request, h, err) => {
                    return h.response(errorPayload(<Error>err)).takeover().code(400)
                }
            }
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
            },
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().min(6).max(200).required(),
                }),
                failAction: (request, h, err) => {
                    return h.response(err?.message).takeover().code(400)
                }
            }
        },
        handler: async (req, res) => {
            try {
                let user = await connectUser(req);
                let token = generateHapiToken(user);
                return { user, token };
            } catch (err) {
                return errorPayload<User>(err);
            }
        }
    });

    server.route({
        method: 'POST',
        path: PATH_BASE + '/sendmail',
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().min(6).max(200).required(),
                    repeat_password: Joi.ref('password'),

                }),
                failAction: (request, h, err) => {
                    return h.response(
                        errorPayload(<Error>err)
                    ).takeover().code(400)
                }
            }
        },
        handler: async (request, res) => {
            let convertToObject1 = convertToObject(request.payload);
            console.log(convertToObject1)
            return ' HELLO WORLD'
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