import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaBars } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaListOl } from "react-icons/fa6";
import avatarImg from "../assets/profil_discord.png"
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar'


const navigation = [
    {name: "Dashboard",href:"/dashboard"},
    {name: "Tier List",href:"/lists"},
    {name: "Cart Page",href:"/cart"},
    {name: "Check Out",href:"/checkout"},
]

 const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { currentUser, logout} = useAuth()
    const handleLogOut = () => {
        logout()
    }


    return (
    <header className="max-w-screen-2xl mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
            {/*Left Side */}
            <div className='flex items-center md:gap-16 gap-4'>
                <SearchBar />
                {/*<a href="/"><FaBars className='size-6'/></a>
                <div className='relative sm:w-72 w-40 space-x-2'>
                    <FaSearch className='absolute inline-block left-3 inset-y-2'/>
                    <input type="text" placeholder='Search here' 
                    className='bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outilne-none'
                    />
                </div>*/}
            </div>


            {/*Right side*/ }
            <div className='relative flex items-center md:space-x-3 space-x-2'>
                <button className='hidden sm:block'>
                    <FaRegHeart className='size-6'/>
                </button>
                <div>
                    {
                        currentUser ? <>
                        <button onClick={()=> setIsDropdownOpen(!isDropdownOpen)}>
                            <img 
                            src={avatarImg} 
                            alt="user"   
                            className={`size-7 rounded-full ${currentUser ? 'ring-2 ring-blue-500' : ''}`} />
                        </button>̛̛
                        {/* show dropdowns */}
                        {
                            isDropdownOpen && (
                                <div className='absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40'>
                                    <ul>
                                        {
                                            navigation.map((item) => (
                                                <li key={item.name} onClick={()=> setIsDropdownOpen(false)}>
                                                    <a href={item.href} className='block px-4 py-2 text-sm hover:bg-gray-100'>
                                                        {item.name}
                                                    </a>
                                                </li>
                                            ))
                                        }
                                        <li>
                                            <button
                                            onClick={handleLogOut}
                                            className='block w-full  px-4 py-2 text-sm hover:bg-gray-100'>Logout</button>
                                        </li>
                                    </ul>
                                </div>
                            )
                        }
                        </> : <a href='/login'><FaUser className='size-6'/></a> 
                    }
                </div>
                <div className='bg-red-500 m-1 text-white p-2 rounded-2xl flex'>
                    <Link to="/cart" className='flex items-center'>
                        <FaListOl className='mr-2' /> TierList
                    </Link>
                </div>
            </div>
        </nav>
        
    </header>
  )
}
export default Navbar;