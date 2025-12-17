import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import nav_logo from '../../Components/Assets/ss_icon.jpg';
import AuthService from '../Service/AuthService';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = AuthService.isAuthenticated();
  const isAdmin = AuthService.isAdmin();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      AuthService.logoutUser();
      navigate('/login');
    }
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition ${
      isActive ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
    }`;

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">


          <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
            <img src={nav_logo} alt="Logo" className="h-10 w-10 object-cover rounded"/>
            <span className="text-lg font-bold tracking-wide">SNEAKER STORE</span>
          </div>

          {/* Navigation Links */}
          <ul className="flex items-center gap-4">

            {/* Admin */}
            {isAuthenticated && isAdmin && (
              <>
                <li><NavLink to="/admin" className={linkClass}>Admin</NavLink></li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* Customer / Guest */}
            {(!isAdmin) && (
              <>
                <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
                <li><NavLink to="/sneakers" className={linkClass}>Sneakers</NavLink></li>

                {isAuthenticated ? (
                  // Authenticated Customer Links
                  <>
                    <li><NavLink to="/account/profile" className={linkClass}>Profile</NavLink></li>
                    <li><NavLink to="/account/orders" className={linkClass}>Orders</NavLink></li>
                    <li><NavLink to="/cart" className={linkClass}>Cart</NavLink></li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  // Guest Links
                  <li><NavLink to="/login" className={linkClass}>Login</NavLink></li>
                )}
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
