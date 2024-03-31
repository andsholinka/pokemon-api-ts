import { Request, Response } from "express";

import Pokemons from "../db/pokemons";
import PokeAPI from "../services/pokeapiService";
import GeneralHelper from "../helpers/generalHelper";
import ValidationHelper from "../helpers/validationHelper";

interface PokemonData {
    id: number;
    pokemonName: string;
    nickname: string;
}

interface ConstructsData {
    username: string;
    pokemons: PokemonData[];
}

const getMyPokemonList = async (req: Request, res: Response): Promise<void> => {
    try {
        const pokemons = await Pokemons.getMyPokemonList(res.locals.userId);

        const response: { [key: string]: ConstructsData } = {};

        pokemons.forEach(pokemon => {
            if (!response[pokemon.username]) {
                response[pokemon.username] = { username: pokemon.username, pokemons: [] };
            }
            response[pokemon.username].pokemons.push({
                id: pokemon.id || 0,
                pokemonName: pokemon.pokemonName || "",
                nickname: pokemon.nickname || ""
            });
        });

        const [result] = Object.values(response);

        res.status(200).send({ status: 200, message: "Success", data: result });
    } catch (error) {
        res.status(500).send({ status: 500, message: "Error", error });
    }
}

const getPokemonsFromPokeAPI = async (req: Request, res: Response) => {
    try {
        const pokemons = await PokeAPI.getPokeAPI();

        return res.status(200).send(GeneralHelper.ResponseData(200, "OK", null, pokemons));
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getPokemonsByUserId = async (req: Request, res: Response) => {
    try {
        const pokemon = await Pokemons.getByUserId(res.locals.userId);

        return res.status(200).send(GeneralHelper.ResponseData(200, "OK", null, pokemon));
    } catch (error) {
        return res.status(500).send(GeneralHelper.ResponseData(500, "Error", error, null));
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
        return res.status(500).send(GeneralHelper.ResponseData(500, "Error", error, null));
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

        return res.status(201).send(GeneralHelper.ResponseData(201, "OK", null, data));
    } catch (error) {
        return res.status(500).send(GeneralHelper.ResponseData(500, "Error", error, null));
    }
}

export default {
    getPokemonsFromPokeAPI,
    getPokemonsByUserId,
    catchPokemon,
    addPokemon,
    getMyPokemonList
}