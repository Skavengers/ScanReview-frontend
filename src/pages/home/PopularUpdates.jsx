import React, { useEffect, useState } from 'react'
import BookCard from '../books/BookCard';
//import PictureCard from '../books/PictureCard';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';


const genres = ["Choose a genre", "Manga", "Manhua", "Manhwa"]

const PopularUpdates = () => {

    const [selectedGenre, setSelectedGenre] = useState("Choose a genre");

    
    const { data: books = [], isLoading, isError } = useFetchAllBooksQuery();


    console.log(books)
    const filteredBooks = selectedGenre === "Choose a genre" ? books: books.filter((book) =>
        book.genre.some((g) =>
            g.toLowerCase().includes(selectedGenre.toLowerCase())
        )
    )

  return (
    <div className='py-10'>
        <h2 className='text-3xl font-semibold mb-6'>
            Popular Updates
        </h2>
        {/** genre filtering */}
        <div className='mb-8 flex items-center'>
            <select
            onChange={(e) => setSelectedGenre(e.target.value)}
            name="genre" 
            id="genre" 
            className='border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline'>
                {
                    genres.map((genre, index) =>(
                        <option key={index} value={genre}>{genre}</option>
                    ))
                }
            </select>
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
            className="mySwiper"
        >
            
        {
            filteredBooks.length > 0 && filteredBooks.map((book, index) => (
                <SwiperSlide key={index}>
                    <BookCard book={book} isTierList={true}/>
                </SwiperSlide>
            ))
        }
        </Swiper>

        {/**Endless Information */}

        {/*
            filteredBooks.map((book, index) => (
                <BookCard key={index} book={book} isTierList={true}/>
            ))
        */}

    </div>
  )
}
export default PopularUpdates;