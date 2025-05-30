import React from 'react'
import Banner from "./Banner"
import PopularUpdates from './PopularUpdates'
import Recommended from './Recommended'
import News from './News'
const Home = () => {
  return (
    <div>
      <Banner />
      <PopularUpdates/>
      <Recommended />
      <News />
    </div>
  )
}

export default Home;