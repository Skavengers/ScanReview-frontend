import React, { useState, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchUserInteractionsQuery } from '../../redux/features/userInteractions/userInteractionsApi';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import BookCard from '../books/BookCard';
import { useAuth } from '../../context/AuthContext';
import { skipToken } from '@reduxjs/toolkit/query/react';

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
  // Fetch all user interactions once
  const { data: interactions = [], isLoading, isError } = useFetchUserInteractionsQuery({userId});
	console.log(interactions)
  // Memoize the list of relevant book IDs and filtered interactions
  const filteredInteractions = useMemo(() => {
    if (filter === "all") return interactions;
    if (filter === "rated") return interactions.filter(i => i.rating && i.rating > 0);
    if (filter === "completed") return interactions.filter(i => i.status === "completed");
    if (filter === "favorites") return interactions.filter(i => i.favorite === true);
    return interactions;
  }, [interactions, filter]);

  // Only fetch book details for the filtered books
  const bookIds = filteredInteractions.map(i => i.bookId).filter(Boolean);
  // Recommend you implement a `useFetchBooksByIdsQuery` if you have lots of books
  // For now: fetch all and filter locally (not optimal for very large datasets)
  const { data: allBooks = [], isLoading: isLoadingBooks } = useFetchAllBooksQuery();

  const booksToShow = useMemo(() => {
    const bookMap = Object.fromEntries(allBooks.map(b => [b._id, b]));
    return bookIds.map(id => bookMap[id]).filter(Boolean);
  }, [allBooks, bookIds]);

  if (isLoading || isLoadingBooks) return <div>Loading...</div>;
  if (isError) return <div>Error loading your books.</div>;

  return (
    <div className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Your Books</h2>
      <div className="mb-6 flex space-x-4">
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
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
              <BookCard book={book} isTierList={false} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default InteractedBooksSection;
