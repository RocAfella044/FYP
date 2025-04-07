import React from 'react';
import { use } from 'react';
import { useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Bookcard from '../Components/Bookcard';

const Search = () => {
  const [searchParam] = useSearchParams();
  const query = searchParam.get('search');
  const [books, setBook] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/search/?query=${query}`)
      .then((response) => {
        console.log(response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setBook(response.data); // Extract the first item from the array
        }
      })
      .catch((error) => {
        console.error('Error fetching book:', error);
      });
  }, [query]);

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-8 px-4">
      {books.length > 0 ? (
        books.map((book) => (
          <Bookcard key={book.id} type={'book'} book={book} />
        ))
      ) : (
        <p className="text-gray-300">No books available at the moment.</p>
      )}
    </div>
  );
};

export default Search;
