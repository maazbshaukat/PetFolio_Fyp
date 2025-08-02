import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments,
  faUser,
  faHeart,
  faBullhorn,
  faQuestionCircle,
  faSignOutAlt,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.jpg';



const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Helper: truncate name if too long
  const truncate = (str, len = 20) =>
    str?.length > len ? str.slice(0, len) + '...' : str;

  const userName = truncate(user?.name || user?.email || 'User');
  const profileImg = user?.profilePic || '/images/profile.png';

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-white shadow-md relative z-50">
      {/* Logo Section */}
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-10 mr-4" />
          {/* <img src="src/assets/images/logo.jpg" alt="Logo" className="h-10 mr-4" /> */}
        </Link>
        <h1 className="text-xl font-bold text-purple-700">
          <Link to="/">PetFolio</Link>
        </h1>
      </div>

      {/* Main Navigation Links */}
      <ul className="flex space-x-8 text-gray-700">
        <li><Link to="/" className="hover:text-purple-700">Home</Link></li>
        <li><Link to="/discover-pets" className="hover:text-purple-700">Discover Pets</Link></li>
        <li><Link to="/post-an-ad" className="hover:text-purple-700">Post an Ad</Link></li>
      </ul>

      {/* Right Side Icons or Auth Buttons */}
      <div className="flex space-x-4 items-center relative">
        {token ? (
          <>
            {/* Messages Icon */}
            <Link to="/chats" className="text-gray-700 hover:text-purple-700">
              <FontAwesomeIcon icon={faComments} className="text-lg" />
            </Link>

            {/* Profile Dropdown */}
            <button
              onClick={toggleDropdown}
              className="text-gray-700 hover:text-purple-700 focus:outline-none"
            >
              <FontAwesomeIcon icon={faUser} className="text-lg" />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-12 bg-white shadow-lg rounded-md w-64 p-4"
              >
                {/* User Profile Display */}
                <div className="flex items-center mb-4">
                <img
                     src={profileImg}
                     onError={(e) => {
                       e.target.onerror = null;
                       e.target.src = '/images/profile.png';
                     }}
                     alt="Profile"
                     className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                  <div>
                    <p className="font-semibold text-gray-800 break-words">{userName}</p>
                  
                  </div>
                </div>

                {/* Profile Links */}
                <Link to="/profile" className="flex items-center text-purple-700 mb-4 hover:underline">
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  View and Edit Profile
                </Link>

                <ul className="space-y-3 text-gray-700">
                  <li>
                    <Link to="/my-ads" className="flex items-center hover:text-purple-700">
                      <FontAwesomeIcon icon={faBullhorn} className="mr-2" />
                      My Ads
                    </Link>
                  </li>
                  <li>
                    <Link to="/favorites" className="flex items-center hover:text-purple-700">
                      <FontAwesomeIcon icon={faHeart} className="mr-2" />
                      Favorites
                    </Link>
                  </li>
                  <li>
                    <Link to="/help" className="flex items-center hover:text-purple-700">
                      <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
                      Help
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-red-600 hover:underline"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-purple-700 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gray-100 text-purple-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-200"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
