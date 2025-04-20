// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Bookcard from '../Components/Bookcard';

// const WishlistPage = () => {
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchWishlist = async () => {
//     const token = localStorage.getItem('access_token');

//     if (!token) {
//       toast.error('You need to be logged in to view your wishlist.');
//       setLoading(false);
//       return;
//     }

//     try {
//       // Fetch wishlist items
//       const res = await axios.get('http://127.0.0.1:8000/wishlistitem/', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (Array.isArray(res.data)) {
//         setWishlistItems(res.data);

//         // Fetch book details for each wishlist item
//         const bookDetailsPromises = res.data.map((item) =>
//           axios.get(`http://127.0.0.1:8000/api/books/${item.book}/`)
//         );

//         const bookResponses = await Promise.all(bookDetailsPromises);
//         const fetchedBooks = bookResponses.map((response) => {
//           // Handle potential array or object response
//           return Array.isArray(response.data)
//             ? response.data[0]
//             : response.data;
//         });

//         setBooks(fetchedBooks);
//       } else {
//         setWishlistItems([]);
//         toast.error('Invalid response format for wishlist.');
//       }
//     } catch (err) {
//       console.error('Failed to load wishlist:', err);
//       toast.error('Failed to fetch wishlist.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWishlist();
//   }, []);

//   // Function to remove item from wishlist
//   const removeFromWishlist = async (itemId) => {
//     const token = localStorage.getItem('access_token');

//     if (!token) {
//       toast.error(
//         'You need to be logged in to remove items from your wishlist.'
//       );
//       return;
//     }

//     try {
//       await axios.delete(`http://127.0.0.1:8000/wishlistitem/${itemId}/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success('Item removed from wishlist');
//       fetchWishlist(); // Refresh the wishlist
//     } catch (err) {
//       console.error('Failed to remove item from wishlist:', err);
//       toast.error('Failed to remove item from wishlist.');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-black text-purple-400">
//         Loading your wishlist...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-black min-h-screen text-white p-8">
//       <h1 className="text-3xl font-bold mb-6 text-purple-400">Your Wishlist</h1>
//       <div className="mt-8 flex flex-wrap justify-center gap-8 px-4">
//         {books.length > 0 ? (
//           books.map((book, index) => (
//             <div key={book.id} className="relative">
//               <Bookcard book={book} type="book" />
//               <button
//                 onClick={() => removeFromWishlist(wishlistItems[index].id)}
//                 className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center"
//               >
//                 ×
//               </button>
//             </div>
//           ))
//         ) : (
//           <p className="text-purple-200">No items in your wishlist.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WishlistPage;


import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Bookcard from '../Components/Bookcard';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      toast.error('You need to be logged in to view your wishlist.');
      setLoading(false);
      return;
    }

    try {
      // Fetch wishlist items
      const res = await axios.get('http://127.0.0.1:8000/wishlistitem/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(res.data)) {
        setWishlistItems(res.data);

        // Fetch book details for each wishlist item
        const bookDetailsPromises = res.data.map((item) =>
          axios.get(`http://127.0.0.1:8000/api/books/${item.book}/`)
        );

        const bookResponses = await Promise.all(bookDetailsPromises);
        const fetchedBooks = bookResponses.map((response, index) => {
          // Handle potential array or object response
          const bookData = Array.isArray(response.data)
            ? response.data[0]
            : response.data;
          // Add the wishlist item id to the book object for easier reference
          return { ...bookData, wishlistItemId: res.data[index].id };
        });

        setBooks(fetchedBooks);
      } else {
        setWishlistItems([]);
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

  // Function to remove item from wishlist
  const removeFromWishlist = async (bookId) => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      toast.error(
        'You need to be logged in to remove items from your wishlist.'
      );
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/wishlistitem/${bookId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Item removed from wishlist');
      fetchWishlist(); // Refresh the wishlist
    } catch (err) {
      console.error('Failed to remove item from wishlist:', err);
      toast.error('Failed to remove item from wishlist.');
    }
  };

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
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="relative group">
              <Bookcard book={book} type="book" />
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation from the Link in Bookcard
                  removeFromWishlist(book.id);
                }}
                className="absolute top-3 right-3 bg-opacity-0 hover:bg-opacity-90 bg-red-600 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center transform transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl hover:scale-110"
                title="Remove from wishlist"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
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