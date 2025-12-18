import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import nav_logo from '../Components/Assets/ss_icon.jpg';
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
      isActive ? 'text-brand-accent' : 'text-brand-secondary hover:text-brand-accent'
    }`;

  return (
    <nav className="w-full bg-brand-surface/90 backdrop-blur border-b border-brand-muted">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">


          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src={nav_logo} alt="Logo" className="h-10 w-10 object-cover rounded" />
            <span className="text-lg font-bold tracking-wide text-brand-primary font-display">SNEAKER STORE</span>
          </div>


          <ul className="flex items-center gap-4">

            {/* Admin Links */}
            {isAuthenticated && isAdmin && (
              <>
                <li>
                  <NavLink to="/admin" className={linkClass}>Admin</NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-accent rounded hover:bg-brand-accent-dark transition"
                  >Logout
                  </button>
                </li>
              </>
            )}

            {/* Customer / Guest Links */}
            {!isAdmin && (
              <>
                <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
                <li><NavLink to="/sneakers" className={linkClass}>Sneakers</NavLink></li>

                {isAuthenticated ? (
                  // Authenticated Customer Links
                  <>
                    <li><NavLink to="/profile" className={linkClass}>Profile</NavLink></li>
                    <li><NavLink to="/orders" className={linkClass}>Orders</NavLink></li>
                    <li><NavLink to="/cart" className={linkClass}>Cart</NavLink></li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-accent rounded hover:bg-brand-accent-dark transition"
                      >Logout
                      </button>
                    </li>
                  </>
                ) : (
                  // Guest Links
                  <>
                    <li><NavLink to="/cart" className={linkClass}>Cart</NavLink></li>
                    <li><NavLink to="/login" className={linkClass}>Login</NavLink></li>
                  </>
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
