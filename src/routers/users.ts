import { Router } from "express";
import UserController from "../controllers/UserController";
import upload from "../helpers/fileUpload";

const router = Router();

// GET /api/users
router.post('/register', UserController.register);
router.get('/login', UserController.login);
router.post('/file-upload', upload.single('file'), UserController.uploadFile);

export default router;