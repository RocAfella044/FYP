import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      toast.error('You need to be logged in to view your wishlist.');
      return;
    }

    try {
      const res = await axios.get('http://127.0.0.1:8000/wishlist/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(res.data)) {
        setWishlist(res.data);
      } else {
        setWishlist([]);
        toast.error('Invalid response format for wishlist.');
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
      toast.error('Failed to fetch wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-purple-400">
        Loading your wishlist...
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Your Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <div
              key={item.id}
              className="border border-purple-800 p-4 rounded-lg"
            >
              <img
                src={item.book_image || '/placeholder.svg'}
                alt={item.book_name}
                className="w-full h-64 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold">{item.book_name}</h2>
              <p className="text-gray-300">{item.book_desc}</p>
              <p className="text-purple-400 mt-2">NPR {item.book_price}</p>
            </div>
          ))
        ) : (
          <p className="text-purple-200">No items in your wishlist.</p>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
