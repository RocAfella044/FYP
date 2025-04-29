'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const BookSlider = ({ featuredBooks }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === featuredBooks.length - 1 ? 0 : prevIndex + 1
    );
  }, [featuredBooks.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? featuredBooks.length - 1 : prevIndex - 1
    );
  }, [featuredBooks.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [nextSlide]);

  if (!featuredBooks || featuredBooks.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto my-12 overflow-hidden rounded-xl shadow-2xl">
      <div className="relative h-[300px] md:h-[400px] bg-gradient-to-r from-purple-900 to-black">
        {/* Slides */}
        <div
          className="h-full w-full flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {featuredBooks.map((book, index) => (
            <div
              key={book.id}
              className="h-full min-w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-16"
            >
              {/* Book Cover */}
              <div className="w-full md:w-1/3 flex justify-center md:justify-end">
                <img
                  src={book.cover_image || '/placeholder.jpg'}
                  alt={book.title}
                  className="h-[180px] md:h-[280px] object-cover rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => navigate(`/book/${book.id}`)}
                />
              </div>

              {/* Book Info */}
              <div className="w-full md:w-2/3 text-white text-center md:text-left p-4 md:pl-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  {book.title}
                </h3>
                <p className="text-purple-300 mb-2">by {book.author}</p>
                <p className="text-gray-300 mb-4 line-clamp-3 md:line-clamp-4">
                  {book.description}
                </p>
                <button
                  onClick={() => navigate(`/book/${book.id}`)}
                  className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg transition-colors duration-300"
                >
                  Explore Book
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {featuredBooks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-purple-500' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookSlider;
