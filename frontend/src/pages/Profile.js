import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const stockCategories = [
  { id: 'tech', name: 'Technology' },
  { id: 'finance', name: 'Financial Services' },
  { id: 'health', name: 'Healthcare' },
  { id: 'consumer', name: 'Consumer Goods' },
  { id: 'energy', name: 'Energy' },
  { id: 'industrial', name: 'Industrial' },
  { id: 'materials', name: 'Materials' },
  { id: 'utilities', name: 'Utilities' },
  { id: 'realestate', name: 'Real Estate' },
];

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    preferences: { stockCategories: [] }
  });
  const [name, setName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast.error('You are not logged in');
          navigate('/login');
          setIsLoadingData(false);
          return;
        }
        
        const response = await fetch(`${API_URL}/api/user/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Your session has expired. Please log in again.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch profile data');
        }
        
        const data = await response.json();
        const userData = data.user;
        
        setUser(userData);
        setName(userData.name || '');
        
        // Set preferences from user data
        if (userData.preferences && userData.preferences.stockCategories) {
          setSelectedCategories(userData.preferences.stockCategories);
        }
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
        
        // Fallback to localStorage if API fails
        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        setUser(storedUser);
        setName(storedUser.name || '');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleCategoryToggle = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('You are not logged in');
        navigate('/login');
        return;
      }
      
      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        throw new Error('Failed to update profile');
      }
      
      const data = await response.json();
      
      // Update local storage with new user data
      const updatedUser = { ...user, name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('You are not logged in');
        navigate('/login');
        return;
      }
      
      const response = await fetch(`${API_URL}/api/user/preferences`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stockCategories: selectedCategories
        })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        throw new Error('Failed to update preferences');
      }
      
      await response.json();
      
      // Update the user state with new preferences
      setUser({
        ...user,
        preferences: {
          ...user.preferences,
          stockCategories: selectedCategories,
          lastUpdated: new Date()
        }
      });
      
      toast.success('Preferences updated successfully!');
    } catch (error) {
      console.error('Failed to update preferences:', error);
      toast.error('Failed to update preferences. Please try again.');
    } finally {
      setIsSavingPreferences(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b dark:border-gray-700">
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'preferences' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Profile</h2>
              
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={user.email || ''}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                />
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                />
              </div>
              
              <button
                onClick={handleUpdateProfile}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          )}
          
          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Stock Preferences</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Select your preferred stock categories to receive personalized recommendations
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {stockCategories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                        />
                        <div className={`w-5 h-5 border-2 rounded ${selectedCategories.includes(category.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-400 dark:border-gray-600'}`}>
                          {selectedCategories.includes(category.id) && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                    </label>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleSavePreferences}
                disabled={isSavingPreferences}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
              >
                {isSavingPreferences ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;