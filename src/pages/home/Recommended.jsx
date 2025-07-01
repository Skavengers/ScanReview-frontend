import React, { useState } from 'react';
import BookCard from '../books/BookCard';
import PictureCard from '../books/PictureCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const Recommended = () => {
  const [page, setPage] = useState(1);
  const { data: books = [] } = useFetchAllBooksQuery({ page, pageSize: 25 });

  return (
    <div className='py-4 bg-[#f3f3f3] min-h-0'>
      <h2 className='text-3xl font-semibold mb-4'>
        Recommended for you
      </h2>
      <div className='bg-[#f3f3f3] p-0 m-0'>
        <Swiper
          slidesPerView={2}
          spaceBetween={5}
          navigation={true}
          className="p-0 m-0"
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
        >
        {books.length > 0 && books.map((book, index) => (
          <SwiperSlide key={index} className='bg-[#f3f3f3] p-0 m-0 h-full'>
            <div className='bg-[#f3f3f3] w-full h-full'>
              <PictureCard book={book} />
              
            </div>
            
          </SwiperSlide>
        ))}
        </Swiper>
      </div>
      
    </div>
  );
}

export default Recommended;
