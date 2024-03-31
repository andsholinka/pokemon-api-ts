import type { RowDataPacket } from 'mysql2';
import QueryUtils from './queryUtils';

export interface IPokemonRow extends RowDataPacket {
    id: number
    id_user: number
    pokemonName: string
    nickname: string
}

const getMyPokemonList = async (id: number) => {
    return QueryUtils.SelectQuery<IPokemonRow>('SELECT * FROM my_pokemon_list WHERE id_user = ?', [id]);
}

const addPokemon = async (data: IPokemonRow) => {
    return QueryUtils.ModifyQuery<IPokemonRow>('INSERT INTO my_pokemon_list (id_user, pokemonName, nickname) VALUES (?, ?, ?)', [data.id_user, data.pokemonName, data.nickname]);
}

export default {
    addPokemon,
    getMyPokemonList
}