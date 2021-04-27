import Joi from "joi";

export const signupValidation = Joi.object({
    email: Joi.string().email().required()
        .description('A valid Email\'s employee')
        .example('example@domain.fr'),
    password: Joi.string().min(6).max(20).required()
        .description('A valid password')
        .example('valid_Password'),
    password2: Joi.string().min(6).max(20).required().valid(Joi.ref('password'))
        .description('A valid password identical to the password above')
        .example('valid_Password_confirmed'),
    firstName: Joi.string().required()
        .description(' Employee\'s firstname')
        .example('Josh'),
    lastName: Joi.string().required()
        .description('Employee\'s lastname')
        .example('Nobody')
}).label('Employee\'s Information')

export const signinValidation = Joi.object({
    email: Joi.string().email().required()
        .description('A valid Email\'s employee/manager')
        .example('example@domain.fr'),
    password: Joi.string().min(6).max(20).required()
        .description('A valid password')
        .example('valid_Password'),
}).label('Employee\'s credentials')

export const inviteValidation = Joi.object({
    email: Joi.string().email().required()
        .description('A valid Email\'s employee')
        .example('example@domain.fr'),
}).label('Employee\'s email')