import Joi from "joi";

interface Register {
    username: string;
    email: string;
    password: string;
}

export const registerValidation = (data: Register) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    return schema.validate(data);
}
export const loginValidation = (data: { email: string, password: string }) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    return schema.validate(data);
}