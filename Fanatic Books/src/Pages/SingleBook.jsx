'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

const SingleBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  // States for rating and comments
  const [ratings, setRatings] = useState([]);
  const [comments, setComments] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userRatingId, setUserRatingId] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingComment, setEditingComment] = useState(false);
  const [userComment, setUserComment] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [username, setUsername] = useState('');

  // Check if user is authenticated
  const checkAuthentication = () => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    if (token) {
      fetchCurrentUser(token);
    }
  };

  // Fetch current user
  const fetchCurrentUser = async (token) => {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/current-user/',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsername(response.data.username);
    } catch (err) {
      console.error('Failed to fetch current user:', err);
    }
  };

  const fetchWishlist = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setWishlistLoading(false);
      return;
    }

    try {
      setWishlistLoading(true);
      const res = await axios.get('http://127.0.0.1:8000/wishlistitem/', {
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
    } finally {
      setWishlistLoading(false);
    }
  };

  const fetchCart = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setCartLoading(false);
      return;
    }

    try {
      setCartLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/cart/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setCart(response.data);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setCartLoading(false);
    }
  };

  // Fetch ratings with improved error handling
  const fetchRatings = async () => {
    try {
      setRatingsLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/get_book_ratings/?book_id=${id}`
      );

      if (Array.isArray(response.data)) {
        setRatings(response.data);

        // Calculate average rating
        if (response.data.length > 0) {
          const sum = response.data.reduce(
            (acc, rating) => acc + rating.value,
            0
          );
          setAverageRating((sum / response.data.length).toFixed(1));
        } else {
          setAverageRating(0);
        }

        // Check if current user has already rated
        if (isAuthenticated && username) {
          const userRatingObj = response.data.find(
            (r) => r.username === username
          );
          if (userRatingObj) {
            setUserRating(userRatingObj.value);
            setUserRatingId(userRatingObj.id);
          } else {
            setUserRating(0);
            setUserRatingId(null);
          }
        }
      } else {
        setRatings([]);
        setAverageRating(0);
      }
    } catch (err) {
      console.error('Failed to load ratings:', err);
      toast.error('Failed to load ratings');
    } finally {
      setRatingsLoading(false);
    }
  };

  // Fetch comments with improved error handling
  // Fetch comments with improved error handling
  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/get_book_comments/?book_id=${id}`
      );

      if (Array.isArray(response.data)) {
        setComments(response.data);
        // ...other code
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
      toast.error('Failed to load comments');
    } finally {
      setCommentsLoading(false);
    }
  };

  // Refresh access token
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
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsAuthenticated(false);
      return false;
    }
  };

  // Fetch book details
  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/books/${id}/`
      );
      const fetchedBook = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      if (fetchedBook) {
        setBook(fetchedBook);
      } else {
        setError('Book not found');
      }
    } catch (err) {
      console.error('Error fetching book:', err);
      setError('Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  // Add to wishlist
  const addToWishlist = async (bookId, retry = false) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to wishlist.');
      return;
    }

    const accessToken = localStorage.getItem('access_token');
    try {
      await axios.post(
        `http://127.0.0.1:8000/wishlistitem/${bookId}/`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success('Book added to wishlist!');
      fetchWishlist();
    } catch (error) {
      if (error.response?.status === 401 && !retry) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return addToWishlist(bookId, true);
      }

      console.error(
        'Add to wishlist error:',
        error?.response?.data || error.message
      );
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        'Failed to add book to wishlist.';
      toast.error(msg);
    }
  };

  // Add to cart
  const addToCart = async (bookId, retry = false) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to the cart.');
      return;
    }

    const accessToken = localStorage.getItem('access_token');
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
      fetchCart();
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

  // Submit or update rating
  const submitRating = async (value, retry = false) => {
    if (!isAuthenticated) {
      toast.error('Please log in to rate this book.');
      return;
    }

    setSubmittingRating(true);
    const accessToken = localStorage.getItem('access_token');

    try {
      let response;

      if (userRatingId) {
        // Update existing rating
        response = await axios.put(
          `http://127.0.0.1:8000/update_delete_rating/${userRatingId}/`,
          { value: Number.parseInt(value) },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toast.success('Rating updated successfully!');
      } else {
        // Create new rating
        response = await axios.post(
          'http://127.0.0.1:8000/create_book_rating/',
          {
            book: Number.parseInt(id),
            value: Number.parseInt(value),
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toast.success('Rating submitted successfully!');
      }

      setUserRating(value);
      if (response.data.id) {
        setUserRatingId(response.data.id);
      }
      fetchRatings();
    } catch (error) {
      // Error handling remains the same
      if (error.response?.status === 401 && !retry) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return submitRating(value, true);
      }

      console.error('Rating error:', error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        'Failed to submit rating';
      toast.error(errorMessage);
    } finally {
      setSubmittingRating(false);
    }
  };

  // Delete rating
  const deleteRating = async (retry = false) => {
    if (!isAuthenticated || !userRatingId) {
      return;
    }

    const accessToken = localStorage.getItem('access_token');
    try {
      await axios.delete(
        `http://127.0.0.1:8000/update_delete_rating/${userRatingId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success('Rating removed successfully!');
      setUserRating(0);
      setUserRatingId(null);
      fetchRatings();
    } catch (error) {
      // Error handling remains the same
      if (error.response?.status === 401 && !retry) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return deleteRating(true);
      }

      console.error('Delete rating error:', error);
      toast.error('Failed to remove rating');
    }
  };

  // Submit or update comment
  const handleCommentSubmit = async (e, retry = false) => {
    e.preventDefault();

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please log in to comment on this book.');
      return;
    }

    // Check if user already has a comment and is not in edit mode
    if (userComment && !editingComment) {
      toast.error(
        'You can only leave one comment per book. Edit your existing comment instead.'
      );
      return;
    }

    setSubmittingComment(true);
    const accessToken = localStorage.getItem('access_token');

    try {
      if (userComment) {
        // Update existing comment
        await axios.put(
          `http://127.0.0.1:8000/update_delete_comment/${userComment.id}/`,
          { text: commentText },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toast.success('Comment updated successfully!');
        setEditingComment(false);
      } else {
        // Create new comment
        await axios.post(
          'http://127.0.0.1:8000/create_book_comment/',
          {
            book: Number.parseInt(id),
            text: commentText,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toast.success('Comment posted successfully!');
      }

      fetchComments();
    } catch (error) {
      if (error.response?.status === 401 && !retry) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return handleCommentSubmit(e, true);
      }

      console.error('Comment error:', error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        'Failed to submit comment';
      toast.error(errorMessage);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Delete comment
  const deleteComment = async (retry = false) => {
    if (!isAuthenticated || !userComment) {
      return;
    }

    const accessToken = localStorage.getItem('access_token');

    try {
      await axios.delete(
        `http://127.0.0.1:8000/update_delete_comment/${userComment.id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success('Comment deleted successfully!');
      setUserComment(null);
      setCommentText('');
      fetchComments();
    } catch (error) {
      if (error.response?.status === 401 && !retry) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return deleteComment(true);
      }

      console.error('Delete comment error:', error);
      toast.error('Failed to delete comment');
    }
  };

  // Toggle edit mode for comment
  const toggleEditComment = () => {
    if (editingComment) {
      // Cancel editing
      setEditingComment(false);
      setCommentText(userComment.text);
    } else {
      // Start editing
      setEditingComment(true);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Initial data loading
  useEffect(() => {
    checkAuthentication();
    if (id) {
      fetchBookDetails();
      fetchRatings();
      fetchComments();
      fetchWishlist();
      fetchCart();
    }
  }, [id]);

  // Update user rating when authentication status changes
  useEffect(() => {
    if (isAuthenticated && ratings.length > 0 && username) {
      const userRatingObj = ratings.find((r) => r.username === username);
      if (userRatingObj) {
        setUserRating(userRatingObj.value);
        setUserRatingId(userRatingObj.id);
      } else {
        setUserRating(0);
        setUserRatingId(null);
      }
    } else if (!isAuthenticated) {
      setUserRating(0);
      setUserRatingId(null);
    }
  }, [isAuthenticated, ratings, username]);

  // Update user comment when authentication status changes
  useEffect(() => {
    if (isAuthenticated && comments.length > 0 && username) {
      const userCommentObj = comments.find((c) => c.username === username);
      if (userCommentObj) {
        setUserComment(userCommentObj);
        setCommentText(userCommentObj.text);
        setEditingComment(false); // Reset editing mode when comment changes
      } else {
        setUserComment(null);
        setCommentText('');
      }
    } else if (!isAuthenticated) {
      setUserComment(null);
      setCommentText('');
      setEditingComment(false);
    }
  }, [isAuthenticated, comments, username]);

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

  const isBookInWishlist = wishlist.some((item) => item.book == id);
  const isBookInCart = cart.some((item) => item.book == id);

  return (
    <div className="bg-black min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto border border-purple-900 rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex items-center justify-center p-8">
            {book.book_image ? (
              <img
                src={book.book_image || '/placeholder.svg'}
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
            <div className="text-gray-300 text-lg">
              Author: {book.book_author}
            </div>

            {/* Rating display */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`h-6 w-6 ${
                      star <= averageRating
                        ? 'text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white font-medium">
                {ratingsLoading
                  ? 'Loading ratings...'
                  : averageRating > 0
                  ? `${averageRating} out of 5 ${
                      ratings.length > 0
                        ? `(${ratings.length} ${
                            ratings.length === 1 ? 'review' : 'reviews'
                          })`
                        : ''
                    }`
                  : 'No ratings yet'}
              </span>
            </div>

            <div className="text-gray-300 text-lg">{book.book_desc}</div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-purple-900/50">
              <div>
                <h3 className="text-purple-400 text-sm">Genre</h3>
                <p className="text-white text-lg">{book.book_genre}</p>
              </div>
              <div>
                <h3 className="text-purple-400 text-sm">Price</h3>
                <p className="text-white text-2xl font-bold">
                  USD {book.book_price}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className={`border-2 border-purple-600 text-purple-400 ${
                  !isBookInCart && !cartLoading ? 'hover:bg-purple-900' : ''
                } px-6 py-3 rounded-md flex-1 ${
                  cartLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => {
                  if (!isBookInCart && !cartLoading) {
                    addToCart(book.id);
                  }
                }}
                disabled={isBookInCart || cartLoading}
              >
                {cartLoading
                  ? 'Loading...'
                  : isBookInCart
                  ? 'Already in Cart'
                  : 'Add to Cart'}
              </button>
              <button
                className={`border-2 border-purple-600 text-purple-400 ${
                  !isBookInWishlist && !wishlistLoading
                    ? 'hover:bg-purple-900'
                    : ''
                } px-6 py-3 rounded-md flex-1 ${
                  wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => {
                  if (!isBookInWishlist && !wishlistLoading) {
                    addToWishlist(book.id);
                  }
                }}
                disabled={isBookInWishlist || wishlistLoading}
              >
                {wishlistLoading
                  ? 'Loading...'
                  : isBookInWishlist
                  ? 'Already in Wishlist'
                  : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rating and Review Section */}
      <div className="max-w-6xl mx-auto mt-8 border border-purple-900 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Ratings & Reviews
        </h2>

        {/* User rating widget */}
        <div className="mb-8">
          <h3 className="text-xl text-purple-400 mb-4">Rate this book</h3>
          {!isAuthenticated ? (
            <div className="text-gray-400 bg-gray-900/50 p-4 rounded-lg border border-purple-900/50">
              Please log in to rate this book.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`h-8 w-8 cursor-pointer transition-colors ${
                        star <= (hoveredRating || userRating)
                          ? 'text-yellow-400'
                          : 'text-gray-600'
                      }`}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => !submittingRating && submitRating(star)}
                    />
                  ))}
                </div>
                <span className="text-white ml-2">
                  {submittingRating
                    ? 'Submitting...'
                    : userRating > 0
                    ? `Your rating: ${userRating}/5`
                    : 'Click to rate'}
                </span>
              </div>

              {userRating > 0 && (
                <button
                  onClick={() => !submittingRating && deleteRating()}
                  className="text-red-400 hover:text-red-300 text-sm underline"
                  disabled={submittingRating}
                >
                  Remove rating
                </button>
              )}
            </div>
          )}
        </div>

        {/* User Comment Section */}
        <div className="mb-8">
          <h3 className="text-xl text-purple-400 mb-4">Your Review </h3>

          {!isAuthenticated ? (
            <div className="text-gray-400 bg-gray-900/50 p-4 rounded-lg border border-purple-900/50">
              Please log in to write a review.
            </div>
          ) : commentsLoading ? (
            <div className="text-purple-400 py-4">Loading your review...</div>
          ) : (
            <div className="space-y-4">
              {userComment && !editingComment ? (
                // Display existing comment with edit/delete options
                <div className="border border-purple-900/50 rounded-lg p-4 bg-gray-900/30">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-purple-400">
                      {username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(userComment.created_at)}
                    </div>
                  </div>
                  <div className="text-white mb-4">{userComment.text}</div>
                  <div className="flex space-x-4">
                    <button
                      onClick={toggleEditComment}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={deleteComment}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : userComment && editingComment ? (
                // Edit existing comment
                <form onSubmit={handleCommentSubmit} className="space-y-3">
                  <div className="text-sm text-gray-400 mb-1">
                    Editing your review
                  </div>
                  <textarea
                    className="w-full p-3 bg-gray-900 border border-purple-800 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    rows="4"
                    placeholder="Share your thoughts about this book..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={submittingComment}
                  ></textarea>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className={`bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md transition-colors ${
                        submittingComment ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={submittingComment}
                    >
                      {submittingComment ? 'Updating...' : 'Update Review'}
                    </button>
                    <button
                      type="button"
                      onClick={toggleEditComment}
                      className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // Add new comment (only if user doesn't have one already)
                <form onSubmit={handleCommentSubmit} className="space-y-3">
                  <div className="text-sm text-gray-400 mb-1">
                    You can only submit one review per book
                  </div>
                  <textarea
                    className="w-full p-3 bg-gray-900 border border-purple-800 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    rows="4"
                    placeholder="Share your thoughts about this book..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={submittingComment}
                  ></textarea>
                  <button
                    type="submit"
                    className={`bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md transition-colors ${
                      submittingComment ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={submittingComment}
                  >
                    {submittingComment ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        
        {/* Other Reviews Section - Ensure comments are displayed regardless of login status */}
        <div>
          <h3 className="text-xl text-purple-400 mb-4">Other Reviews</h3>

          {commentsLoading ? (
            <div className="text-purple-400 py-4">Loading reviews...</div>
          ) : comments.length === 0 ? (
            <p className="text-gray-400 py-4">No reviews yet.</p>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-t border-purple-900/50 pt-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-purple-400">
                      {comment.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(comment.created_at)}
                    </div>
                  </div>
                  <div className="mt-2 text-white">{comment.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
