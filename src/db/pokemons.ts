import type { RowDataPacket } from 'mysql2';
import QueryUtils from './queryUtils';

export interface IPokemonRow extends RowDataPacket {
    id: number
    id_user: number
    pokemonName: string
    nickname: string
}

const getByUserId = async (id: number) => {
    return QueryUtils.SelectQuery<IPokemonRow>('SELECT * FROM my_pokemon_list WHERE id_user = ?', [id]);
}

const addPokemon = async (data: IPokemonRow) => {
    return QueryUtils.ModifyQuery<IPokemonRow>('INSERT INTO my_pokemon_list (id_user, pokemonName, nickname) VALUES (?, ?, ?)', [data.id_user, data.pokemonName, data.nickname]);
}

const getMyPokemonList = async (userId: number) => {
    return QueryUtils.SelectQuery<IPokemonRow>('SELECT users.username, my_pokemon_list.* FROM my_pokemon_list JOIN users ON my_pokemon_list.id_user = users.id WHERE users.id = ?', [userId]);
}

export default {
    getByUserId,
    addPokemon,
    getMyPokemonList
}