import { Router } from "express";
import { getOnePokemon, getAllPokemons } from "../controllers/PokemonController";

const router = Router();

// GET /api/pokemons
router.get('/:id', getOnePokemon);
router.get('/', getAllPokemons);

export default router;