'use client';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Bookcard from '../Components/Bookcard';

const Search = () => {
  const [searchParam] = useSearchParams();
  const query = searchParam.get('search');
  const [books, setBook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:8000/api/search/?query=${query}`)
      .then((response) => {
        console.log(response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setBook(response.data);
        } else {
          setBook([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching book:', error);
        setError('Failed to fetch books. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-purple-200">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Search Results for "{query}"
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        ) : books.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8 px-4">
            {books.map((book) => (
              <div key={book.id}>
                <Bookcard type="book" book={book} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-white/10 backdrop-blur-sm rounded-lg max-w-lg mx-auto">
            <svg
              className="w-16 h-16 mx-auto text-pink-200 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-xl text-pink-100 font-medium">
              No books found for "{query}"
            </p>
            <p className="text-pink-200/70 mt-2">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
