import type { RowDataPacket } from 'mysql2';
import QueryUtils from './queryUtils';

export interface IUserDetailRow extends RowDataPacket {
    id: number
    id_user: number
    address: string
    gender: string
    createdAt: Date;
    updatedAt: Date;
}

const register = async (user: IUserDetailRow): Promise<IUserDetailRow> => {
    const result = await QueryUtils.ModifyQuery<IUserDetailRow>('INSERT INTO user_detail (id_user, address, gender) VALUES (?, ?, ?)', [user.id_user, user.address, user.gender]);
    return {
        ...user,
        id: result.insertId
    };
}

const getDataUser = async (userId: number) => {
    return QueryUtils.SelectQuery<IUserDetailRow>('SELECT users.*, user_detail.* FROM user_detail JOIN users ON user_detail.id_user = users.id WHERE users.id = ?', [userId]);
}


export default {
    register,
    getDataUser
}