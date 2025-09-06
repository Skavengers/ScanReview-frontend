import React, { useState, useEffect } from 'react';
import { useSearchBooksQuery } from '../redux/features/books/booksApi';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {/*
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { data: books = [], error, isLoading } = useSearchBooksQuery(searchTerm, {
    skip: searchTerm.trim() === '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (books.length > 0) {
      // Show only top 5 suggestions
      setSuggestions(books.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [books]);

  const onChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      // Navigate to search results page with query param
      navigate(`/books/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (book) => {
    // Navigate to selected book detail page by id
    navigate(`/books/${book._id}`);
  };*/

  return (
    <div>Searchbar</div>
//    <div className="relative w-full max-w-md mx-auto">
//      <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 shadow">
//        <FaSearch className="text-gray-500 mr-2" />
//        <input
//          type="search"
//          placeholder="Search by title, alternate title, or author"
//          value={searchTerm}
//          onChange={onChange}
//          onKeyDown={onKeyDown}
//          className="flex-grow bg-transparent outline-none"
//          aria-label="Search books"
//          autoComplete="off"
//        />
//      </div>
//      {isLoading && <p className="mt-1 text-sm text-gray-500">Loading...</p>}
//      {error && <p className="mt-1 text-sm text-red-500">Error fetching search results</p>}
//      {suggestions.length > 0 && (
//        <ul className="absolute z-20 mt-1 w-full max-w-md bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
//          {suggestions.map((book) => (
//            <li
//              key={book._id}
//              onClick={() => handleSelectSuggestion(book)}
//              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
//              tabIndex={0}
//              onKeyDown={(e) => { if (e.key === 'Enter') handleSelectSuggestion(book); }}
//              role="button"
//              aria-label={`Select ${book.title}`}
//            >
//              {book.title}
//            </li>
//          ))}
//        </ul>
//      )}
//    </div>
  );
};

export default SearchBar;
