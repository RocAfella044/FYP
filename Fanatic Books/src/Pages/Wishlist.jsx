import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Bookcard from '../Components/Bookcard';


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
      <div className="mt-8 flex flex-wrap justify-center gap-8 px-4">
        {wishlist.length > 0 ? (
          wishlist.map((book) => (
            <Bookcard key={book.id} type={'book'} book={book} />
          ))
        ) : (
          <p className="text-purple-200">No items in your wishlist.</p>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
