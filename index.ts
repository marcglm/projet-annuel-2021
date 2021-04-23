import Hapi = require('@hapi/hapi');
import env = require('dotenv');
import HapiJwt = require('@hapi/jwt');
import Boom = require("@hapi/boom");
import {generateHapiToken} from "./src/security/tokenManagement";
import {connectUser} from "./src/app/02_LoginAccount";
import UserRepository from "./src/repository/UserRepository";
import {createUserTest} from "./src/app/01_createAccount";
import {convertToObject} from "./src/utils/conversion";
import {addManager, sendInvitationLink} from "./src/app/03_sendLinkForInvitation";

env.config();

const PORT = process.env.PORT || '3000';
const PATH_BASE = '/serveur/PA2021';

export const init = async function() {

    const server = Hapi.server({
        port: PORT,
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
        handler: async (request, res) => {
            try {
                const account = await createUserTest(request, request.params.role);

                return res.response({id_token: generateHapiToken(account)}).code(201);
            } catch (err) {
                //TO DO : voir comment effectuer le return de maniere propre
                return Boom.badRequest(err.message)
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
                return {token: token};
            } catch (err) {
                return Boom.badRequest(err.message)
            }
        }
    });

    // route de test
    server.route({
        method: 'POST',
        path: PATH_BASE + '/restricted',
        options: {
            auth: false
        },
        handler: async (req, res) => {
            let convertToTeamObject1 = await addManager(req);
            console.log(convertToTeamObject1)
            return res.response("HELLO WORLD")
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