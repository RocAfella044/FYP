import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const pidx = params.get('pidx');

      if (!pidx) {
        setError('Payment ID not found');
        setLoading(false);
        return;
      }

      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          setError('User not authenticated');
          setLoading(false);
          navigate('/login');
          return;
        }

        const response = await axios.post(
          'http://127.0.0.1:8000/api/api/verify-payment/', // Updated URL
          { pidx },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.message === 'Payment verified') {
          navigate('/order-success');
        } else {
          setError('Payment verification failed');
          navigate('/cart');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setError('Error verifying payment');
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-purple-800 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-medium">Verifying payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-purple-800 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl">
          <p className="text-white font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return null; // Redirects handle the navigation
};

export default Payment;
