import axios from "axios";
import type { Movie } from '../types/movie';

const token = import.meta.env.VITE_TMDB_TOKEN;


interface MovieResponse {
    results: Movie[];
}

export async function fetchMovies(query: string): Promise<Movie[]> {
    const response = await axios.get<MovieResponse>(
        "https://api.themoviedb.org/3/search/movie",
        {
            params: {
                query: query,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data.results;
}

