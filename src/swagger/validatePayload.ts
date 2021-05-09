import Joi from "joi";
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
    min: 6,
    max: 20,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount:4
};

export const signupValidation = Joi.object({
    email: Joi.string().email().required()
        .description('A valid email')
        .example('example@domain.fr'),
    password: passwordComplexity(complexityOptions)
        .required()
        .description('A valid password : ' +
            '- Must contain at least one digit [0-9]\n ' +
            '- Must contain at least one lowercase Latin character [a-z]\n ' +
            '- Must contain at least one uppercase Latin character [A-Z]\n ' +
            '- Must contain at least one special character like ! @ # & ( )\n ' +
            '- Must contain a length of at least 8 characters and a maximum of 20 characters')
        .example('valid_Password'),
    password2: Joi.string().min(6).max(20).required().valid(Joi.ref('password'))
        .description('A valid password identical to the password above')
        .example('valid_Password_confirmed'),
    firstName: Joi.string().required()
        .description('Firstname')
        .example('Josh'),
    lastName: Joi.string().required()
        .description('Lastname')
        .example('Nobody'),
    pinCode: Joi.string().required()
        .description('An alphanumeric code you received with the invitation link')
}).label('Employee\'s Information')

export const signinValidation = Joi.object({
    email: Joi.string().email().required()
        .description('A valid Email\'s employee/manager')
        .example('example@domain.fr'),
    password: Joi.string()
        .required()
        .description('A valid password')
        .example('valid_Password'),
}).label('Employee\'s credentials')

export const inviteValidation = Joi.object({
    email: Joi.string().email().required()
        .description('A valid Email\'s employee')
        .example('example@domain.fr'),
}).label('Employee\'s email')