import React from 'react'
import bannerImg from "../../assets/banner.png"

const Banner = () => {
  return (
    <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12'>
        <div className='md:w-1/3 w-full flex items-center md:justify-center '>
            <img src={bannerImg} alt="" />
        </div>        
        
        <div className='md:w-1/2 w-full'>
            <h1 className='md:text-5xl text-2xl font-medium mb-7'>New Release this Week</h1>
            <p className='mb-10'>It’s time to update your reading list with some of the latest and greatest releases in the literary world.</p>
            <button className='btn-primary bg-orange-400 rounded-xl py-2 px-4'>Explore</button>
        </div>
    </div>
  )
}
export default Banner;