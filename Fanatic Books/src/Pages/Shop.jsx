import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Bookcard from '../Components/Bookcard';

const Shop = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/books/')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }, []);

  return (
    <div className="bg-gradient-to-b from-black via-purple-900 to-white min-h-screen text-center">
      <section className="py-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-white mt-6">
          Pick for your enthusiastic mind
        </h1>
        <h2 className="mt-4 text-lg md:text-xl text-white">
          Work less, Read More
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-8 px-4">
          {books.length > 0 ? (
            books.map((book) => (
              <Bookcard book={book}/>
            ))
          ) : (
            <p className="text-gray-300">No books available at the moment.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
