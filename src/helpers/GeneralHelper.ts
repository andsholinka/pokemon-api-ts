import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface userData {
    id: number,
    username: string,
    email: string,
}

const ResponseData = (status: number, message: string | null, error: any | null, data: any | null) => {
    if (error != null) {
        const response = {
            status: status,
            message: message,
            error: error,
        }

        return response;
    }

    const response = {
        status,
        message,
        data
    }

    return response;
}

const PasswordHash = async (password: string): Promise<string> => {

    const result = await bcrypt.hash(password, 10);

    return result;
}

const PasswordCompare = async (password: string, passwordHash: string): Promise<boolean> => {

    const result = await bcrypt.compare(password, passwordHash);

    return result;
}

const GenerateToken = (data: any): string => {
    const token = jwt.sign(data, process.env.JWT_TOKEN as string, { expiresIn: '1m' });
    return token;
}

const ExtractToken = (token: string): userData | null => {
    const secretKey: string = process.env.JWT_TOKEN as string;

    let responseData: any;

    jwt.verify(token, secretKey, (err: any, decoded: any) => {
        if (err) {
            responseData = null
        } else {
            responseData = decoded
        }
    })

    if (responseData) {
        const result: userData = <userData>(responseData);
        return result;
    }
    return null;
}

const GenerateRefreshToken = (data: any): string => {
    const token = jwt.sign(data, process.env.JWT_REFRESH_TOKEN as string, { expiresIn: '1d' });
    return token;
}

const ExtractRefreshToken = (token: string): userData | null => {
    const secretKey: string = process.env.JWT_REFRESH_TOKEN as string;

    let responseData: any;

    const res = jwt.verify(token, secretKey, (err: any, decoded: any) => {
        if (err) {
            responseData = null
        } else {
            responseData = decoded
        }
    })

    if (responseData) {
        const result: userData = <userData>(responseData);
        return result;
    }
    return null;
}

export default {
    ResponseData,
    PasswordHash,
    PasswordCompare,
    GenerateToken,
    ExtractToken,
    GenerateRefreshToken,
    ExtractRefreshToken
}