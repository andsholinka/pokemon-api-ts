import { Request, Response } from "express";
import path from 'path'
import fs from "fs";

import db from "../db";
import cloudinary from "../helpers/cloudinary";
import GeneralHelper from "../helpers/GeneralHelper";
import { registerValidation, loginValidation } from "../helpers/validationHelper";

export async function register(req: Request, res: Response) {
    try {
        const { error } = registerValidation(req.body);

        if (error) {
            return res.status(400).send(GeneralHelper.ResponseData(400, "Bad Request", error.details[0].message, null));
        }

        const user = req.body;

        const [duplicateUser] = await db.users.getByEmail(user);

        if (duplicateUser) {
            return res.status(400).send(GeneralHelper.ResponseData(400, "Bad Request", 'Email already exists', null));
        }

        const hashed = await GeneralHelper.PasswordHash(user.password);
        user.password = hashed;

        await db.users.register(user);

        return res.status(201).send(GeneralHelper.ResponseData(201, "OK", null, user));
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { error } = loginValidation(req.body);

        if (error) {
            return res.status(400).send(GeneralHelper.ResponseData(400, "Bad Request", error.details[0].message, null));
        }

        const user = req.body;
        const [data] = await db.users.getByEmail(user);

        if (typeof data.password !== 'string') {
            return res.status(401).send(GeneralHelper.ResponseData(401, "Unauthorized", null, null));
        }

        const match = await GeneralHelper.PasswordCompare(user.password, data.password);

        if (!match) {
            return res.status(401).send(GeneralHelper.ResponseData(401, "Unauthorized", null, null));
        }

        const dataUser = {
            id: data.id,
            username: data.username,
            email: data.email,
        }

        const token = GeneralHelper.GenerateToken(dataUser);

        return res.status(200).send(GeneralHelper.ResponseData(200, "OK", null, { token }));
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function uploadFile(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).send(GeneralHelper.ResponseData(400, "Bad Request", 'Please upload an image', null));
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        fs.unlinkSync(path.join(__dirname, '../../src/uploads/') + req.file.filename)

        return res.status(200).send(GeneralHelper.ResponseData(200, "OK", null, { ulr: result.url }));
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}