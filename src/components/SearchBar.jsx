import React, { useState, useEffect } from 'react';
import { useSearchBooksQuery } from '../redux/features/books/booksApi';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { data: books, error, isLoading } = useSearchBooksQuery(searchTerm);
  const navigate = useNavigate();

  useEffect(() => {
    if (books && books.length > 0) {
      // Get top 3 suggestions
      const topSuggestions = books.slice(0, 3);
      setSuggestions(topSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [books]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
    

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchTerm.trim()) {
      // Navigate to the book's page or search results page
      navigate(`/books/${encodeURIComponent(searchTerm.toLowerCase().replace(/ /g, "_"))}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Navigate to the book's page when a suggestion is clicked
    navigate(`/books/${encodeURIComponent(suggestion.title)}`);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by title, alternate title, or author"
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error occurred while fetching books</p>}
      {suggestions.length > 0 && (
        <ul className='absolute p-3'>
          {suggestions.map((book) => (
            <li key={book._id} onClick={() => handleSuggestionClick(book)}>
              {book.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
