import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import SingleImageDisplay from '../../components/SingleImageDisplay';
import { Link } from 'react-router-dom';

const PictureCard = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  return (
    <div
      className="relative w-44 h-60 mx-2 mb-4 transform transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    ><Link to={`/books/${book._id}`}>
      <div className="relative w-full h-full rounded-lg overflow-hidden shadow-md">
        
          <SingleImageDisplay
            pictureUrl={book.picture_url}
            className="w-full h-full object-cover"
          />
        
        
        {isHovered && (
          <div className="absolute inset-0 flex items-end  bg-opacity-90 text-white ">
            <div className="w-full bg bg-black p-2">
              <div className="font-bold text-base truncate">{book.title}</div>
              <span className='bg-primary mb-5 inline-block w-4 h-[4px] '></span>
              <div className="text-sm truncate mb-3">Author: {book.authors[0]}</div>
              
            </div>
          </div>
        )}
      </div>
      </Link>
    </div>
  );
};

export default PictureCard;
