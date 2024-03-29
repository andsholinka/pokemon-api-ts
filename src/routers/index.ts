import { Router } from 'express';
import pokemonRouter from './pokemons';

const router = Router();

router.use('/pokemons', pokemonRouter);

export default router