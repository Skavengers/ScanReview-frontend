import React from 'react'
import { Link } from 'react-router-dom'

import news1 from "../../assets/news/news-1.png"
import news2 from "../../assets/news/news-2.webp"
import news3 from "../../assets/news/news-3.jpg"
import news4 from "../../assets/news/news-4.webp"
import news5 from "../../assets/news/news-5.webp"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


const news = [
    {
        "id": 1,
        "title": "Industry Concerns Over AI Policies",
        "description": "Manhwa creators and publishers are taking drastic measures to protect their works from AI due to new policies by X (formerly Twitter). These policies allow third-party collaborators to use data to train AI models, leading studios like D&C Media to alter their content to confuse AI algorithms while maintaining visual quality for human viewers.",
        "image": news1
    },
    {
        "id": 2,
        "title": "Anime Adaptations",
        "description": "Line Manga plans to launch 20 webtoon anime adaptations in 2025, building on the success of series like Solo Leveling and Tower of God. This reflects a growing trend in adapting manhwa into anime.",
        "image": news2
    },
    {
        "id": 3,
        "title": "WEBTOON Shop Launch",
        "description": "WEBTOON Entertainment has introduced the WEBTOON Shop, offering merchandise for popular webtoons, enhancing fan engagement and accessibility.",
        "image": news3
    },
    {
        "id": 4,
        "title": "Solo Leveling: Ragnarok Hiatus",
        "description": "The web novel Solo Leveling: Ragnarok is on a one-month hiatus. This follows the release of Chapter 36 and is due to the author's need for further medical treatment after a car accident. The hiatus has been extended until the end of January 2025.",
        "image": news4
    },
    {
        "id": 5,
        "title": "Roxana Creator Health and Future Plans",
        "description": "The creator of Roxana has faced significant personal and health issues, which have impacted the continuation of the series. They have expressed a commitment to return after addressing these health concerns, indicating that while the series is on a hiatus, it is not permanently discontinued.",
        "image": news5
    }
]

const News = () => {
  return (
    <div className='py-16'>
        <h2 className='text-3xl font-semibold  mb-6'>News </h2>
        <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
            640: {
                slidesPerView: 2,
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
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >

        {
            news.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className='flex flex-col sm:flex-row sm:justify-between items-center'>
                    {/* Content */}
                    <div className='py-4'>
                      <Link to="/">
                        <h3 className='text-lg font-medium hover:text-blue-500 mb-4'>{item.title}</h3>
                      </Link>
                      <div className='w-12 h-[4px] bg-primary mb-5'></div>
                      <p className='text-sm text-gray-600'>
                        {item.description}
                      </p>
                    </div>

                    {/* Image Container with Fixed Size */}
                    <div className='flex-shrink-0 w-64 h-48 overflow-hidden'>
                      <img
                        src={item.image}
                        alt={item.title}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </div>
                </SwiperSlide>
            ))
        }
      </Swiper>
    </div>
  )
}

export default News