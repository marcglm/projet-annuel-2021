import HapiJwt from"@hapi/jwt";
import User from "../models/User";
import UserRepository from "../repository/UserRepository";
import env from 'dotenv'
env.config()

export const generateHapiToken = (user: User) =>{

    return HapiJwt.token.generate(
        {
            user : user._id,
            scope:user.scope
        },
        {
            key : ""+process.env.TOKEN,
            algorithm: "HS256"
        });
}

export const decodeHapiToken = (token: string) =>{

    return HapiJwt.token.decode(token);
}

export const decodeTokenInHeader = (request: any) => {
    //Get the decoded token
    let authorizationHeader = request.headers.authorization.split(" ")[1];
    let decodedToken = decodeHapiToken(authorizationHeader);

    //return a user id
    return decodedToken.decoded.payload.user;
}


export const validate = async function (
    artifacts: { decoded: { payload: { user: string } } },
    request: any,
    h: any
) {
    const user = await UserRepository.findById(artifacts.decoded.payload.user)
    if (!user) {
        return {isValid: false};
    }
    return {isValid: true};
};

