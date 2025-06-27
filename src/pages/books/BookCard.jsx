import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { FaFire } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
//import { useDispatch } from'react-redux'
//import { addToCart } from '../../redux/features/cart/cartSlice'
import SingleImageDisplay from '../../components/SingleImageDisplay';

const BookCard = ({book, isTierList=true}) => {
  const dispatch = useDispatch();
  //const handleAddToCart = (book) => {
  //  dispatch(addToCart(book))
  //}
  return (
    <div className="flex mt-10 h-full flex-col overflow-hidden bg-white shadow-xl">
    <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
      <div className="flex items-start justify-between">
      </div>

      <div className="mt-4">
        <div className="flow-root">
          
             <ul role="list" className="-my-4 divide-y divide-gray-200">

                <li  className="flex py-6">
                  <div className="ml-3 flex h-7 items-center ">
                    <button
                    type="button"
                    className="relative -top-2 left-4 -m-2 py-1 px-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-400  "
                    >
                    <span><FaFire /></span>
                    </button>
                  </div>

                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    {/*<img
                      alt=""
                      src={`${getImgUrl(book.picture_url)}`}
                      className="h-full w-full object-cover object-center"
                    />*/}
                    
                    <SingleImageDisplay pictureUrl={book.picture_url} className="h-full w-full object-cover object-center" />
                    
                    
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex flex-wrap justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link to={`/books/${book._id}`}>{book.title}</Link>
                        </h3>
                        {
                          isTierList ? 
                          <div className="ml-3 flex h-7 items-center gap-1 ">
                          <button
                          //onClick={() => handleAddToCart(book)}
                          type="button"
                          className="relative -top-2 left-1 -m-2 py-1.5 px-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-400  "
                          >
                          <span ><FaPlus /></span>
                          </button>
                        </div>
      
                          : <p className="absolute top-15 right-2 mt-2 mr-2 text-sm text-gray-500">{book.meta?.publication_period}</p>
                        }
                        
                      </div>
                      <p className="mt-1 text-sm text-gray-500 capitalize"><strong>Category:</strong>
                        {(book.genres ?? []).slice(0, 6).map((g, i, array) => (
                          <span key={i}>
                            {g}
                            {i < array.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </p>
                    </div>
                    <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                      <p className="text-gray-500"><strong>Origin:</strong> {book?.origin_country}</p>

                      <div className="flex">
                        <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                          Remove
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
      <p className="mt-0.5 text-sm text-gray-500">{book.description.length > 200 ? `${book?.description.slice(0,200)}...` : book.description}</p>

    </div>
    </div>
  )
}

export default BookCard