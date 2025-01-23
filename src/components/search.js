import { useRef } from "react";
import { useKey } from "./useKey";

export default function Search({ query, setQuery }) {
  const inputSearch = useRef(null);

  useKey("Enter", enterSelect, inputSearch);

  function enterSelect() {
    if (document.activeElement === inputSearch.current) return;

    inputSearch.current.focus();
    setQuery("");
  }

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputSearch}
    />
  );
}
