import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SingleBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/books/${id}/`)
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setBook(response.data[0]); // Extract the first item from the array
        } else {
          setError('Book not found');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching book:', error);
        setError('Failed to load book');
        setLoading(false);
      });
  }, [id]);
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/books/${id}/`)
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setBook(response.data[0]); // Extract the first item from the array
        } else {
          setError('Book not found');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching book:', error);
        setError('Failed to load book');
        setLoading(false);
      });
  }, [id]);

  const addToCart = async (id) => {
    const accessToken = localStorage.getItem('access_token'); // Retrieve the access token

    if (!accessToken) {
      console.error('No access token found. User is not authenticated.');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/cart/',
        { book: id, quantity: 1 },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Ensure 'Bearer' is used
          },
        }
      );

      console.log('Added to cart:', response.data);
      toast.success('Book added to cart successfully!');
    } catch (error) {
      console.error(
        'Error adding to cart:',
        error.response?.data || error.message
      );

      // If the error is due to token expiration, refresh it
      if (error.response?.status === 401) {
        console.log('Token expired. Attempting to refresh...');
        await refreshAccessToken();
        await addToCart(id); // Retry request after refreshing token
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-black text-white p-6 rounded-lg w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Book Image */}
        <div className="flex justify-center">
          {book.book_image && (
            <img
              src={book.book_image || '/placeholder.svg'}
              alt={book.book_name}
              className="rounded-lg border border-purple-900 shadow-lg max-w-[300px] w-full h-auto"
            />
          )}
        </div>

        {/* Book Info */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-3xl font-bold text-white">{book.book_name}</h2>

          <p className="text-gray-300 leading-relaxed">{book.book_desc}</p>

          <div className="mt-2">
            <p className="text-purple-400">
              Genre: <span className="text-white">{book.book_genre}</span>
            </p>
          </div>

          <div className="mt-2">
            <p className="text-purple-400">
              Price: <span className="text-white">NPR{book.book_price}</span>
            </p>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              className="bg-black-600 border border-purple-600 hover:bg-purple-900 text-purple-400 px-6 py-2 rounded-md"
              onClick={() => addToCart(book.id)}
            >
              Add to Cart
            </button>
            <button className="border border-purple-600 text-purple-400 hover:bg-purple-900 px-6 py-2 rounded-md">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
