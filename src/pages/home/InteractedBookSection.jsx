import React, { useState, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchUserInteractionsQuery } from '../../redux/features/userInteractions/userInteractionsApi';
import { useFetchBooksByIdsQuery } from '../../redux/features/books/booksApi';
import BookCard from '../books/BookCard';
import { useAuth } from '../../context/AuthContext';
import { skipToken } from '@reduxjs/toolkit/query';
const filterOptions = [
  { label: "All", value: "all" },
  { label: "Rated", value: "rated" },
  { label: "Completed", value: "completed" },
  { label: "Favorites", value: "favorites" }
];

const InteractedBooksSection = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const { data: interactions = [], isLoading, isError } = useFetchUserInteractionsQuery({ userId });

  const filteredInteractions = useMemo(() => {
    if (filter === "all") return interactions;
    if (filter === "rated") return interactions.filter(i => i.rating && i.rating > 0);
    if (filter === "completed") return interactions.filter(i => i.status === "completed");
    if (filter === "favorites") return interactions.filter(i => i.favorite === true);
    return interactions;
  }, [interactions, filter]);

  // Show only first 10, unless showAll is true
  const VISIBLE_COUNT = 10;
  const effectiveInteractions = showAll ? filteredInteractions : filteredInteractions.slice(0, VISIBLE_COUNT);
  const bookIds = effectiveInteractions.map(i => i.bookId).filter(Boolean);
  const { data: booksToShow = [], isLoading: booksLoading } = useFetchBooksByIdsQuery(bookIds.length ? bookIds : skipToken);
  // Use useFetchBookByIdQuery for each bookId
  // Each call returns its own {data, isLoading, isError}
  console.log(bookIds)
  console.log(booksToShow)
  const bookResults = booksToShow;

  const anyLoading = isLoading || bookResults.some(r => r.isLoading);
  const anyError = isError || bookResults.some(r => r.isError);

  if (anyLoading) return <div>Loading...</div>;
  if (anyError) return <div>Error loading your books.</div>;

  return (
    <div className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Your Books</h2>
      <div className="mb-6 flex space-x-4">
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => { setFilter(opt.value); setShowAll(false); }}
            className={`px-5 py-2 rounded-md border transition-all 
              ${filter === opt.value ? 'bg-blue-600 text-white' : 'bg-[#EAEAEA] border-gray-300 text-black'}
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {booksToShow.length === 0 ? (
        <div>No books found for this filter.</div>
      ) : (
        <>
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            navigation
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 40 },
              1024: { slidesPerView: 2, spaceBetween: 50 },
              1180: { slidesPerView: 3, spaceBetween: 50 },
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {booksToShow.map((book, idx) => (
              <SwiperSlide key={book._id || idx}>
                <BookCard book={book} isTierList={false} haveDescription={false}/>
              </SwiperSlide>
            ))}
          </Swiper>
          {!showAll && filteredInteractions.length > VISIBLE_COUNT && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAll(true)}
                className="px-5 py-2 rounded-md border border-blue-600 bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all"
              >
                See More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InteractedBooksSection;
