const Joi = require("@hapi/joi");

export const registerValidation = (payload: string | object) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required(),
        repeat_password: Joi.ref('password').required(),
        username:Joi.string().required(),
        role: Joi.string().required(),
        manager:Joi.string().required().email(),
        isActivated: Joi.boolean().required()
    });
    return schema.validate(payload);
};

export const loginValidation = (data: any) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required(),
    });

    return schema.validate(data);
};
