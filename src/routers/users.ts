import { Router } from "express";
import { register, login } from "../controllers/UserController";

const router = Router();

// GET /api/users
router.post('/register', register);
router.get('/login', login);

export default router;