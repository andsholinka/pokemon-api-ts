import { Request, Response } from "express";

import Pokemons from "../db/pokemons";
import PokeAPI from "../services/pokeapiService";
import GeneralHelper from "../helpers/generalHelper";

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
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default {
    getPokemonsFromPokeAPI,
    getPokemonsByUserId
}