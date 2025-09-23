import React from 'react'
//import footerLogo  from "../assets/footer-logo.png"

import { FaYoutube, FaInstagram, FaTiktok  } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4">
      {/* Top Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Side - Logo and Nav */}
        <div className="md:w-1/2 w-full">
          {/*<img src={footerLogo} alt="Logo" className="mb-5 w-36" />*/}
          <ul className="flex flex-col md:flex-row gap-4">
            <li><a href="#home" className="hover:text-primary">Home</a></li>
            <li><a href="#services" className="hover:text-primary">Services</a></li>
            <li><a href="#about" className="hover:text-primary">About Us</a></li>
            <li><a href="#contact" className="hover:text-primary">Contact</a></li>
          </ul>
        </div>

        {/* Right Side - Newsletter */}
        <div className="md:w-1/2 w-full">
          <p className="mb-4">
            Contact Us on our social media
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-10 border-t border-gray-700 pt-6">
        {/* Left Side - Privacy Links */}
        {/*
          <ul className="flex gap-6 mb-4 md:mb-0">
          <li><a href="#privacy" className="hover:text-primary">Privacy Policy</a></li>
          <li><a href="#terms" className="hover:text-primary">Terms of Service</a></li>
        </ul>
        */}
        <div>© 2025 ScanReview. All Rights Reserved.</div>

        {/* Right Side - Social Icons */}
        <div className="flex gap-6">
          <a href="https://www.youtube.com/@AManhwaFan" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <FaYoutube size={24} />
          </a>
          <a href="https://www.instagram.com/amanhwafan/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <FaInstagram size={24} />
          </a>
          <a href="https://www.tiktok.com/@amanhwafan" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <FaTiktok  size={24} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer