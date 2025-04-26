'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get(
          `http://127.0.0.1:8000/verify-payment/?session_id=${sessionId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setStatus(response.data.status);
      } catch (err) {
        setError('Failed to verify payment');
        setStatus('failed');
        console.error('Verification error:', err);
      }
    };

    if (sessionId) {
      verifyPayment();
    } else {
      setError('No session ID provided');
      setStatus('failed');
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-purple-800 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl text-white text-center">
        {status === 'verifying' && (
          <>
            <h1 className="text-3xl font-bold mb-4">Verifying Payment...</h1>
            <p>Please wait while we verify your payment.</p>
          </>
        )}
        {status === 'completed' && (
          <>
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p>Thank you for your purchase!</p>
            <p>Session ID: {sessionId}</p>
          </>
        )}
        {status === 'failed' && (
          <>
            <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
            <p>
              {error ||
                'There was an issue with your payment. Please try again.'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
