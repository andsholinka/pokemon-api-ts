import { Request, Response } from "express";
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

import Pokemons from "../db/pokemons";
import PokeAPI from "../services/pokeapiService";
import GeneralHelper from "../helpers/generalHelper";
import ValidationHelper from "../helpers/validationHelper";

const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: 6379
});
redis.on("ready", () => {
    console.log("Connected to Redis");
})

const getPokemonsFromPokeAPI = async (req: Request, res: Response) => {
    try {
        const result = await redis.get("pokemons")

        if (result !== null) {
            return res.status(200).send(GeneralHelper.ResponseData(200, "OK", null, JSON.parse(result)));
        }

        const pokemons = await PokeAPI.getPokeAPI();

        redis.set("pokemons", JSON.stringify(pokemons), 'EX', 120);

        return res.status(200).send(GeneralHelper.ResponseData(200, "OK", null, pokemons));
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error", error });
    }
}

const catchPokemon = async (req: Request, res: Response) => {
    try {
        const success = Math.random() < 0.5;
        if (!success) {
            return res.status(200).send(GeneralHelper.ResponseData(200, "Failed", null, `You failed to catch the ${req.body.name}`));
        }

        return res.status(200).send(GeneralHelper.ResponseData(200, "Success", null, `Gotcha! You successfully caught ${req.body.name}`));
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error", error });
    }
}

const addPokemon = async (req: Request, res: Response) => {
    try {
        const { error } = ValidationHelper.addPokemon(req.body);

        if (error) {
            return res.status(400).send(GeneralHelper.ResponseData(400, "Bad Request", error.details[0].message, null));
        }

        let data = req.body;
        data.id_user = res.locals.userId;

        await Pokemons.addPokemon(data);
        delete data.id_user

        return res.status(201).send(GeneralHelper.ResponseData(201, "OK", null, data));
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error", error });
    }
}

const getMyPokemonList = async (req: Request, res: Response) => {
    try {
        const pokemons = await Pokemons.getMyPokemonList(res.locals.userId);
        pokemons.forEach(pokemon => {
            delete pokemon.id_user
        })

        res.status(200).send({ status: 200, message: "Success", data: pokemons });
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error", error });
    }
}

export default {
    getPokemonsFromPokeAPI,
    catchPokemon,
    addPokemon,
    getMyPokemonList
}