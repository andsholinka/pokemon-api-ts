import Joi from "joi";

interface Register {
    username: string;
    email: string;
    password: string;
    address: string;
    gender: string;
}

const registerValidation = (data: Register) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
            .required()
            .messages({
                'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character. Minimum 8 characters in length.'
            }),
        address: Joi.string().required(),
        gender: Joi.string().required(),
    });

    return schema.validate(data);
}

const loginValidation = (data: { email: string, password: string }) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    return schema.validate(data);
}

const addPokemon = (data: { pokemonName: string, nickname: string }) => {
    const schema = Joi.object({
        pokemonName: Joi.string().required(),
        nickname: Joi.string().required(),
    });

    return schema.validate(data);
}

const updatePassword = (data: Register) => {
    const schema = Joi.object({
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
            .required()
            .messages({
                'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character. Minimum 8 characters in length.'
            }),
    });

    return schema.validate(data);
}

export default {
    registerValidation,
    loginValidation,
    addPokemon,
    updatePassword
}