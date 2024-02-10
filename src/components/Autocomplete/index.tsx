import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Autocomplete = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [pokemonNames, setPokemonNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchPokemonNames = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const names = response.data.results.map((pokemon: { name: string }) => pokemon.name);
        setPokemonNames(names);
      } catch (error) {
        console.error("Error loading:", error);
      }
    };

    fetchPokemonNames();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = pokemonNames.filter(name => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, pokemonNames]);

  return (
    <div className="autocomplete">
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
