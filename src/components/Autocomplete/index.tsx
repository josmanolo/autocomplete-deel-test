import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.scss";

const Autocomplete = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allPokemon, setAllPokemon] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const NO_RESULTS = "No results found";

  useEffect(() => {
    const fetchPokemonNames = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=150"
        );
        const names = response.data.results.map(
          (pokemon: { name: string }) => pokemon.name
        );
        setAllPokemon(names);
      } catch (error) {
        setError("Error loading data");
      }
    };

    fetchPokemonNames();
  }, []);

  const handleFilter = (searchTerm: string) => {
    setIsSearching(!!searchTerm);
    if (!searchTerm) {
      setSuggestions([]);
    } else {
      setError("");
      const filteredSuggestions = allPokemon.filter((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSuggestions(
        filteredSuggestions.length > 0 ? filteredSuggestions : [NO_RESULTS]
      );
    }
  };

  const highlightMatch = (name: string) => {
    if (!searchTerm) return name;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = name.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <strong key={index} className="highlight">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  return (
    <div className="autocomplete">
      <h1>Pokemon Autocomplete</h1>
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={(e) => {
          const term = e.target.value;
          setSearchTerm(term);
          handleFilter(term);
        }}
        aria-label="Search Pokémon"
      />
      {error && <div className="error">{error}</div>}
      {isSearching && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={suggestion === NO_RESULTS ? "no-results" : ""}
            >
              {suggestion !== NO_RESULTS
                ? highlightMatch(suggestion)
                : suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
