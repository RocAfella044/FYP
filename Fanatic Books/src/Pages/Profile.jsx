import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
  FaUser,
  FaEnvelope,
  FaEdit,
  FaPhone,
  FaMapMarkerAlt,
  FaSave,
  FaTimes,
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
  // Store original data to check if phone number was changed
  const [originalData, setOriginalData] = useState(null);

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

        // Store the original data for comparison later
        setOriginalData({
          username: response.data.username,
          profile: {
            phone: response.data.profile?.phone || '',
            address: response.data.profile?.address || '',
          },
        });

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
          address: value,
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

    // Create the data to send - only include changed phone if it was actually changed
    let dataToSend = {
      username: formData.username,
      profile: {
        address: formData.profile.address,
      },
    };

    // Only include phone in the update if it was changed
    if (formData.profile.phone !== originalData.profile.phone) {
      dataToSend.profile.phone = formData.profile.phone;
    }

    console.log('Sending data to backend:', dataToSend);

    try {
      const response = await api.put('/api/user/profile', dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response from backend:', response.data);

      // Update userData immediately without reloading
      setUserData({
        ...userData,
        username: formData.username,
        profile: {
          ...userData.profile,
          phone: formData.profile.phone,
          address: formData.profile.address,
        },
      });

      // Update original data for next comparison
      setOriginalData({
        username: formData.username,
        profile: {
          phone: formData.profile.phone,
          address: formData.profile.address,
        },
      });

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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto transform transition-all hover:shadow-xl">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-700 text-white p-6">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white text-3xl mr-5 shadow-md">
              {userData.first_name?.charAt(0) || <FaUser />}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {userData.first_name} {userData.last_name}
              </h1>
              <p className="text-purple-200 flex items-center mt-1">
                <FaUser className="mr-1 text-sm" />@{userData.username}
              </p>
            </div>
          </div>
        </div>

        {/* Info Content */}
        <div className="p-6">
          {/* Alert Messages */}
          {success && (
            <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md animate-fadeIn flex items-center">
              <div className="rounded-full bg-green-500 text-white p-1 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p>{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md animate-fadeIn flex items-center">
              <div className="rounded-full bg-red-500 text-white p-1 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p>{error}</p>
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-5">
              <h2 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 mb-4">
                Personal Information
              </h2>

              {/* Email */}
              <div className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors">
                <div className="mr-4 text-purple-600 bg-purple-100 rounded-full p-2">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium">
                    {userData.email || 'No email provided'}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors">
                <div className="mr-4 text-purple-600 bg-purple-100 rounded-full p-2">
                  <FaPhone />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800 font-medium">
                    {userData.profile?.phone || 'No phone provided'}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start p-3 hover:bg-gray-50 rounded-md transition-colors">
                <div className="mr-4 text-purple-600 bg-purple-100 rounded-full p-2">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800 font-medium whitespace-pre-wrap">
                    {userData.profile?.address || 'No address provided'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileEditSubmit} className="mt-2 space-y-5">
              <h2 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 mb-4">
                Edit Profile
              </h2>

              {/* Username */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <FaPhone />
                  </span>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.profile.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      phoneError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-purple-500'
                    } rounded-md focus:outline-none focus:ring-2 focus:border-transparent`}
                    placeholder="e.g., +1234567890"
                  />
                </div>
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {phoneError}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <div className="relative">
                  <span className="absolute top-3 left-3 text-gray-500">
                    <FaMapMarkerAlt />
                  </span>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.profile.address}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </form>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setPhoneError(null);
                    // Reset form data to original values
                    setFormData({
                      username: userData.username,
                      profile: {
                        phone: userData.profile?.phone || '',
                        address: userData.profile?.address || '',
                      },
                    });
                  }}
                  className="flex items-center bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-colors"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
                <button
                  onClick={handleProfileEditSubmit}
                  disabled={updateLoading}
                  className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  {updateLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" /> Save Changes
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
