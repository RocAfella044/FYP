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
        const fetchedBook = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (fetchedBook) {
          setBook(fetchedBook);
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

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token found');

      const response = await axios.post(
        'http://127.0.0.1:8000/api/token/refresh/',
        {
          refresh: refreshToken,
        }
      );

      localStorage.setItem('access_token', response.data.access);
      return true;
    } catch (err) {
      console.error('Token refresh failed:', err);
      toast.error('Session expired. Please log in again.');
      return false;
    }
  };

  const addToWishlist = async (bookId, retry = false) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      toast.error('Please log in to add items to wishlist.');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/wishlist/',
        { book: bookId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success('Book added to wishlist!');
    } catch (error) {
      if (error.response?.status === 401 && !retry) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return addToWishlist(bookId, true);
      }

      // Log detailed error
      console.error('Add to wishlist error:', {
        data: error?.response?.data,
        status: error?.response?.status,
        message: error?.message,
      });

      // Show backend error message if available
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        'Failed to add book to wishlist.';
      toast.error(msg);
    }
  };

  const addToCart = async (bookId, retry = false) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      toast.error('Please log in to add items to the cart.');
      return;
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/cart/',
        { book: bookId, quantity: 1 },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success('Book added to cart successfully!');
    } catch (error) {
      if (error.response?.status === 401 && !retry) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return addToCart(bookId, true);
      }
      console.error(
        'Add to cart error:',
        error.response?.data || error.message
      );
      toast.error('Failed to add book to cart.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <span className="text-purple-400 text-xl">Loading book details...</span>
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
            className="mt-4 border border-purple-600 hover:bg-purple-900 text-purple-400 px-4 py-2 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto border border-purple-900 rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex items-center justify-center p-8">
            {book.book_image ? (
              <img
                src={book.book_image}
                alt={book.book_name}
                className="rounded-lg border-2 border-purple-700 max-w-[350px] w-full h-auto object-cover"
              />
            ) : (
              <div className="w-[300px] h-[450px] bg-purple-900/20 rounded-lg border border-purple-800 flex items-center justify-center">
                <span className="text-purple-400">No image available</span>
              </div>
            )}
          </div>

          <div className="p-8 space-y-6">
            <h1 className="text-4xl font-bold text-white">{book.book_name}</h1>
            <div className="text-gray-300 text-lg">Author: {book.book_author}</div>
            <div className="text-gray-300 text-lg">{book.book_desc}</div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-purple-900/50">
              <div>
                <h3 className="text-purple-400 text-sm">Genre</h3>
                <p className="text-white text-lg">{book.book_genre}</p>
              </div>
              <div>
                <h3 className="text-purple-400 text-sm">Price</h3>
                <p className="text-white text-2xl font-bold">
                  NPR {book.book_price}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-md flex-1"
                onClick={() => addToCart(book.id)}
              >
                Add to Cart
              </button>
              <button
                className="border-2 border-purple-600 text-purple-400 hover:bg-purple-900 px-6 py-3 rounded-md flex-1"
                onClick={() => addToWishlist(book.id)}
              >
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
