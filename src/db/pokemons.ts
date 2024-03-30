import type { RowDataPacket } from 'mysql2';
import QueryUtils from './queryUtils';

export interface IPokemonRow extends RowDataPacket {
    id: number
    id_user: number
    name: string
    nickname: string
}

const getByUserId = async (id: number) => {
    return QueryUtils.SelectQuery<IPokemonRow>('SELECT * FROM my_pokemon_list WHERE id_user = ?', [id]);
}

const insertPokemon = async (data: IPokemonRow) => {
    return QueryUtils.ModifyQuery<IPokemonRow>('INSERT INTO my_pokemon_list (id_user, name, nickname) VALUES (?, ?, ?)', [data.id_user, data.name, data.nickname]);
}

export default {
    getByUserId,
    insertPokemon
}