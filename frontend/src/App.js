import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyOtp from './pages/VerifyOtp';
import Profile from './pages/Profile';
import { useThemeStore } from "./store/useThemeStore";
import HomePage from './pages/HomePage';
import Watchlist from './pages/Watchlist';
import MainLayout from './components/MainLayout';
import SettingsPage from "./pages/SettingsPage";
import DarkModeToggle from './components/DarkModeToggle';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  
  // Get theme from store
  const { theme } = useThemeStore();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    // Check if storedUser exists before parsing
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    
    setIsLoggedIn(!!token);
    setUser(parsedUser);
  }, []);

  useEffect(() => {
    setProfileMenuOpen(false);
  }, [location.pathname]);

  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setProfileMenuOpen(false);
  };

  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  // Force theme to retro for debugging
  const currentTheme = "coffee";

  return (
    <div data-theme={currentTheme} className="min-h-screen flex flex-col">
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        toggleProfileMenu={toggleProfileMenu}
        profileMenuOpen={profileMenuOpen}
        handleLogout={handleLogout}
      />
      <DarkModeToggle />
      <div className="flex-grow pt-5 pb-1 px-1 container mx-auto">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/watchlist" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Watchlist />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              isLoggedIn ? (
                <MainLayout>
                  <HomePage />
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      
      {/* Theme test elements to verify theme is working
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-xl font-bold mb-2">Theme Test Section</h3>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-accent">Accent Button</button>
          <button className="btn btn-info">Info Button</button>
          <button className="btn btn-success">Success Button</button>
          <button className="btn btn-warning">Warning Button</button>
          <button className="btn btn-error">Error Button</button>
        </div>
        
        <div className="card w-full md:w-96 bg-base-100 shadow-xl mt-4">
          <div className="card-body">
            <h2 className="card-title">Retro Theme Card</h2>
            <p>This card should display with the retro theme styling if DaisyUI is working correctly.</p>
          </div>
        </div> */}
      {/* </div>// */}
    </div>
  );
}

export default App;