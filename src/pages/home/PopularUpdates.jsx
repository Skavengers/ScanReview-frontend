import React, { useState, useMemo, useEffect } from 'react';
import BookCard from '../books/BookCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const genres = ["Choose a genre", "Manga", "Manhua", "Manhwa", "Action", "Adventure", "Drama", "Fantasy"];
const statuses = ["Choose a status", "Ongoing", "Completed", "Hiatus"];

const DEFAULT_GENRE = "Choose a genre";
const DEFAULT_STATUS = "Choose a status";

const PopularUpdates = () => {
  const [selectedGenre, setSelectedGenre] = useState(DEFAULT_GENRE);
  const [selectedStatus, setSelectedStatus] = useState(DEFAULT_STATUS);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Filtered query
  const {
    data: filteredBooks = [],
    isLoading: isLoadingFiltered,
    isError: isErrorFiltered
  } = useFetchAllBooksQuery({
    page,
    pageSize,
    genre: selectedGenre !== DEFAULT_GENRE ? selectedGenre : undefined,
    status: selectedStatus !== DEFAULT_STATUS ? selectedStatus : undefined,
  });

  // Fallback query (only runs if needed)
  const {
    data: fallbackBooks = [],
    isLoading: isLoadingFallback
  } = useFetchAllBooksQuery({
    page,
    pageSize
  }, {
    skip: filteredBooks.length >= 20 // Don't fetch fallback unless needed
  });

  const combinedBooks = useMemo(() => {
    if (filteredBooks.length >= 20) return filteredBooks.slice(0, 20);

    const filteredIds = new Set(filteredBooks.map(book => book._id));
    const additional = fallbackBooks.filter(book => !filteredIds.has(book._id));
    return [...filteredBooks, ...additional].slice(0, 20);
  }, [filteredBooks, fallbackBooks]);

  if (isLoadingFiltered || isLoadingFallback) return <div>Loading...</div>;
  if (isErrorFiltered) return <div>Error loading books.</div>;
  
  return (
    <div className='py-10'>
      <h2 className='text-3xl font-semibold mb-6'>Popular Updates</h2>
      <div className='mb-8 flex items-center space-x-4'>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className='border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none'
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className='border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none'
        >
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {combinedBooks.length === 0 ? (
        <div>No books available for the selected filters.</div>
      ) : (
        <Swiper
          key={`${selectedGenre}-${selectedStatus}`}
          slidesPerView={1}
          spaceBetween={30}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 40 },
            1024: { slidesPerView: 2, spaceBetween: 50 },
            1180: { slidesPerView: 3, spaceBetween: 50 },
          }}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {combinedBooks.map((book,index) => (
            <SwiperSlide key={index}>
              <BookCard book={book} isTierList={false} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default PopularUpdates;
