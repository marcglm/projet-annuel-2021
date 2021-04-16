
// Modules

import User from "./models/User";
import UserRepository from "./repository/UserRepository";

const Hapi = require('@hapi/hapi');
const env = require('dotenv');
env.config();
const AuthBearer = require('hapi-auth-bearer-token');
const HapiAuthJwt2 = require('hapi-auth-jwt2');
const mongoose = require("mongoose");
const Boom = require("@hapi/boom");



//const { hashPassword, createToken } = require('./passwordManagement.ts');

//Constantes
const PORT = process.env.PORT || '8080'
const server = Hapi.server({
    port: '3000',
    host: 'localhost'
});


const {createUser} = require("./app/01_createAccount/index");
const {createToken} = require("./security/tokenManagement");

mongoose.connect(
    ''+process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => console.log("connected to db")
);
const PATH_BASE = '/serveur/PA2021';
const validate =  async function (decoded, request, h) {
    const user = await UserRepository.findById(decoded.id)
    if (!user) { // verifie que l'utilisateur existe bien
        return { isValid: false };
    }
    else {
        return { isValid : true };
    }
};

const start = async () => {

    await server.register([
        {
            plugin :AuthBearer
        },
        {
            plugin:HapiAuthJwt2
        }
    ]);


    server.auth.strategy('restricted', 'jwt',
        {
            key: process.env.TOKEN,
            validate
        });

    //Rend toutes les routes sécurisées par défaut
    server.auth.default('restricted');


    // Creation d'un nouvel utilisateur
    //TO DO : A NETTOYER
    server.route({
        method: 'POST',
        path: PATH_BASE + '/adduser',
        config: {
            auth: false
        },
        handler: async (req, res) => {
            // validate the user
            try{
                console.log('USER VALID');
                const account = await createUser(req);
                console.log("account", account)
                return res.response({id_token: createToken(account)}).code(201);
            } catch(err) {
                res.response(err).code(500)
            }


        }
    });

    //Connexion à l'aide d'identifiants
    server.route({
        method: 'POST',
        path: PATH_BASE+'/login',
        options : {
            auth : {
                mode:'try'
            }
        },
        handler: async (req, res) => {

            const payload = req.payload;
            const user = await UserRepository.findByEmail(req.payload.email)

            if (!user || (user.email !== payload.email || user.password !== payload.password)  ) return Boom.badRequest('Email or password wrong');
            let token = createToken(user);

            return { token };
        }
    });

    server.route({
        method: 'GET',
        path: PATH_BASE+'/logout',
        handler: (req, res) => {
            req.cookieAuth.clear();
            return res.response('log out successful !');
        }
    });

    await server.start();
    return server;
}
start()
    .then((server) => console.log('Server started : %s', server.info.uri) )
    .catch(err =>{
        console.error(err);
        process.exit(1)
    })





