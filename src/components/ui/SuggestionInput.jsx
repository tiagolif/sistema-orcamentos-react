import React, { useState, useRef, useEffect } from 'react';

const SuggestionInput = ({ value, onChange, onSelect, suggestions, placeholder, className, onKeyDown }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Novo estado para o índice destacado
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (value) {
      const lowercasedValue = value.toLowerCase();
      const filtered = suggestions.filter(suggestion =>
        suggestion.name.toLowerCase().includes(lowercasedValue)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setHighlightedIndex(-1); // Resetar destaque ao filtrar
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1); // Resetar destaque
    }
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1); // Resetar destaque ao clicar fora
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setShowSuggestions(filteredSuggestions.length > 0); // Mostrar sugestões ao digitar
  };

  const handleSelectSuggestion = (suggestion) => {
    onSelect(suggestion.name); // Passa apenas o nome da sugestão
    setShowSuggestions(false);
    setHighlightedIndex(-1); // Resetar destaque
  };

  const handleKeyDown = (event) => {
    if (showSuggestions && filteredSuggestions.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedIndex(prevIndex =>
          (prevIndex + 1) % filteredSuggestions.length
        );
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedIndex(prevIndex =>
          (prevIndex - 1 + filteredSuggestions.length) % filteredSuggestions.length
        );
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (highlightedIndex !== -1) {
          handleSelectSuggestion(filteredSuggestions[highlightedIndex]);
        } else {
          // Se nenhuma sugestão estiver destacada, passa o evento para o pai
          if (onKeyDown) {
            onKeyDown(event);
          }
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    } else {
      // Se as sugestões não estiverem visíveis, ou se não houver sugestões, passa o evento para o pai
      if (onKeyDown) {
        onKeyDown(event);
      }
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        id={`suggestion-input-${placeholder.replace(/\s/g, '-')}`}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
        onKeyDown={handleKeyDown} // Usar o handler interno
        placeholder={placeholder}
        className={`${className} flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent`}
        ref={inputRef}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul
          className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg"
          ref={suggestionsRef}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${index === highlightedIndex ? 'bg-gray-200' : ''}`}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SuggestionInput;