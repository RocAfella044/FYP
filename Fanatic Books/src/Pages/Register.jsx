'use client';

import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Mail,
  User,
  Lock,
  CheckCircle,
  X,
  AlertCircle,
} from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Auto-hide notifications after 5 seconds
  useEffect(() => {
    if (error || success) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
        setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      setSuccess('Account created successfully! Redirecting to login...');

      // Use window.location for actual page navigation after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Google login success handler
  const handleGoogleLoginSuccess = (response) => {
    console.log('Google login successful:', response);
    // Implement your Google login API integration here
    setSuccess('Google sign-up successful! Setting up your account...');

    // Redirect after successful Google login (implement your actual logic)
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  // Google login error handler
  const handleGoogleLoginFailure = (error) => {
    console.error('Google login error:', error);
    setError('Google sign-up failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId="">
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Notification Toast */}
        {showNotification && (error || success) && (
          <div
            className={`fixed top-4 right-4 z-50 max-w-md transform transition-all duration-300 ease-in-out ${
              showNotification
                ? 'translate-y-0 opacity-100'
                : 'translate-y-[-20px] opacity-0'
            }`}
          >
            <div
              className={`flex items-center p-4 rounded-lg shadow-lg ${
                error
                  ? 'bg-red-50 text-red-700 border-l-4 border-red-500'
                  : 'bg-green-50 text-green-700 border-l-4 border-green-500'
              }`}
            >
              <div className="flex-shrink-0 mr-3">
                {error ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              </div>
              <div className="flex-1 mr-2">
                <p className="font-medium">{error || success}</p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="w-full max-w-md px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Create an account
              </h2>
              <p className="text-center text-gray-500 mt-1">
                Join us today and get started
              </p>
            </div>

            {/* Card Content */}
            <div className="px-6 py-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      name="password1"
                      placeholder="Password"
                      value={formData.password1}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <CheckCircle size={18} />
                    </div>
                    <input
                      type="password"
                      name="password2"
                      placeholder="Confirm Password"
                      value={formData.password2}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center transition-all ${
                    isLoading
                      ? 'bg-purple-400 text-white cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isLoading ? 'Creating account...' : 'Register'}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginFailure}
                    useOneTap
                    width="100%"
                    theme="filled_blue"
                    shape="rectangular"
                    text="signup_with"
                    locale="en"
                  />
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="text-sm text-center text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-purple-600 hover:text-purple-700 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
