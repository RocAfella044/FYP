import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookCartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch cart data when the component mounts
  useEffect(() => {
    const fetchCartData = async () => {
      const accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        console.error('No access token found. User is not authenticated.');
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/cart/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setCart(response.data); // Set cart data in state
      } catch (error) {
        console.error(
          'Error fetching cart:',
          error.response?.data || error.message
        );
        setError(error.response?.data || 'Error fetching cart');

        // If the token is expired (401 Unauthorized), try refreshing and retry fetching
        if (error.response?.status === 401) {
          console.log('Token expired. Attempting to refresh...');
          await refreshAccessToken(); // Call function to refresh token
          await fetchCartData(); // Retry after refreshing token
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  // Update the quantity of an item in the cart
  const updateQuantity = (id, amount) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + amount) }
        : item
    );
    setCart(updatedCart);
    fetch(`http://127.0.0.1:8000/api/cart/update/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: updatedCart.find((item) => item.id === id).quantity,
      }),
    });
  };

  // Remove an item from the cart
  const removeItem = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/cart/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setCart(cart.filter((item) => item.id !== id)); // Remove the item from the cart state
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Calculate the total price of all items in the cart
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.book_price * item.quantity,
    0
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-purple-800 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-medium">Loading your collection...</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-purple-800 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Your <span className="text-purple-300">Book</span> Collection
          </h1>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4">
            <p className="text-white font-medium">{cart.length} items</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
          {cart.length > 0 ? (
            <div>
              <div className="p-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="group relative mb-6 last:mb-0 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition duration-300"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <img
                            src={
                              item.book_image
                                ? `http://127.0.0.1:8000${item.book_image}`
                                : '/default-image.jpg'
                            }
                            alt={item.book_name}
                            className="w-24 h-32 object-cover rounded-lg shadow-lg transition duration-300 group-hover:shadow-purple-500/20"
                          />
                          <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-white mb-1">
                            {item.book_name}
                          </h2>
                          <p className="text-purple-300 font-medium">
                            {item.book_author}
                          </p>
                          <p className="text-white/70 text-sm mt-2 line-clamp-2">
                            {item.book_desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:ml-4">
                        <div className="flex items-center bg-white/10 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-3 py-2 text-white hover:bg-purple-600 transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-3 py-2 text-white hover:bg-purple-600 transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="text-white font-bold text-xl">
                          NPR {(item.book_price * item.quantity).toFixed(2)}
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-white/70 hover:text-red-400 transition"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 p-6 bg-black/30">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-white/70">
                      Total items:{' '}
                      <span className="font-bold text-white">
                        {cart.length}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 mb-1">Total amount:</p>
                    <p className="text-3xl font-bold text-white">
                      NPR {totalPrice.toFixed(2)}
                    </p>
                    <button className="mt-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-purple-500/30 transition duration-300 flex items-center justify-center">
                      <span>Proceed to Payment</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="inline-block p-6 rounded-full bg-white/5 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-purple-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Your cart is empty
              </h2>
              <p className="text-purple-300 mb-6">
                Discover books to add to your collection
              </p>
              <button onClick= { ()=>{
                navigate('/shop');
              } } className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-purple-500/30 transition duration-300">
                Browse Books
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCartPage;
