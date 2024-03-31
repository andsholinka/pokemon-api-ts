import { Router } from "express";
import UserController from "../controllers/UserController";
import PokemonController from "../controllers/PokemonController";
import upload from "../helpers/fileUpload";
import Auth from '../middleware/auth';

const router = Router();

// GET /api/users
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/file-upload', upload.single('file'), UserController.uploadFile);
router.get('/pokemons', Auth, PokemonController.getMyPokemonList);
router.get('/detail', Auth, UserController.getDataUser);
router.get('/all', Auth, UserController.getAllUser);
router.delete('/', Auth, UserController.deleteUser);
router.put('/:id', Auth, UserController.updatePassword);

export default router;