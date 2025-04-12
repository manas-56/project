// components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, BarChart2, User } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle'; // Make sure this path is correct

function Navbar({ isLoggedIn, user, toggleProfileMenu, profileMenuOpen, handleLogout }) {
  const location = useLocation();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left Logo & Title */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold">Stock Market</h1> {/* Font size increased here */}
            </Link>
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Watchlist (Only if logged in) */}
            {isLoggedIn && (
              <Link
                to="/watchlist"
                className="btn btn-sm gap-2 transition-colors"
              >
                <BarChart2 className="w-4 h-4" />
                <span className="hidden sm:inline">Watchlist</span>
              </Link>
            )}

            {/* Authenticated User Profile Dropdown */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="btn btn-sm gap-2 btn-primary"
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 shadow-lg rounded-md z-50 bg-base-100 border border-base-300">
                    <p className="px-4 py-2 border-b border-base-300">
                      Hi, {user?.name || 'User'}
                    </p>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-base-200 w-full text-left"
                    >
                      Edit Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-base-200"
                    >
                      <LogOut className="size-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signup" className="btn btn-sm btn-primary">Sign Up</Link>
                <Link to="/login" className="btn btn-sm btn-outline">Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
