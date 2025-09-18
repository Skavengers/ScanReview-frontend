import React, { useState, useEffect, useRef } from 'react';
import { useSearchBooksQuery } from '../../redux/features/books/booksApi';
// Pass a query hook and category prop for flexibility
const ItemSearchBar = ({ category, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // You need these hooks. Assume you have them defined:
  // useSearchWebtoonsQuery, useSearchCharactersQuery
  // Each returns { data, isLoading, error }
  // Use whichever is appropriate for the category.
  const { data = [], isLoading, error } =
    category === 'webtoon'
      ? useSearchBooksQuery(searchTerm, { skip: !searchTerm })
      : useSearchCharactersQuery(searchTerm, { skip: !searchTerm });

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      setResults(data.slice(0, 5));
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm, data]);

  const handleChange = (e) => setSearchTerm(e.target.value);

  const handleSelect = (item) => {
    onSelect(item); // Pass back selected item (which contains id and anything else)
    setSearchTerm(item.title);
    setShowDropdown(false);
  };

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
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded mt-1 w-full">
          {results.map((item) => (
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
