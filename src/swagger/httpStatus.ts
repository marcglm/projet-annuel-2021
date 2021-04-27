import Joi from "joi";

export const inviteHTTPStatus = {
    200: {
        description: 'email sent',
        schema: Joi.object({
            code: Joi.number()
                .example('0'),
            payload: Joi.object({
                invitation: Joi.object({
                    from:Joi.string()
                        .example('manager/proscadeauxdelamaison@domain.fr'),
                    to:Joi.string()
                        .example('employee@domain.fr'),
                    status:Joi.string()
                        .example("sent")
                })
            })
        }).label('Email sent Response Result')
    },
    400: {
        description: 'Something wrong happened',
        schema: Joi.object({
            code: Joi.number()
                .example('1'),
            msg: Joi.string().example('not sent')
        }).label('Bad response result')

    }
}

export const signupHTTPStatus = {
    200: {
        description: 'creation of employee\'s account successful',
        schema: Joi.object({
            code: Joi.number()
                .example('0'),
            payload: Joi.object({
                user: Joi.object({
                    firstName:Joi.string().example('Josh'),
                    lastName:Joi.string().example('Nobody'),
                    email:Joi.string().email().example('example@domain.fr'),
                    isValid:Joi.boolean()
                })
            }),
            token:Joi.string()
        }).label('Response Result')
    },
    400: {
        description: 'Something wrong happened',
        schema: Joi.object({
            code: Joi.number()
                .example('1'),
            msg: Joi.string().example('Email already exist')
        }).label('Bad response result')

    }
}

export const signinHTTPStatus = {
    200: {
        description: 'employee/manager\'s logged in successfully',
        schema: Joi.object({
            code: Joi.number()
                .example('0'),
            payload: Joi.object({
                user: Joi.object({
                    email:Joi.string().email().example('example@domain.fr'),
                    role:Joi.string().example('MANAGER')
                })
            }),
            token:Joi.string()
                .example('thisIsAToken-ey25412355/ffgff---fgdfgghhbvc')
        }).label('Response Result')
    },
    400: {
        description: 'Something wrong happened',
        schema: Joi.object({
            code: Joi.number()
                .example('1'),
            msg: Joi.string().example('No such user')
        }).label('Bad response result')

    }
}