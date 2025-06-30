import React, { useState, useEffect } from 'react'
import BookCard from '../books/BookCard';
import PictureCard from '../books/PictureCard';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

// On attend l’algo d’Anto
const Recommended = () => {
  const [page,setPage] = useState(1);
  const {data: books =[]} = useFetchAllBooksQuery({page, pageSize: 25});
  
  return (
    <div className='py-5 '>
        <h2 className='text-3xl font-semibold mb-6'>
            Recommended for you
        </h2>

        <Swiper
            slidesPerView={2}
            spaceBetween={5}
            navigation={true}
            
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 50,
              },
              1180: {
                slidesPerView: 8,
                spaceBetween: 50,
              }
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper"
        >
            
        {
            books.length > 0 && books.map((book, index) => (
                <SwiperSlide key={index}>
                    <PictureCard book={book} />
                </SwiperSlide>
            ))
        }
        </Swiper>
    </div>
  )
}

export default Recommended