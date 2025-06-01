import React, { useState, useMemo } from 'react';
import BookCard from '../books/BookCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const genres = ["Choose a genre", "Manga", "Manhua", "Manhwa"];

const PopularUpdates = () => {
    const [selectedGenre, setSelectedGenre] = useState("Choose a genre");
    const [page, setPage] = useState(1);
    const { data: books = [], isLoading, isError } = useFetchAllBooksQuery({ page, pageSize: 20 });

    const filteredBooks = useMemo(() => {
        return selectedGenre === "Choose a genre"
            ? books
            : books.filter((book) =>
                book.genres.some((g) =>
                    g.toLowerCase().includes(selectedGenre.toLowerCase())
                )
            );
    }, [books, selectedGenre]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading books.</div>;

    return (
        <div className='py-10'>
            <h2 className='text-3xl font-semibold mb-6'>Popular Updates</h2>
            <div className='mb-8 flex items-center'>
                <select
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    name="genre"
                    id="genre"
                    className='border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline'
                >
                    {genres.map((genre, index) => (
                        <option key={index} value={genre}>{genre}</option>
                    ))}
                </select>
            </div>

            {filteredBooks.length === 0 ? (
                <div>No books available for the selected genre.</div>
            ) : (
                <Swiper
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
                    {filteredBooks.map((book, index) => (
                        <SwiperSlide key={index}>
                            <BookCard book={book} isTierList={false} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

        {/*
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2 mx-2">{page}</span>
                <button
                    onClick={() => setPage(prevPage => prevPage + 1)}
                    className="px-4 py-2 mx-2 bg-gray-200 rounded"
                >
                    Next
                </button>
            </div>
        */}
        </div>
        
    );
};

export default PopularUpdates;
