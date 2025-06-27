import React from 'react';
import { useFetchBookByPictureUrlQuery } from '../redux/features/books/booksApi';

const SingleImageDiplay = ({ pictureUrl, className = '' }) => {
  const { data: book, error, isLoading } = pictureUrl
    ? useFetchBookByPictureUrlQuery(pictureUrl)
    : { data: null, error: null, isLoading: false };

  if (!pictureUrl) return <p>No picture URL provided</p>;
  if (isLoading) return <p>Loading book...</p>;
  if (error) return <p>Error loading book data</p>;
  if (!book) return <p>No book found for this picture</p>;
  return (
    
      
      <img src={book.picture_url} 
      alt={book.title}
      className={`object-cover object-center ${className}`}
      />
    
  );
};

export default SingleImageDiplay;
