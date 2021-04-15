
// Modules
const Hapi = require('@hapi/hapi');
const env = require('dotenv');
env.config();
const AuthBearer = require('hapi-auth-bearer-token');
const HapiAuthJwt2 = require('hapi-auth-jwt2');
const HapiMongo = require('hapi-mongodb');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Boom = require("@hapi/boom");


// validation
const { registerValidation, loginValidation } = require('./models/Validation');


//Constantes
const PORT = process.env.PORT || '8080'
const server = Hapi.server({
    port: PORT,
    host: 'localhost'
});

const User = require('./models/User');

mongoose.connect(
    ''+process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => console.log("connected to db")
);

//Fonction Haschage de password
function hashPassword(password, cb) {
    // Generate a salt at level 10 strength
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            return cb(err, hash);
        });
    });
}

const PATH_BASE = '/serveur/PA2021';

//Fonction qui créée un token
function createToken(user) {
   /* let scopes;
    // Check if the user object passed in
    // has admin set to true, and if so, set
    // scopes to admin
    if (user.admin) {
        scopes = 'admin';
    }*/
    // Sign the JWT
    return jwt.sign(
        { id: user._id/*, scope: scopes*/ },
        process.env.TOKEN,
        { algorithm: 'HS256', expiresIn: "1h" } );

}
const validate =  async function (decoded, request, h) {

    if (!User.findById(decoded.id)) { // verifie que l'utilisateur existe bien
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

    server.route({
        method: 'GET',
        path: PATH_BASE+'/',
        config : {
            auth : false
        },
        handler: (req, h) => {
            console.log('hello world');
           /* const response = h.response({ text: 'You used a Token!' });
            response.header("Authorization", req.headers.authorization);*/
            return h.response('hello world');
        }
    });

    // Creation d'un nouvel utilisateur
    //TO DO : A NETTOYER
    server.route({
        method: 'POST',
        path: PATH_BASE+'/adduser',
        config: {
            auth : false
        },
        handler: async (req, res) => {
            // validate the user
            const {error} = registerValidation(req.payload);

            // throw validation errors
            if (error) return Boom.badRequest(error.details[0].message);
            const isEmailExist = await User.findOne({ email: req.payload.email });

            // throw error when email already registered
            //TO DO : Améliorer le message d'erreur
            if (isEmailExist) return res.response('Email already exists').code(400);
            // hash the password
            const user = new User();
            try {
                //TO DO : REFRACTOR 132 to 146
                hashPassword(req.payload.password, (err, hash) => {
                    if (err) {

                        throw Boom.badRequest(err);

                    }
                    user.password = hash;
                    user.email=req.payload.email;
                    user.save((err, user) => {
                        if (err) {
                            console.log('BAD REQUEST');
                            throw Boom.badRequest(err);
                        }
                    });
                });
                console.log(user.email+ '  '+ user.password);
                return res.response({ id_token: createToken(user), email: user.email, password:user.password}).code(201);
            } catch(error) {
                return res.response(error).code(400);
            }

        }
    });

    // Afficher les informations utilisateur
    server.route({
        method: 'GET',
        path: '/getUserInfo/{id}',
        config : {
            auth : 'restricted'
        },
        handler: (req, h) => {
            return 'retourne un utilisateur en fonction de son id';
        }
    });

    // mettre à jour les informations utilisateur
    server.route({
        method: 'PUT',
        path: '/{id}',
        config : {
            auth : 'restricted'
        },
        handler: (req, h) => {
            return 'Update a single movie';
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

            const userByEmail = await User.findOne({ email: payload.email });
            if (!userByEmail || (userByEmail.email !== payload.email || userByEmail.password !== payload.password)  ) return Boom.badRequest('Email or password wrong');
            let token = createToken(userByEmail);

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





