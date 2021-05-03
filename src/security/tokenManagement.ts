export import HapiJwt = require("@hapi/jwt");
import User from "../models/User";
import UserRepository from "../repository/UserRepository";


export const generateHapiToken = (user: User) =>{

    return HapiJwt.token.generate(
        {
            user : user._id,
            scope:user.role
        },
        {
            key : ""+process.env.TOKEN,
            algorithm: "HS256"
        });
}

export const decodeHapiToken = (token: string) =>{

    return HapiJwt.token.decode(token);
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

