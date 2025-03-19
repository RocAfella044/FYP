import axios from 'axios';
import React, { useState, useEffect } from 'react';

const BookCartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

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
            Authorization: `Bearer ${accessToken}`, // ✅ Send token properly
          },
        });

        setCart(response.data);
      } catch (error) {
        console.error(
          'Error fetching cart:',
          error.response?.data || error.message
        );
        setError(error.response?.data || 'Error fetching cart');

        // 🔄 If the token is expired (401 Unauthorized), refresh it and retry
        if (error.response?.status === 401) {
          console.log('Token expired. Attempting to refresh...');
          await refreshAccessToken();
          await fetchCartData(); // Retry after refreshing token
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  console.log(cart);

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

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    fetch(``, {
      method: 'DELETE',
    });
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading)
    return <p className="text-center text-gray-700">Loading cart...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-white mb-6">Your Book Cart</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        {cart.length > 0 ? (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b py-4"
              >
                <div>
                  <h2 className="text-lg font-bold">{item.title}</h2>
                  <p className="text-gray-600">{item.author}</p>
                  <p className="text-purple-700 font-semibold">${item.price}</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="text-right mt-4">
              <h2 className="text-xl font-bold">Total: ${totalPrice}</h2>
              <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                Checkout
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-700">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default BookCartPage;
