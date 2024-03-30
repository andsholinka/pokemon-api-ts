import { Request, Response, NextFunction } from "express";
import GeneralHelper from "../helpers/generalHelper";

const Auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (token === undefined) {
            return res.status(401).send(GeneralHelper.ResponseData(401, "Unauthorized", null, null));
        }

        const userData = GeneralHelper.ExtractToken(token);

        if (!userData) {
            return res.status(401).send(GeneralHelper.ResponseData(401, "Unauthorized", null, null));
        }

        res.locals.userId = userData?.id
        next();

    } catch (error: any) {
        return res.status(500).send(GeneralHelper.ResponseData(500, "Internal Server Error", error, null));
    }
}

export default Auth