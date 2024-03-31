import { Request, Response } from "express";
import path from 'path'
import fs from "fs";

import Users from "../db/users";
import UserDetail from "../db/userDetail";
import QueryUtils from "../db/queryUtils";
import cloudinary from "../helpers/cloudinary";
import GeneralHelper from "../helpers/generalHelper";
import ValidationHelper from "../helpers/validationHelper";


const register = async (req: Request, res: Response) => {
    try {
        const { error } = ValidationHelper.registerValidation(req.body);

        if (error) {
            return res.status(400).send(GeneralHelper.ResponseData(400, "Bad Request", error.details[0].message, null));
        }

        const [duplicateUser] = await Users.getByEmail(req.body);

        if (duplicateUser) {
            return res.status(409).send(GeneralHelper.ResponseData(409, "Conflict", 'Email already exists', null));
        }

        await QueryUtils.startTransaction();

        req.body.password = await GeneralHelper.PasswordHash(req.body.password);

        const userResult = await Users.register(req.body);
        req.body.id_user = userResult.id

        const result = await UserDetail.register(req.body);

        await QueryUtils.commitTransaction();

        return res.status(201).send(GeneralHelper.ResponseData(201, "OK", null, result));
    } catch (error) {
        await QueryUtils.rollbackTransaction();
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { error } = ValidationHelper.loginValidation(req.body);

        if (error) {
            return res.status(400).send(GeneralHelper.ResponseData(400, "Bad Request", error.details[0].message, null));
        }

        const [data] = await Users.getByEmail(req.body);

        if (!data) {
            return res.status(404).send(GeneralHelper.ResponseData(404, "Email not found", null, null));
        }

        if (typeof data.password !== 'string') {
            return res.status(401).send(GeneralHelper.ResponseData(401, "Unauthorized", null, null));
        }

        const match = await GeneralHelper.PasswordCompare(req.body.password, data.password);

        if (!match) {
            return res.status(401).send(GeneralHelper.ResponseData(401, "Unauthorized: Invalid credentials", null, null));
        }

        const dataUser = {
            id: data.id,
            username: data.username,
            email: data.email,
        }

        const token = GeneralHelper.GenerateToken(dataUser);

        return res.status(200).send(GeneralHelper.ResponseData(200, "OK", null, { token }));
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
}

const uploadFile = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).send(GeneralHelper.ResponseData(400, "Bad Request", 'Please upload an image', null));
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        fs.unlinkSync(path.join(__dirname, '../../src/uploads/') + req.file.filename)

        return res.status(200).send(GeneralHelper.ResponseData(200, "OK", null, { ulr: result.url }));
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
}

const getDataUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await UserDetail.getDataUser(res.locals.userId);

        res.status(200).send({ status: 200, message: "Success", data });
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
}

export default {
    register,
    login,
    uploadFile,
    getDataUser
}