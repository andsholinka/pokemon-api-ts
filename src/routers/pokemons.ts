import { Router } from "express";
import PokemonController from "../controllers/PokemonController";
import Auth from '../middleware/auth';

const router = Router();

// GET /api/pokemons
router.get('/list', Auth, PokemonController.getPokemonsFromPokeAPI);
router.get('/users', Auth, PokemonController.getPokemonsByUserId);
router.post('/catch', Auth, PokemonController.catchPokemon);
router.post('/add', Auth, PokemonController.addPokemon);

export default router;