import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.scss";

const Autocomplete = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allPokemon, setAllPokemon] = useState<string[]>([]); 
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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
    if (!searchTerm) {
      setIsSearching(false);
      setSuggestions([]);
    } else {
      setError("");
      setIsSearching(true);
      const filteredSuggestions = allPokemon.filter((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(
        filteredSuggestions.length > 0
          ? filteredSuggestions
          : ["No results found"]
      );
    }
  };

  return (
    <div className="autocomplete">
      <h1>Pokemon Autocomplete</h1>
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleFilter(e.target.value);
        }}
        aria-label="Search Pokémon"
      />
      {error && <div className="error">{error}</div>}
      {isSearching && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index}>
              {suggestion !== "No results found" ? (
                suggestion
              ) : (
                <em>{suggestion}</em>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
