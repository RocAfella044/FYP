import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { FaUser, FaEnvelope, FaEdit } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const [profile, setProfile] = useState({
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

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
        setUser(response.data);
        setProfile({
          phone: response.data.phone,
          address: response.data.address,
        });
        setNewUsername(response.data.username);
        setNewPhone(response.data.phone);
        setNewAddress(response.data.address);
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

  const handleProfileEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    const updatedProfile = {
      username: newUsername,
      profile: {
        phone: newPhone,
        address: newAddress,
      },
    };

    try {
      const response = await api.put('/api/user/profile', updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      setProfile(response.data.profile);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
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
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-sm text-purple-200">@{user.username}</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start">
              <div className="text-gray-400 w-8 mr-2 mt-1">
                <FaEnvelope />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">
                  {user?.email || 'No email provided'}
                </p>
              </div>
            </div>
            {/* Phone */}
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-800">
                {profile?.phone || 'No phone provided'}
              </p>
            </div>
            {/* Address */}
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-gray-800">
                {profile?.address || 'No address provided'}
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
                  New Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
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
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm text-gray-500"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
                />
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Save Changes
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
