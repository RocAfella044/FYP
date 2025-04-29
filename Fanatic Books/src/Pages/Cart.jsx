'use client';

import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  'pk_test_51RHd9RFLaNcN5JAOhMD0Rc57F6mlcvPCja833IuHBNo5yvCVwopoGICqoEhNhOo0ncxcrfej34viwXj15YmNhx7600z0NcJd8d'
);

const BookCartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const navigate = useNavigate();
  const invoiceRef = useRef(null);
  const query = new URLSearchParams(window.location.search);
  const paymentStatus = query.get('payment');
  const sessionId = query.get('session_id');

  useEffect(() => {
    if (paymentStatus === 'success' && sessionId) {
      console.log('Payment successful, session ID:', sessionId);
      const fetchPaymentDetails = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/get-payment-details/?session_id=${sessionId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            }
          );
          setPaymentDetails(response.data);
          setPaymentSuccess(true);
          console.log('Payment details:', response.data);
          await clearCart();
          window.history.replaceState({}, document.title, '/cart');
        } catch (error) {
          console.error('Error fetching payment details:', error);
        }
      };
      fetchPaymentDetails();
    }
  }, [query, paymentStatus, sessionId]);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        console.error('No refresh token available.');
        navigate('/login');
        return false;
      }

      const response = await axios.post('http://127.0.0.1:8000/auth/refresh/', {
        refresh: refreshToken,
      });

      const { access } = response.data;
      localStorage.setItem('access_token', access);
      console.log('Access token refreshed successfully.');
      return true;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
      return false;
    }
  };

  const fetchCartData = async () => {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
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

      const processedCart = processCartItems(response.data);
      setCart(processedCart);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('Token expired. Attempting to refresh...');
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          setError('Session refreshed. Please try again.');
        } else {
          setError('Authentication failed. Please log in again.');
        }
      } else {
        setError('Error fetching cart');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const processCartItems = (items) => {
    const bookMap = {};

    items.forEach((item) => {
      const bookId = item.book_id || item.book;

      if (bookMap[bookId]) {
        bookMap[bookId].quantity += item.quantity;
        bookMap[bookId].cartItemIds.push(item.id);
      } else {
        bookMap[bookId] = {
          ...item,
          cartItemIds: [item.id],
        };
      }
    });

    return Object.values(bookMap);
  };

  const updateQuantity = async (bookId, amount) => {
    const item = cart.find(
      (item) => item.book_id === bookId || item.book === bookId
    );
    if (!item) return;

    const newQuantity = item.quantity + amount;
    if (newQuantity < 1) return;

    try {
      const firstItemId = item.cartItemIds[0];

      await axios.patch(
        `http://127.0.0.1:8000/cart/update/${firstItemId}/`,
        { quantity: newQuantity },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      const updatedCart = cart.map((c) =>
        c.book_id === bookId || c.book === bookId
          ? { ...c, quantity: newQuantity }
          : c
      );
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/cart/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const item = cart.find((item) => item.cartItemIds.includes(id));
      if (item) {
        for (const dupId of item.cartItemIds) {
          if (dupId !== id) {
            await axios.delete(`http://127.0.0.1:8000/cart/${dupId}/`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            });
          }
        }
      }

      setCart(cart.filter((item) => !item.cartItemIds.includes(id)));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('http://127.0.0.1:8000/cart/clear/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleProceedToPayment = () => {
    setShowPaymentPopup(true);
  };

  const closePaymentPopup = () => {
    setShowPaymentPopup(false);
    setPaymentProcessing(false);
  };

  const handleStripePayment = async () => {
    setPaymentProcessing(true);
    try {
      const stripe = await stripePromise;
      const accessToken = localStorage.getItem('access_token');

      const response = await axios.post(
        'http://127.0.0.1:8000/create-checkout-session/',
        {
          cartItems: cart.map((item) => ({
            book_id: item.book_id || item.book,
            quantity: item.quantity,
            price: item.book_price,
            book_name: item.book_name,
          })),
          total_amount: totalPrice,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { sessionId } = response.data;
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error('Stripe redirect error:', error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Failed to process payment. Please try again.');
      setPaymentProcessing(false);
    }
  };

  const downloadInvoice = () => {
    if (!invoiceRef.current || !paymentDetails) {
      console.error('No invoice reference or payment details available.');
      alert('Unable to generate invoice: No payment details found.');
      return;
    }

    // Attempt to use html2canvas
    html2canvas(invoiceRef.current, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice-${paymentDetails.id || 'unknown'}.pdf`);
      })
      .catch((error) => {
        console.error('Error with html2canvas, falling back to jsPDF:', error);
        // Fallback to jsPDF-only method
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(20);
        doc.setTextColor(128, 0, 128);
        doc.text('BookStore Invoice', pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Invoice #: ${paymentDetails.id || 'N/A'}`, 20, 40);
        doc.text(
          `Date: ${
            paymentDetails.created
              ? new Date(paymentDetails.created * 1000).toLocaleString()
              : 'N/A'
          }`,
          20,
          50
        );
        doc.text(`Customer: ${paymentDetails.customer_email || 'N/A'}`, 20, 60);
        doc.text(
          `Payment Method: ${
            paymentDetails.payment_method_details?.card
              ? `${paymentDetails.payment_method_details.card.brand.toUpperCase()} **** ${
                  paymentDetails.payment_method_details.card.last4
                }`
              : 'N/A'
          }`,
          20,
          70
        );

        let yPos = 90;
        doc.text('Order Summary:', 20, yPos);
        yPos += 10;

        paymentDetails.line_items?.data?.forEach((item) => {
          const unitPrice = (item.amount_total / item.quantity / 100).toFixed(2);
          const totalPrice = (item.amount_total / 100).toFixed(2);
          doc.text(
            `${item.description || 'Unknown Item'} x${item.quantity} - USD ${unitPrice} = USD ${totalPrice}`,
            20,
            yPos
          );
          yPos += 10;
        }) || doc.text('No items available', 20, yPos);

        yPos += 10;
        doc.text(
          `Total Amount: USD ${(paymentDetails.amount_total / 100).toFixed(2)}`,
          20,
          yPos
        );

        doc.save(`invoice-${paymentDetails.id || 'unknown'}.pdf`);
      });
  };

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
            <p className="text-white font-medium">{cart.length} unique books</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
          {cart.length > 0 ? (
            <div>
              <div className="p-6">
                {cart.map((item) => (
                  <div
                    key={item.book_id || item.book}
                    className="group relative mb-6 last:mb-0 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition duration-300"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <img
                            src={
                              item.book_image
                                ? `${item.book_image}`
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
                            onClick={() =>
                              updateQuantity(item.book_id || item.book, -1)
                            }
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
                            onClick={() =>
                              updateQuantity(item.book_id || item.book, 1)
                            }
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
                          USD {(item.book_price * item.quantity).toFixed(2)}
                        </div>

                        <button
                          onClick={() => removeItem(item.cartItemIds[0])}
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
                      Total unique books:{' '}
                      <span className="font-bold text-white">
                        {cart.length}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 mb-1">Total amount:</p>
                    <p className="text-3xl font-bold text-white">
                      USD {totalPrice.toFixed(2)}
                    </p>
                    <button
                      onClick={handleProceedToPayment}
                      className="mt-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-purple-500/30 transition duration-300 flex items-center justify-center"
                    >
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
              <button
                onClick={() => navigate('/shop')}
                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-purple-500/30 transition duration-300"
              >
                Browse Books
              </button>
            </div>
          )}
        </div>
      </div>

      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in-up">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  Confirm Payment
                </h3>
                <button
                  onClick={closePaymentPopup}
                  className="text-gray-500 hover:text-gray-700 transition"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  You will be redirected to Stripe to complete your payment.
                </p>
                {error && <div className="text-red-500 mb-4">{error}</div>}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    USD {totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
                  <span className="font-medium text-gray-800">Total</span>
                  <span className="font-bold text-gray-800">
                    USD {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleStripePayment}
                disabled={paymentProcessing}
                className={`w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-purple-500/30 transition duration-300 flex items-center justify-center ${
                  paymentProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>
                  {paymentProcessing ? 'Processing...' : 'Pay with Stripe'}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentSuccess && paymentDetails && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in-up">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  Payment Successful!
                </h3>
                <button
                  onClick={() => setPaymentSuccess(false)}
                  className="text-gray-500 hover:text-gray-700 transition"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-bold text-gray-800 mb-2">
                    Order Summary
                  </h4>
                  {paymentDetails.line_items.data.map((item, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <span className="text-gray-600">
                        {item.description} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        USD {(item.amount_total / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-gray-800">
                      USD {(paymentDetails.amount_total / 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">
                    Payment Details
                  </h4>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Card:</span> **** **** ****{' '}
                    {paymentDetails.payment_method_details.card.last4}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Type:</span>{' '}
                    {paymentDetails.payment_method_details.card.brand}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(paymentDetails.created * 1000).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Hidden Invoice Template */}
              <div
                ref={invoiceRef}
                className="absolute top-0 left-0 w-[210mm] p-8 bg-white text-black"
                style={{ visibility: 'hidden' }}
              >
                <h1 className="text- QMessageBox font-bold text-purple-800 text-center mb-6">
                  BookStore Invoice
                </h1>
                <div className="mb-4">
                  <p>
                    <strong>Invoice #:</strong> {paymentDetails.id || 'N/A'}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {paymentDetails.created
                      ? new Date(paymentDetails.created * 1000).toLocaleString()
                      : 'N/A'}
                  </p>
                  <p>
                    <strong>Customer:</strong>{' '}
                    {paymentDetails.customer_email || 'N/A'}
                  </p>
                  <p>
                    <strong>Payment Method:</strong>{' '}
                    {paymentDetails.payment_method_details?.card
                      ? `${paymentDetails.payment_method_details.card.brand.toUpperCase()} **** ${
                          paymentDetails.payment_method_details.card.last4
                        }`
                      : 'N/A'}
                  </p>
                </div>
                <table className="w-full border-collapse mb-4">
                  <thead>
                    <tr className="bg-purple-200">
                      <th className="border p-2 text-left">Item</th>
                      <th className="border p-2 text-left">Quantity</th>
                      <th className="border p-2 text-left">Price</th>
                      <th className="border p-2 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentDetails.line_items?.data?.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">
                          {item.description || 'Unknown Item'}
                        </td>
                        <td className="border p-2">{item.quantity || 1}</td>
                        <td className="border p-2">
                          USD{' '}
                          {(item.amount_total
                            ? item.amount_total / item.quantity / 100
                            : 0
                          ).toFixed(2)}
                        </td>
                        <td className="border p-2">
                          USD{' '}
                          {(item.amount_total ? item.amount_total / 100 : 0).toFixed(
                            2
                          )}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan="4" className="border p-2 text-center">
                          No items available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <p className="text-lg font-bold">
                  Total Amount: USD{' '}
                  {(paymentDetails.amount_total
                    ? paymentDetails.amount_total / 100
                    : 0
                  ).toFixed(2)}
                </p>
                <p className="text-center mt-4">
                  Thank you for shopping with us!
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={downloadInvoice}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-blue-500/30 transition duration-300 flex items-center justify-center"
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Invoice
                </button>
                <button
                  onClick={() => setPaymentSuccess(false)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-purple-500/30 transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCartPage;