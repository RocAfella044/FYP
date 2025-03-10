import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Bookcard from '../Components/Bookcard';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/books/')
      .then((response) => setBooks(response.data))
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  return (
    <div
      id="home"
      className="bg-gradient-to-b from-black via-purple-900 to-white min-h-screen text-center"
    >
      <header className="py-12 text-white">
        <h1 className="text-4xl md:text-6xl font-bold">
          The Book Lover's Dreamland Awaits!
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Welcome to the ultimate book lover's paradise! Join our community and
          contribute to the ever-evolving library of stories.
        </p>
        <div className="mt-6 flex justify-center">
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search a book"
            className="w-2/3 md:w-1/3 p-3 border text-black border-black rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            onClick={() => navigate (`/search/${search}`)}
            className="bg-purple-700 text-white px-6 rounded-r-lg hover:bg-purple-800"
          >
            Search
          </button>
        </div>
      </header>

      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          Our Best Picks
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-8 px-4">
          {books.length > 0 ? (
            books.map((book) => <Bookcard book={book} key={book.id} />)
          ) : (
            <p className="text-gray-500">No books available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
