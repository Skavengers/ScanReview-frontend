import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaListOl } from "react-icons/fa";
import avatarImg from "../assets/profil_discord.png";
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Tier List", href: "/lists" },
  { name: "Random Manhwa", href: "/books/revenge_of_the_iron-blooded_sword_hound" },
  { name: "Check Out", href: "/checkout" },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogOut = () => {
    logout();
  };

  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-4">
      <nav className="flex flex-wrap items-center justify-between">
        {/* Left Side: Logo and Search Bar */}
        <div className="flex items-center gap-2">
          <Link to="/" className="shrink-0">
            <img
              src="https://res.cloudinary.com/dzi37tegh/image/upload/v1751017714/logoV2_ueltpn.png"
              className="h-10 w-auto object-cover object-center"
              alt="logo"
            />
          </Link>
          <div className="hidden sm:block">
            <SearchBar />
          </div>
        </div>

        {/* Right Side: User Logo and TierList */}
        <div className="flex items-center space-x-2">
          <div className="relative group">
            {currentUser ? (
              <>
                <button
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <img
                    src={avatarImg}
                    alt="user"
                    className={`size-6 sm:size-7 rounded-full ${currentUser ? 'ring-2 ring-blue-500' : ''}`}
                  />
                </button>
                {isDropdownOpen && (
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-full mb-2 w-48 bg-white shadow-lg rounded-md z-40"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <ul>
                      {navigation.map((item) => (
                        <li key={item.name} className="hover:bg-gray-100">
                          <a href={item.href} className="block px-4 py-2 text-sm">
                            {item.name}
                          </a>
                        </li>
                      ))}
                      <li className="hover:bg-gray-100">
                        <button
                          onClick={handleLogOut}
                          className="block w-full px-4 py-2 text-sm"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <a href="/login">
                <FaUser className="size-5 sm:size-6" />
              </a>
            )}
          </div>
          <div className="bg-red-500 text-white p-2 rounded-2xl flex">
            <Link to="/lists" className="flex items-center text-xs sm:text-sm">
              <FaListOl className="mr-1 sm:mr-2 size-3 sm:size-4" /> TierList
            </Link>
          </div>
        </div>

        {/* Search Bar for Mobile */}
        <div className="w-full sm:hidden mt-2">
          <SearchBar />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
