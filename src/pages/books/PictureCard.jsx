import React, { useState } from 'react'
import { getImgUrl } from '../../utils/getImgUrl'
// <img
//   alt=""
//   src={`${getImgUrl()}`}
//   className="h-full w-full object-cover object-center"
// />
/*
const BookCard = ({ book }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div
        className="relative w-48 mx-2 mb-4 transform transition-transform duration-300 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <img
            src={`${getImgUrl(book.main_title)}`}
            alt={book.main_title}
            className="w-full h-64 object-cover rounded-lg"
          />
          {isHovered && (
            <div className="absolute top-0 right-0  bg-grey-600 text-black p-2 w-32 h-full flex flex-col justify-between ">
              <div>
                <div className="font-bold text-sm">{book.authors[0]}</div>
                <div className="text-xs">Rating: {book.rated}%</div>
              </div>
              <div className="text-xs">
                <span className='bg-red-500 text-white'>Genre:</span> {book.genre.slice(0, 3).join(', ')}
              </div>
            </div>
          )}
        </div>
        <div className="mt-2 text-center text-sm font-semibold">
          {book.main_title}
        </div>
      </div>
    );
  };
  
  export default BookCard;*/
