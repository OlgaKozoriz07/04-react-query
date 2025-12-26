import { useQuery, keepPreviousData } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import { fetchMovies } from "../../services/movieService";
import { useEffect, useState } from "react";
import type { Movie } from "../../types/movie";
import MovieGrid  from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import type { MovieResponse } from "../../services/movieService";

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');


  const closeModal = () => {
    setSelectedMovie(null);
  }

  const { data, isLoading, isError, isSuccess } = useQuery<MovieResponse, Error>({
    queryKey: ['movie', query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query.trim() !== '',
    placeholderData: keepPreviousData,
    
  });

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && (data?.results.length ?? 0) === 0) {

      toast.error('No movies found for your request.')
    }
  }, [isSuccess, data]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
    setSelectedMovie(null);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

 return (
    <>
      <div className={css.app}>
        <Toaster />
        <SearchBar onSubmit={handleSearch} />
        {isSuccess && totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setCurrentPage(selected + 1)}
            forcePage={currentPage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}
        {isError ? (
          <ErrorMessage />
        ) : (
          data &&
          data.results.length > 0 && (
            <MovieGrid onSelect={handleSelectMovie} movies={data.results} />
          )
        )}
        {isLoading && <Loader />}
        {selectedMovie && (
          <MovieModal
            onClose={closeModal}
            movie={selectedMovie}
          ></MovieModal>
        )}
      </div>
    </>
  );
}

export default App;