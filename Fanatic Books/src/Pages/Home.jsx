import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Bookcard from '../Components/Bookcard';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [MiscellaneousBooks, setMiscellaneousBooks] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/books/')
      .then((response) => setBooks(response.data))
      .catch((error) => console.error('Error fetching books:', error));

    axios
      .get('http://localhost:8000/api/new-arrivals/')
      .then((response) => setNewArrivals(response.data))
      .catch((error) => console.error('Error fetching new arrivals:', error));

    axios
      .get('http://localhost:8000/api/trending/')
      .then((response) => setTrendingBooks(response.data))
      .catch((error) => console.error('Error fetching trending books:', error));
    axios
      .get('http://localhost:8000/api/miscellaneous/')
      .then((response) => setMiscellaneousBooks(response.data))
      .catch((error) =>
        console.error('Error fetching Miscellaneous books:', error)
      );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-purple-200">
      <header className="relative py-24 text-white">
        <div className="absolute inset-0 bg-purple-600/10 backdrop-blur-sm" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
            The Book Lover's Dreamland Awaits!
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
            Welcome to the ultimate book lover's paradise! Join our community
            and contribute to the ever-evolving library of stories.
          </p>
          <div className="mt-12 flex justify-center max-w-2xl mx-auto">
            <div className="relative w-full">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search for your next adventure..."
                className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm 
                  border border-white/20 text-white placeholder-white/60
                  focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/20
                  transition-all duration-200"
              />
              <button
                onClick={() => navigate(`/search/${search}`)}
                className="absolute right-2 top-1/2 -translate-y-1/2 
                  bg-purple-500 hover:bg-purple-600 p-3 rounded-full
                  transition-colors duration-200"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Our Best Picks Section */}
      <section className="py-16 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          Our Best Picks
        </h2>
        <div className="relative px-12">
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
              bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-3 
              shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 
              transition-all duration-200"
            onClick={() => {
              const container = document.getElementById('book-slider');
              container.scrollBy({ left: -300, behavior: 'smooth' });
            }}
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
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 
              bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-3 
              shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 
              transition-all duration-200"
            onClick={() => {
              const container = document.getElementById('book-slider');
              container.scrollBy({ left: 300, behavior: 'smooth' });
            }}
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

          <div
            id="book-slider"
            className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory gap-6 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex-shrink-0 w-8" />
            {books.length > 0 ? (
              books.map((book) => (
                <div
                  key={book.id}
                  className="flex-shrink-0 snap-start"
                  style={{ width: '280px' }}
                >
                  <Bookcard book={book} type={'book'} />
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No books available.</p>
            )}
            <div className="flex-shrink-0 w-8" />
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          New Arrivals
        </h2>
        <div className="relative px-12">
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
              bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-3 
              shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 
              transition-all duration-200"
            onClick={() => {
              const container = document.getElementById('new-arrivals-slider');
              container.scrollBy({ left: -300, behavior: 'smooth' });
            }}
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
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 
              bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-3 
              shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 
              transition-all duration-200"
            onClick={() => {
              const container = document.getElementById('new-arrivals-slider');
              container.scrollBy({ left: 300, behavior: 'smooth' });
            }}
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

          <div
            id="new-arrivals-slider"
            className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory gap-6 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex-shrink-0 w-8" />
            {newArrivals.length > 0 ? (
              newArrivals.map((book) => (
                <div
                  key={book.id}
                  className="flex-shrink-0 snap-start"
                  style={{ width: '280px' }}
                >
                  <Bookcard book={book} type={'new-arrival'} />
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No new arrivals available.</p>
            )}
            <div className="flex-shrink-0 w-8" />
          </div>
        </div>
      </section>

      {/* Trending Books Section */}
      <section className="py-16 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          Trending Books
        </h2>
        <div className="relative px-12">
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
              bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-3 
              shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 
              transition-all duration-200"
            onClick={() => {
              const container = document.getElementById(
                'trending-books-slider'
              );
              container.scrollBy({ left: -300, behavior: 'smooth' });
            }}
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
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 
              bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-3 
              shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 
              transition-all duration-200"
            onClick={() => {
              const container = document.getElementById(
                'trending-books-slider'
              );
              container.scrollBy({ left: 300, behavior: 'smooth' });
            }}
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

          <div
            id="trending-books-slider"
            className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory gap-6 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex-shrink-0 w-8" />
            {trendingBooks.length > 0 ? (
              trendingBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex-shrink-0 snap-start"
                  style={{ width: '280px' }}
                >
                  <Bookcard book={book} type={'trending-books'} />
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">
                No trending books available.
              </p>
            )}
            <div className="flex-shrink-0 w-8" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
