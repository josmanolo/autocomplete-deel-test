import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./styles.scss";

interface AutocompleteProps {
  title: string;
  placeholder: string;
}

const Autocomplete = ({ title, placeholder }: AutocompleteProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allPokemon, setAllPokemon] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [error, setError] = useState("");

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

  const filterPokemon = useCallback(
    (searchTerm: string) => {
      return allPokemon.filter((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [allPokemon]
  );

  useEffect(() => {
    fetchPokemonNames();
  }, []);

  useEffect(() => {
    const results = searchTerm ? filterPokemon(searchTerm) : [];
    setFilteredSuggestions(results);
  }, [searchTerm, allPokemon, filterPokemon]);

  const highlightMatch = (name: string, searchTerm: string) => {
    if (!searchTerm) return name;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return name.split(regex).map((part, index) =>
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
      <h1>{title}</h1>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search Pokémon"
      />
      {error && <div className="error">{error}</div>}
      <ul>
        {filteredSuggestions.length > 0
          ? filteredSuggestions.map((suggestion, index) => (
              <li key={index}>{highlightMatch(suggestion, searchTerm)}</li>
            ))
          : searchTerm && <li className="no-results">No results found</li>}
      </ul>
    </div>
  );
};

export default Autocomplete;
