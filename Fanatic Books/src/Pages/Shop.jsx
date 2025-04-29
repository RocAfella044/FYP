'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Bookcard from '../Components/Bookcard';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/books/')
      .then((res) => {
        setBooks(res.data);
        setFilteredBooks(res.data);
      })
      .catch((err) => console.error('Error fetching books:', err));

    // No need for a separate genre API — extract from books instead
  }, []);

  // Extract genres from books dynamically
  useEffect(() => {
    const uniqueGenres = Array.from(
      new Set(books.map((book) => book.book_genre))
    );
    setGenres(['All', ...uniqueGenres]);
  }, [books]);

  useEffect(() => {
    let filtered = books;

    if (selectedGenre !== 'All') {
      filtered = filtered.filter(
        (book) => book.book_genre.toLowerCase() === selectedGenre.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((book) =>
        book.book_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (book) =>
        book.book_price >= priceRange[0] && book.book_price <= priceRange[1]
    );

    setFilteredBooks(filtered);
  }, [selectedGenre, books, searchQuery, priceRange]);

  return (
    <div className="bg-gradient-to-b from-black via-purple-900 to-purple-100 min-h-screen py-16 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Fanatic books</h1>
        <p className="text-center text-lg mb-10 text-purple-200">
          Find your next favorite book
        </p>

        {/* Filters */}
        <div className="mb-10 bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg shadow-purple-400/30">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            {/* Genre Filter */}
            <div className="flex flex-wrap gap-3 justify-center">
              {genres.map((genre, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full transition-all text-sm font-medium ${
                    selectedGenre === genre
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-300'
                      : 'bg-white/10 text-white hover:bg-purple-500 hover:text-white'
                  }`}
                >
                  {genre
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ))}
            </div>

            {/* Search and Price */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-md text-black w-full md:w-64"
              />

              {/* Price Filter */}
              {/* Price Filter with Slider */}
              {/* Price Filter with Slider */}
              <div className="w-full max-w-xs text-white">
                <label className="block mb-1 text-sm font-medium">
                  Price Range: USD {priceRange[0]} - USD {priceRange[1]}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, parseInt(e.target.value)])
                    }
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Bookcard key={book.id} book={book} type="book" />
            ))
          ) : (
            <div className="col-span-full text-center text-purple-200">
              No books found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
