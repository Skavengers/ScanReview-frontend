import React, { useMemo } from 'react';
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
import UserStats from './userStats';

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Rated", value: "rated" },
  { label: "Completed", value: "completed" },
  { label: "Favorites", value: "favorites" }
];

function filterInteractions(interactions, filter) {
  if (filter === "all") return interactions;
  if (filter === "rated") return interactions.filter(i => i.rating && i.rating > 0);
  if (filter === "completed") return interactions.filter(i => i.status === "completed");
  if (filter === "favorites") return interactions.filter(i => i.favorite === true);
  return interactions;
}

const InteractedBooksSection = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const { data: interactions = [], isLoading, isError } = useFetchUserInteractionsQuery({ userId });

  const sections = filterOptions.map(opt => {
    const filtered = filterInteractions(interactions, opt.value);
    const bookIds = filtered.map(i => i.bookId).filter(Boolean);
    return { ...opt, bookIds };
  });

  const allBookIds = Array.from(new Set(sections.flatMap(s => s.bookIds)));
  const { data: books = [], isLoading: booksLoading } = useFetchBooksByIdsQuery(allBookIds.length ? allBookIds : skipToken);

  const bookMap = useMemo(() => {
    const map = {};
    books.forEach(book => { map[book._id] = book; });
    return map;
  }, [books]);

  if (isLoading || booksLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading your books.</div>;

  return (
    <div className="py-10">
      <UserStats />
      <h2 className="text-3xl font-semibold mb-6">Your Books</h2>
      {sections.map((section) => (
        <div key={section.value} className="mb-10">
          <h3 className="text-xl font-semibold mb-4">{section.label}</h3>
          <div className='w-12 h-[4px] bg-primary mb-2'></div>
          {section.bookIds.length === 0 ? (
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
              {section.bookIds.map((bookId, idx) => (
                <SwiperSlide key={bookId || idx}>
                  <BookCard
                    book={bookMap[bookId]}
                    isTierList={false}
                    haveDescription={false}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      ))}
    </div>
  );
};

export default InteractedBooksSection;
