import type { RowDataPacket } from 'mysql2';
import { SelectQuery } from './queryUtils';

export interface IPokemonRow extends RowDataPacket {
    id: number
    pokemon_name: string
    nickname: string
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}

export function getAll() {
    return SelectQuery<IPokemonRow>('SELECT * FROM my_pokemon_lists;');
}

export async function getOne(id: number) {
    return SelectQuery<IPokemonRow>('SELECT * FROM my_pokemon_lists WHERE id = ?', [id]);
}