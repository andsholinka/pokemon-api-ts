import { Request, Response } from "express";
import db from "../db";

export async function getOnePokemon(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        const [pokemon] = await db.pokemons.getOne(id);
        return res.status(200).send({
            status: 200,
            message: "Success",
            data: pokemon
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getAllPokemons(req: Request, res: Response) {
    try {
        const pokemons = await db.pokemons.getAll();
        return res.status(200).send({
            status: 200,
            message: "Success",
            data: pokemons
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}