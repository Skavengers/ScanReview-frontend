import React, { useState, useEffect } from 'react';
import { useSearchBooksQuery } from '../redux/features/books/booksApi';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa6';
import { FaSearch } from "react-icons/fa";

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
    <div className="relative w-full bg-[#EAEAEA] rounded-md flex items-center px-6 md:px-8 py-2 shadow-sm focus:outline-none">
      
      <FaSearch className='  mr-2 inline-block left-3 inset-y-2'/>
      <input
        type="text"
        placeholder="Search by title, alternate title, or author"
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
      />
      {isLoading && <p className="absolute top-full mt-2 text-sm text-gray-500">Loading...</p>}
      {error && <p className="absolute top-full mt-2 text-sm text-red-500">Error occurred while fetching books</p>}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-auto">
          {suggestions.map((book) => (
            <li key={book._id} onClick={() => handleSuggestionClick(book)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800">
              {book.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
/*
    <div className="relative w-full bg-[#EAEAEA] rounded-md flex items-center px-6 md:px-8 py-2 shadow-sm focus:outline-none">
      <FaSearch className="text-gray-500 mr-3 text-lg" />
      <input
        type="text"
        placeholder="Search by title, alternate title, or author"
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
      />
      {isLoading && <p className="absolute top-full mt-2 text-sm text-gray-500">Loading...</p>}
      {error && <p className="absolute top-full mt-2 text-sm text-red-500">Error occurred while fetching books</p>}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-auto">
          {suggestions.map((book) => (
            <li
              key={book._id}
              onClick={() => handleSuggestionClick(book)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
            >
              {book.title}
            </li>
          ))}
        </ul>
      )}
    </div>






*/