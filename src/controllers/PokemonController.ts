import { Request, Response } from "express";
import db from "../db";
import { getPokeAPI } from "../services/pokeapiService";
import GeneralHelper from "../helpers/GeneralHelper";

export async function getPokemonsFromPokeAPI(req: Request, res: Response) {
    try {
        const pokemons = await getPokeAPI();

        return res.status(200).send(GeneralHelper.ResponseData(200, "OK", null, pokemons));
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getPokemonsByUserId(req: Request, res: Response) {
    try {
        const pokemon = await db.pokemons.getByUserId(res.locals.userId);

        return res.status(200).send(GeneralHelper.ResponseData(200, "OK", null, pokemon));
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}