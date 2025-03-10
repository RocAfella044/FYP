import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaGithub, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-black to-gray-900 text-white py-10">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
          {/* Logo */}
          <Link to={'/'} className="flex items-center mb-6 md:mb-0">
            <img
              src="./images/Mandip ko fanatics.png"
              className="h-16"
              alt="Logo"
            />
          </Link>

          {/* Social Media Links */}
          <div className="flex space-x-6">
            <a
              href="https://www.facebook.com/mandeep.rajbhandary.73"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400"
            >
              <FaFacebookF size={24} />
            </a>
            <a
              href="https://www.instagram.com/mandeeprajbhandari/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://github.com/RocAfella044"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400"
            >
              <FaGithub size={24} />
            </a>
          </div>
        </div>

        <hr className="border-gray-700 mb-6" />

        <div className="flex flex-col md:flex-row md:justify-between items-center text-gray-400 text-sm">
          <span>&copy; FanaticBooks. All Rights Reserved.</span>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-white">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
