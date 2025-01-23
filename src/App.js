import { useState } from "react";
import NavBar from "./components/navbar";
import Search from "./components/search";
import Results from "./components/results";
import Main from "./components/main";
import Box from "./components/box";
import Summary from "./components/summary";
import MovieInList from "./components/movie-in-list";
import WatchedMovie from "./components/watched-movie";
import Loader from "./components/loader";
import ErrorMessage from "./components/error-message";
import MovieDetails from "./components/movie-details";
import { useMovies } from "./components/useMovies";
import { useLocalStorageState } from "./components/useLocalStorageState";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  const [selectedId, setSelectedId] = useState(null);
  const inWatched = watched.filter((movie) => movie.imdbID === selectedId);

  function handleSelectedMovie(id) {
    setSelectedId(selectedId === id ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleWatchedMovie(movie) {
    setWatched([...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteMovie(id) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieInList movies={movies} />} */}
          {!isLoading && !error && (
            <MovieInList
              onSelectedMovie={handleSelectedMovie}
              movies={movies}
            />
          )}
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleWatchedMovie}
              watched={watched}
              inWatched={inWatched}
            />
          ) : (
            <>
              <Summary watched={watched} average={average} />
              <WatchedMovie
                watched={watched}
                onDeleteMovie={handleDeleteMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
