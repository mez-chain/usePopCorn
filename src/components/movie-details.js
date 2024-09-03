import { useEffect, useState } from "react";
import StarRating from "./starRating";
import Loader from "./loader";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  KEY,
  onAddWatched,
  inWatched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState();

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Realeased: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      poster,
      runtime: Number(runtime.split(" ")[0]),
      year,
      imdbRating,
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(() => {
    async function fetchSelectedMovie() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
      console.log(data);
    }
    fetchSelectedMovie();
    setUserRating(null);
  }, [selectedId]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {inWatched.length ? (
                <>
                  <p>You already rated this movie</p>
                  <StarRating
                    maxRating={10}
                    size={24}
                    userRating={inWatched[0].userRating}
                    inWatched={inWatched}
                  />
                </>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    userRating={userRating}
                    onUserRating={setUserRating}
                    inWatched={inWatched}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
