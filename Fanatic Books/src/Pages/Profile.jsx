import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
  FaUser,
  FaEnvelope,
  FaEdit,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    profile: {
      phone: '',
      address: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    profile: {
      phone: '',
      address: '',
    },
  });

  // For phone number validation
  const [phoneError, setPhoneError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Profile data received:', response.data);
        setUserData(response.data);
        setFormData({
          username: response.data.username,
          profile: {
            phone: response.data.profile?.phone || '',
            address: response.data.profile?.address || '',
          },
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile');
        setLoading(false);

        if (err.response && err.response.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const validatePhone = (phone) => {
    // Simple phone validation - check format
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (phone && !phoneRegex.test(phone)) {
      return 'Please enter a valid phone number (10-15 digits)';
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'username') {
      setFormData({
        ...formData,
        username: value,
      });
    } else if (name === 'phone') {
      // Clear phone error when user types
      setPhoneError(null);
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          phone: value,
        },
      });
    } else if (name === 'address') {
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [name]: value,
        },
      });
    }
  };

  const handleProfileEditSubmit = async (e) => {
    e.preventDefault();

    // Validate phone before submission
    const phoneValidationError = validatePhone(formData.profile.phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    const token = localStorage.getItem('access_token');

    setError(null);
    setSuccess(null);
    setUpdateLoading(true);

    console.log('Sending data to backend:', formData);

    // From the handleProfileEditSubmit function in the code I provided:
    try {
      const response = await api.put('/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response from backend:', response.data);

      // Update userData immediately without reloading
      setUserData(response.data);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);

      if (err.response?.data?.profile?.phone) {
        // Handle phone number uniqueness error
        setPhoneError(err.response.data.profile.phone[0]);
      } else if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-purple-900 text-white p-4">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-purple-700 flex items-center justify-center text-white text-2xl mr-4">
              <FaUser />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {userData.first_name} {userData.last_name}
              </h1>
              <p className="text-sm text-purple-200">@{userData.username}</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Success Message */}
          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <p>{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start">
              {/* ... */}
              <p className="text-gray-800">
                {userData.email || 'No email provided'}
              </p>
            </div>
            {/* Phone */}
            <div className="flex items-start">
              {/* ... */}
              <p className="text-gray-800">
                {userData.profile?.phone || 'No phone provided'}
              </p>
            </div>
            {/* Address */}
            <div className="flex items-start">
              {/* ... */}
              <p className="text-gray-800">
                {userData.profile?.address || 'No address provided'}
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <FaEdit className="mr-2" />{' '}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleProfileEditSubmit} className="mt-6 space-y-4">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm text-gray-500"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm text-gray-500">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.profile.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${
                    phoneError ? 'border-red-500' : 'border-gray-300'
                  } rounded-md mt-2`}
                  placeholder="e.g., +1234567890"
                />
                {phoneError && (
                  <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm text-gray-500"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.profile.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
                  rows="3"
                />
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
