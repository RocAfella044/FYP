import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Install this package for Google login

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      alert('Account created successfully!');
      window.location.href = '/login';
    } catch (err) {
      setError(err.message);
    }
  };

  // Google login success handler
  const handleGoogleLoginSuccess = (response) => {
    console.log('Google login successful:', response);
    // Implement your Google login API integration here
  };

  // Google login error handler
  const handleGoogleLoginFailure = (error) => {
    console.error('Google login error:', error);
    setError('Google login failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId="">
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-black via-purple-900 to-white">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
            Register
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="password"
              name="password1"
              placeholder="Password"
              value={formData.password1}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Register
            </button>
          </form>

          <div className="flex justify-center mt-4 space-x-4">
            {/* Google login button */}
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
              useOneTap
              width="100%"
            />
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-purple-600 hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
