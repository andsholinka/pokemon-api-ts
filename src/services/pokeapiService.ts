import axios from "axios";

export async function getPokeAPI() {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=10`);
        return response.data.results;
    } catch (error) {
        throw new Error("Failed to fetch Pokemons");
    }
}
