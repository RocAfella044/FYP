'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Bookcard from '../Components/Bookcard';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    // Fetch books
    axios
      .get('http://localhost:8000/api/books/')
      .then((response) => {
        setBooks(response.data);
        setFilteredBooks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });

    // Fetch genres
    axios
      .get('http://localhost:8000/api/genres/')
      .then((res) => {
        const genreList = res.data.map((g) =>
          typeof g === 'string' ? g : g.book_genre
        );
        setGenres(['All', ...genreList]);
      })
      .catch((err) => {
        console.error('Error fetching genres:', err);
      });
  }, []);

  useEffect(() => {
    if (selectedGenre === 'All') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) => {
        const bookGenre =
          typeof book.genre === 'string' ? book.genre : book.genre?.book_genre;
        return bookGenre?.toLowerCase() === selectedGenre.toLowerCase();
      });
      setFilteredBooks(filtered);
    }
  }, [selectedGenre, books]);

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <div className="bg-gradient-to-b from-black via-purple-900 to-white min-h-screen text-center">
      <section className="py-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-white mt-6">
          Pick for your enthusiastic mind
        </h1>
        <h2 className="mt-4 text-lg md:text-xl text-white">
          Work less, Read More
        </h2>

        {/* Genre Filter Buttons */}
        <div className="mt-10 mb-6 px-4">
          <h3 className="text-xl text-white mb-4">Browse by Genre</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {genres.map((genre, index) => (
              <button
                key={index}
                onClick={() => handleGenreSelect(genre)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedGenre === genre
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                {genre
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Books Display */}
        <div className="mt-8 flex flex-wrap justify-center gap-8 px-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Bookcard key={book.id} type={'book'} book={book} />
            ))
          ) : (
            <p className="text-gray-300">No books available in this genre.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
