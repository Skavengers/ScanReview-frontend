import React from 'react'
import { FiShoppingCart } from "react-icons/fi"
import { useParams } from "react-router-dom"

import { getImgUrl } from '../../utils/getImgUrl';
import { useDispatch } from 'react-redux';
//import { addToCart } from '../../redux/features/cart/cartSlice';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';
// CSS MOCHE à prendre celui du bas plus beau
const SingleBook = () => {
  const {id} = useParams();
  const {data: book, isLoading, isError} = useFetchBookByIdQuery(id);
  const dispatch =  useDispatch();
  //const handleAddToCart = (product) => {
  //    dispatch(addToCart(product))
  //}

  if(isLoading) return <div>Loading...</div>
  if(isError) return <div>Error happending to load book info</div>
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 grid md:grid-cols-2 gap-8">

        {/* Book Image */}
        <div className="flex justify-center items-start">
          <img
            src={`${getImgUrl(book.picture_url)}`}
            alt={book.title}
            className="rounded-xl w-full h-auto max-h-[500px] object-cover shadow-md"
          />
        </div>

        {/* Book Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Author:</span> {book?.authors || "?"}
            </p>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Published:</span> {book.meta?.status || "N/A"}
            </p>

            <p className="text-gray-700 mb-2 capitalize">
              <span className="font-semibold">Category:</span> {Array.isArray(book?.genres) ? book.genres.join(', ') : book?.genres}
            </p>

            <p className="text-gray-700 mt-4">
              <span className="font-semibold">Description:</span> {book?.description}
            </p>
          </div>

          {/* Optional future button */}
          {/*
          <button
            onClick={() => handleAddToCart(book)}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <FiShoppingCart />
            <span>Add to Cart</span>
          </button>
          */}
        </div>
      </div>
    </div>
  )
}

export default SingleBook;

/*
//example of better css 
import React from 'react';
import { FaHeart, FaFire, FaUser } from 'react-icons/fa';
import { MdOutlineUpdate } from 'react-icons/md';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Picture from "../../assets/books/Solo Leveling.png"

const SingleBook = ({ webtoon=webtoonData, characters=charactersData }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto bg-white text-black rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row mb-8">
        <img className="w-full md:w-1/3 h-auto object-cover" src={Picture} alt={webtoon.main_title} />
        <div className="p-6 md:p-8 w-full md:w-2/3 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">{webtoon.main_title}</h2>
            <div className="flex flex-wrap mb-6">
              {webtoon.authors.map((author, index) => (
                <span key={index} className="bg-gray-200 text-gray-700 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
                  {author}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap mb-6">
              {webtoon.genre.map((genre, index) => (
                <span key={index} className="bg-gray-200 text-gray-700 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="flex items-center text-gray-600 hover:text-red-500 transition-colors duration-300">
              <FaHeart className="mr-2" /> {webtoon.favorites}
            </div>
            <div className="flex items-center text-gray-600 hover:text-orange-500 transition-colors duration-300">
              <FaFire className="mr-2" /> {webtoon.popularity}
            </div>
            <div className="flex items-center text-gray-600 hover:text-blue-500 transition-colors duration-300">
              <FaUser className="mr-2" /> {webtoon.characters.main_character}
            </div>
            <div className={`flex items-center text-gray-600 hover:text-green-500 transition-colors duration-300 ${webtoon.Ongoing ? 'text-green-600' : 'text-red-600'}`}>
              <MdOutlineUpdate className="mr-2" /> {webtoon.Ongoing ? 'Ongoing' : 'Completed'}
            </div>
          </div>
          <p className="text-gray-600">{webtoon.description}</p>
        </div>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
          1180: {
            slidesPerView: 3,
            spaceBetween: 50,
          }
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper w-full max-w-6xl"
      >
        {characters.map((character, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white text-black rounded-lg shadow-md p-4">
              <img className="w-full h-48 object-cover mb-4 rounded-t-lg" src={character.picture} alt={character.name} />
              <h3 className="text-xl font-bold mb-2">{character.name}</h3>
              <p className="text-gray-600">{character.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const webtoonData = {
  "_id": 1,
  "picture": "https://s04.mpizz.org/thumb/W600/mpim/1df/1dfe77bd0eee292cafcfd960d6aefb570b024f53_1530_2429_1365668.webp",
  "main_title": "One Piece",
  "secondary_titles": [],
  "authors": [
      "Shounen Jump",
      "Eiichiro Oda",
      "尾田 栄一郎"
  ],
  "genre": [
      "Manga",
      "Shounen(B)",
      "Action",
      "Adventure",
      "Comedy",
      "Fantasy",
      "Super Power",
      "Super Power"
  ],
  "country_origin": "Japanese",
  "Ongoing": true,
  "hot": false,
  "rated": 0,
  "description": "Gol D. Roger, a man referred to as the \"Pirate King,\" is set to be executed by the World Government. But just before his demise, he confirms the existence of a great treasure, One Piece, located somewhere within the vast ocean known as the Grand Line. Announcing that One Piece can be claimed by anyone worthy enough to reach it, the Pirate King is executed and the Great Age of Pirates begins.Twenty-two years later, a young man by the name of Monkey D. Luffy is ready to embark on his own adventure, searching for One Piece and striving to become the new Pirate King. Armed with just a straw hat, a small boat, and an elastic body, he sets out on a fantastic journey to gather his own crew and a worthy ship that will take them across the Grand Line to claim the greatest status on the high seas.",
  "popularity": 1000000,
  "favorites": 100,
  "characters": {
      "main_character": "Luffy"
  },
  "plannig": 1,
  "updatedAt": "2025-04-25T21:23:22.765Z",
  "createdAt": "2025-04-28T16:31:10.322Z"
};

const charactersData = [
  {
    name: 'Luffy',
    picture: 'https://example.com/luffy.jpg',
    description: 'Monkey D. Luffy, also known as "Straw Hat Luffy" and commonly as "Straw Hat", is the main protagonist of the manga and anime, One Piece.'
  },
  {
    name: 'Zoro',
    picture: 'https://example.com/zoro.jpg',
    description: 'Roronoa Zoro, also known as "Pirate Hunter" Zoro, is a fictional character in the One Piece franchise created by Eiichiro Oda.'
  },
];

export default SingleBook;
*/