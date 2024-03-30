import { Router } from "express";
import { register, login, uploadFile } from "../controllers/UserController";
import upload from "../helpers/fileUpload";

const router = Router();

// GET /api/users
router.post('/register', register);
router.get('/login', login);
router.post('/file-upload', upload.single('file'), uploadFile);

export default router;