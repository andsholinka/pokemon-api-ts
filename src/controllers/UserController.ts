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

        const [user] = await Users.getByEmail(req.body);

        if (!user) {
            return res.status(404).send(GeneralHelper.ResponseData(404, "Email not found", null, null));
        }

        if (typeof user.password !== 'string') {
            return res.status(401).send(GeneralHelper.ResponseData(401, "Unauthorized", null, null));
        }

        const match = await GeneralHelper.PasswordCompare(req.body.password, user.password);

        if (!match) {
            return res.status(401).send(GeneralHelper.ResponseData(401, "Unauthorized: Invalid credentials", null, null));
        }

        const dataUser = {
            id: user.id,
            username: user.username,
            email: user.email,
        }

        const token = GeneralHelper.GenerateToken(dataUser);
        const refreshToken = GeneralHelper.GenerateRefreshToken(dataUser);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        return res.status(200).send(GeneralHelper.ResponseData(200, "OK", null, { token }));
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
}

const RefreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).send(GeneralHelper.ResponseData(401, "unauthorized", null, null));
        }

        const decodedUser = GeneralHelper.ExtractRefreshToken(refreshToken);

        if (!decodedUser) {
            return res.status(401).send(GeneralHelper.ResponseData(401, "unauthorized", null, null));
        }

        const token = GeneralHelper.GenerateToken({
            id: decodedUser.id,
            username: decodedUser.username,
            email: decodedUser.email,
        });

        return res.status(200).send(GeneralHelper.ResponseData(200, "OK", null, token));
    } catch (error: any) {
        return res.status(500).send(GeneralHelper.ResponseData(500, "", error, null));
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

const getDataUser = async (req: Request, res: Response) => {
    try {
        const data = await UserDetail.getDataUser(res.locals.userId);

        res.status(200).send({ status: 200, message: "Success", data });
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
}

const getAllUser = async (req: Request, res: Response) => {
    try {
        const data = await Users.getAll();

        res.status(200).send({ status: 200, message: "Success", data });
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = Number(res.locals.userId)

        await Users.deleteUser(id);

        res.status(200).send({ status: 200, message: "Success", data: null });
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
}

const updatePassword = async (req: Request, res: Response) => {
    try {
        const { error } = ValidationHelper.updatePassword(req.body);

        if (error) {
            return res.status(400).send(GeneralHelper.ResponseData(400, "Bad Request", error.details[0].message, null));
        }

        const data = await GeneralHelper.PasswordHash(req.body.password);

        await Users.updatePassword(data, res.locals.userId);

        res.status(200).send({ status: 200, message: "Password successfully updated." });
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
}

const updateDetailUser = async (req: Request, res: Response) => {
    try {
        await UserDetail.updateDetailUser(req.body, res.locals.userId);

        res.status(200).send({ status: 200, message: "Data successfully updated." });
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
}

export default {
    register,
    login,
    uploadFile,
    getDataUser,
    getAllUser,
    deleteUser,
    updatePassword,
    updateDetailUser,
    RefreshToken
}