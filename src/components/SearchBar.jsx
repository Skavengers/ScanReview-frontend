import React, { useState, useEffect, useRef } from 'react';
import { useSearchBooksQuery } from '../redux/features/books/booksApi';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import SingleImageDisplay from './SingleImageDisplay';
import { Link } from 'react-router-dom';
const BookCard = ({ book}) => {

  return (
    <div className="flex w-full flex-col overflow-hidden bg-white shadow-xl hover:bg-gray-200">
      <div className="flex-1 overflow-y-auto px-1 py-1 sm:px-6">

        <div className="">
          <div className="flow-root">
            <ul role="list" className=" divide-y divide-gray-200">
              <li className="flex ">

                <div className="h-28 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <SingleImageDisplay pictureUrl={book.picture_url} className="h-full w-full object-cover object-center" />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <p className=' mt-1 absolute right-5 font-extralight'>{book.meta?.status}</p>
                    <div className="flex flex-wrap justify-between text-base font-medium text-gray-900 mt-8">
                      <h3>
                        <Link to={`/books/${book._id}`}>{book.title}</Link>
                        
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                    <p className=" text-gray-500 bottom-1/2 right-2 mb-2">
                      <strong>Origin:</strong> {book?.origin_country}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { data: books = [], error, isLoading } = useSearchBooksQuery(searchTerm, {
    skip: searchTerm.trim() === '',
  });

  useEffect(() => {
    if (!books) {
      setSuggestions([]);
      return;
    }

    const topBooks = books.slice(0, 3);

    setSuggestions((prev) => {
      const same =
        prev.length === topBooks.length &&
        prev.every((p, i) => p._id === topBooks[i]._id);

      return same ? prev : topBooks;
    });
  }, [books]);

  const onChange = (e) => {
    setSearchTerm(e.target.value);
    setShowOverlay(e.target.value.trim() !== '');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      navigate(`/books/search?query=${encodeURIComponent(searchTerm.trim())}&pageSize=20`);
      setSuggestions([]);
      setShowOverlay(false);
    }
  };

  const handleSelectSuggestion = (book) => {
    navigate(`/books/${book._id}`);
    setSuggestions([]);
    setShowOverlay(false);
  };

  const clearInput = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowOverlay(false);
  };

  // Hide suggestions and overlay when clicking outside the search bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowOverlay(false);
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
{showOverlay && (
  <div
    className="fixed inset-0 backdrop-blur-xs z-10"
    aria-hidden="true"
  />
)}
      <div
        ref={containerRef}
        className="relative w-full max-w-md z-20"
      >
        <div className="flex items-center bg-gray-100 rounded-md px-full py-2 shadow relative">
          <FaSearch className='mx-3'/>
          <input
            type="search"
            placeholder="Search "
            value={searchTerm}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className="flex-grow bg-transparent outline-none px-15"
            aria-label="Search books"
            autoComplete="off"
          />
          {searchTerm && (
            <button
              onClick={clearInput}
              aria-label="Clear search"
              className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FaTimes />
            </button>
          )}
        </div>
        {isLoading && <p className="mt-1 text-sm text-gray-500">Loading...</p>}
        {error && <p className="mt-1 text-sm text-red-500">Error fetching search results</p>}
        {suggestions.length > 0 && (
<ul className="absolute z-30 mt-1 left-1/2 -translate-x-1/2 min-w-[500px] rounded-md overflow-y-auto bg-white shadow-lg">
  {suggestions.map((book) => (
    <li
      key={book._id}
      onClick={() => handleSelectSuggestion(book)}
      className="px-15 py-3 cursor-pointer hover:bg-gray-200"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleSelectSuggestion(book);
      }}
      role="button"
      aria-label={`Select ${book.title}`}
    >
      <BookCard book={book} />
    </li>
  ))}
</ul>

        )}
      </div>
    </>
  );
};

export default SearchBar;
