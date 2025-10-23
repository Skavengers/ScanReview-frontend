import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaListOl } from "react-icons/fa";
import avatarImg from "../assets/profil_discord.png";
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

const navigation = [
//  { name: "Dashboard", href: "/dashboard" },
  { name: "Tier List", href: "/lists" },
  { name: "Random Manhwa", href: "/books/revenge_of_the_iron-blooded_sword_hound" },
  { name: "Collection", href: "/collection" },
  { name: "Top 100 manhwa of the Community ", href: "/" },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const dropdownRef = useRef(null);

  const handleLogOut = () => {
    logout();
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* Right Side: User Icon and Tier List */}
        <div className="flex items-center space-x-2">
          <div className="relative" ref={dropdownRef}>
            {currentUser ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="focus:outline-none"
                >
                  <img
                    src={avatarImg}
                    alt="user"
                    className={`size-6 sm:size-7 rounded-full ${currentUser ? 'ring-2 ring-blue-500' : ''}`}
                  />
                </button>
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40"
                  >
                    <ul>
                      {navigation.map((item) => (
                        <li key={item.name} className="hover:bg-gray-100">
                          <Link to={item.href} className="block px-4 py-2 text-sm">
                            {item.name}
                          </Link>
                        </li>
                      ))}
                      <li className="hover:bg-gray-100">
                        <button
                          onClick={handleLogOut}
                          className="block w-full px-4 py-2 text-sm text-left"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <FaUser className="size-5 sm:size-6" />
              </Link>
            )}
          </div>

          {/* Tier List Button */}
          <div className="bg-red-500 text-white px-3 py-1 rounded-2xl flex mt-1 mb-2 pb-2 pt-2">
            <Link to="/lists" className="flex items-center text-xs sm:text-sm">
              <FaListOl className="mr-1 sm:mr-2 size-3 sm:size-4" /> TierList
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="w-full sm:hidden mt-2">
          <SearchBar />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
