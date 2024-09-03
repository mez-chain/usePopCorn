import { useEffect, useState } from "react";
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

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = 37397587;

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
  }

  function handleDeleteMovie(id) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );

        if (!res.ok) throw new Error("Error occured during movies fetching !");

        const data = await res.json();

        if (data.Response === "False") throw new Error("Movie not found!");

        setMovies(data.Search);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length <= 3) {
      setError("");
      setMovies([]);
      return;
    }
    fetchMovies();
  }, [query]);

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
              KEY={KEY}
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
