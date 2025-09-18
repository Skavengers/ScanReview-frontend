import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchBooksQuery } from '../../redux/features/books/booksApi';

// Custom hook for debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ItemSearchBar = ({ category, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounce search term to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Choose the correct query hook based on category and debounced term
  const { data = [], isLoading, error } =
    category === 'webtoon'
      ? useSearchBooksQuery(debouncedSearchTerm, { skip: !debouncedSearchTerm })
      : useSearchCharactersQuery(debouncedSearchTerm, { skip: !debouncedSearchTerm });

  // Show dropdown only when there is a debounced search term and results
  useEffect(() => {
    setShowDropdown(debouncedSearchTerm.trim().length > 0 && data.length > 0);
  }, [debouncedSearchTerm, data]);

  // useCallback to memoize event handlers
  const handleChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSelect = useCallback((item) => {
    onSelect(item);
    setSearchTerm(item.title || item.name);
    setShowDropdown(false);
  }, [onSelect]);

  return (
    <div className="relative w-full">
      <input
        type="search"
        placeholder={`Search ${category}`}
        value={searchTerm}
        onChange={handleChange}
        className="p-2 border rounded w-full"
        autoComplete="off"
      />
      {isLoading && <div className="text-xs mt-1">Loading...</div>}
      {error && <div className="text-xs text-red-500 mt-1">Error loading</div>}
      {showDropdown && (
        <ul className="absolute z-10 bg-white border rounded mt-1 w-full max-h-60 overflow-auto">
          {data.slice(0, 5).map((item) => (
            <li
              key={item._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {item.title || item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemSearchBar;
