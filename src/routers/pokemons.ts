import { Router } from "express";
import { getPokemonsByUserId, getPokemonsFromPokeAPI } from "../controllers/PokemonController";
import Auth from '../middleware/auth';

const router = Router();

// GET /api/pokemons
router.get('/list', Auth, getPokemonsFromPokeAPI);
router.get('/users', Auth, getPokemonsByUserId);

export default router;