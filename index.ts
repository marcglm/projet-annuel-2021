// Modules
import Hapi = require('@hapi/hapi');
import env = require('dotenv');
env.config();
import AuthBearer = require('hapi-auth-bearer-token');
import HapiJwt = require('@hapi/jwt');
import mongoose = require("mongoose");
import Boom = require("@hapi/boom");
import {generateHapiToken} from "./security/tokenManagement";
import {connectUser} from "./app/02_LoginAccount";
import UserRepository from "./repository/UserRepository";
import {createUser} from "./app/01_createAccount";

//Constantes
const PORT = process.env.PORT || '8080'
const server = Hapi.server({
    port: '3000',
    host: 'localhost'
});

mongoose.connect(
    ''+process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => console.log("connected to db")
);

const PATH_BASE = '/serveur/PA2021';

const validate =  async function (artifacts, request, h) {
    const user = await UserRepository.findById(artifacts.decoded.payload.user)
    if (!user) return { isValid: false };
    else return { isValid : true };
};

const start = async () => {

    await server.register([
        {
            plugin :AuthBearer
        },
        {
            plugin:HapiJwt
        }
    ]);


    server.auth.strategy('restricted', 'jwt',
        {
            keys: ""+process.env.TOKEN,
            validate,
            verify:false
        }
    );

    //Rend toutes les routes sécurisées par défaut
    server.auth.default('restricted');

    // Creation d'un nouvel utilisateur
    server.route({
        method: 'POST',
        path: PATH_BASE + '/adduser',
        config: {
            auth: false
        },
        handler: async (req, res) => {
            try{
                const account = await createUser(req);
                return res.response({id_token: generateHapiToken(account)}).code(201);
            } catch(err) {
                //TO DO : voir comment effectuer le return de maniere propre
                return Boom.badRequest(err.message)
            }
        }
    });

    //Connexion à l'aide d'identifiants
    server.route({
        method: 'POST',
        path: PATH_BASE+'/login',
        config : {
            auth : {
                mode:'try'
            }
        },
        handler: async (req, res) => {
            try {
                const userBody = req.payload;
                let user = await connectUser(userBody.email, userBody.password);
                let token = generateHapiToken(user);
                return { token : token };
            } catch (err) {
                //TO DO : voir comment effectuer le return de maniere propre
                return Boom.badRequest(err.message)
            }
        }
    });

    server.route({
        method: 'GET',
        path: PATH_BASE + '/restricted',
        handler: async (req, res) => {
            return res.response('HELLO WORLD')
        }
    });

    await server.start();
    return server;
}

start()
    .then((server) => console.log('Server started : %s', server.info.uri) )
    .catch(err =>
    {
        console.error(err);
        process.exit(1)
    })





