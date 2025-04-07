'use client';

import { useEffect, useState } from 'react';
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

  // Dummy refreshAccessToken function - replace with your actual implementation
  const refreshAccessToken = async () => {
    console.log(
      'refreshAccessToken called - replace with actual implementation'
    );
    // In a real application, this function would make a request to your backend
    // to refresh the access token using a refresh token.
    // For this example, we'll just simulate a successful refresh.
    return Promise.resolve();
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-purple-400 text-xl font-semibold">
          <div className="flex items-center space-x-2">
            <svg
              className="animate-spin h-8 w-8 text-purple-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading book details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="bg-black border border-red-500 text-red-400 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 bg-black border border-purple-600 hover:bg-purple-900 text-purple-400 px-4 py-2 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-black border border-purple-900 rounded-xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Book Image Section */}
          <div className="flex items-center justify-center p-8 bg-gradient-to-br from-black to-purple-950">
            {book.book_image ? (
              <img
                src={book.book_image || '/placeholder.svg'}
                alt={book.book_name}
                className="rounded-lg border-2 border-purple-700 shadow-lg max-w-[350px] w-full h-auto object-cover transform transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-[300px] h-[450px] bg-purple-900/20 rounded-lg border border-purple-800 flex items-center justify-center">
                <span className="text-purple-400">No image available</span>
              </div>
            )}
          </div>

          {/* Book Info Section */}
          <div className="p-8 flex flex-col space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {book.book_name}
              </h1>
              <div className="w-20 h-1 bg-purple-600 rounded mb-6"></div>
            </div>

            <div className="prose prose-invert">
              <p className="text-gray-300 leading-relaxed text-lg">
                {book.book_desc}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-purple-900/50">
              <div>
                <h3 className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
                  Genre
                </h3>
                <p className="text-white text-lg">{book.book_genre}</p>
              </div>
              <div>
                <h3 className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
                  Price
                </h3>
                <p className="text-white text-2xl font-bold">
                  NPR {book.book_price}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex-1 flex items-center justify-center"
                onClick={() => addToCart(book.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Add to Cart
              </button>
              <button className="border-2 border-purple-600 text-purple-400 hover:bg-purple-900/30 px-6 py-3 rounded-md font-medium transition-colors duration-200 flex-1 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
