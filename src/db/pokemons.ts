import type { RowDataPacket } from 'mysql2';
import { SelectQuery, ModifyQuery } from './queryUtils';

export interface IPokemonRow extends RowDataPacket {
    id: number
    id_user: number
    name: string
    nickname: string
}

export async function getByUserId(id: number) {
    return SelectQuery<IPokemonRow>('SELECT * FROM my_pokemon_list WHERE id_user = ?', [id]);
}

export async function insertPokemon(data: IPokemonRow) {
    return ModifyQuery<IPokemonRow>('INSERT INTO my_pokemon_list (id_user, name, nickname) VALUES (?, ?, ?)', [data.id_user, data.name, data.nickname]);
}