import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-purple-800 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center">
        <div className="inline-block p-6 rounded-full bg-green-500/20 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Payment Successful!
        </h2>
        <p className="text-purple-300 mb-6">
          Thank you for your purchase. Your order has been processed.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-purple-500/30 transition duration-300"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
