import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaFire, FaPlus } from "react-icons/fa";
import SingleImageDisplay from '../../components/SingleImageDisplay';
//import { fetchBookActivities } from '../../redux/features/books/booksActivitySlice';
// used in the menu
const BookCard = ({ book, isTierList = true }) => {
  const dispatch = useDispatch();


  return (
    <div className="flex mt-10 h-full flex-col overflow-hidden bg-white shadow-xl">
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="flex items-start justify-between"></div>

        <div className="mt-4">
          <div className="flow-root">
            <ul role="list" className="-my-4 divide-y divide-gray-200">
              <li className="flex ">
                <div className="ml-3 flex h-7 items-center">
                  <button 
                    type="button"
                    className="relative -top-2 left-4 -m-2 py-1 px-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-400"
                  >
                    <span>
                      <FaFire />
                    </span>
                  </button>
                </div>

                <div className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <SingleImageDisplay pictureUrl={book.picture_url} className="h-full w-full object-cover object-center" />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex flex-wrap justify-between text-base font-medium text-gray-900">
                      <h3>
                        <Link to={`/books/${book._id}`}>{book.title}</Link>
                      </h3>
                      {isTierList ? (
                        <div className="ml-3 flex h-7 items-center gap-1">
                          <button
                            type="button"
                            className="relative -top-2 left-1 -m-2 py-1.5 px-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-400"
                          >
                            <span>
                              <FaPlus />
                            </span>
                          </button>
                        </div>
                      ) : (
                        <p className="absolute top-15 right-1 -mt-4 mr-2 text-sm text-gray-500">{book.meta?.status}</p>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 capitalize">
                      <strong>Category:</strong>
                      {(book.genres ?? []).slice(0, 6).map((g, i, array) => (
                        <span key={i}>
                          {g}
                          {i < array.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                    <p className="text-gray-500">
                      <strong>Origin:</strong> {book?.origin_country}
                    </p>

                    <div className="flex">
                      <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                        {book.stats.average_rating == 0 ? 'not rated' : book.stats.average_rating}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Descriptions</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          {book.description.length > 200 ? `${book?.description.slice(0, 200)}...` : book.description}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
