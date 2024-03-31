import Joi from "joi";

interface Register {
    username: string;
    email: string;
    password: string;
}

const registerValidation = (data: Register) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
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

export default {
    registerValidation,
    loginValidation,
    addPokemon
}