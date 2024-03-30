import { Router } from 'express';
import pokemonRouter from './pokemons';
import userRouter from './users';

const router = Router();

router.use('/pokemons', pokemonRouter);
router.use('/users', userRouter);

export default router