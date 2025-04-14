{
  /* Added hover effect here */
}
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CiHeart } from 'react-icons/ci'; // Updated icon import
import { useNavigate } from 'react-router-dom';
import Searchbar from '../Searchbar';
import { useDispatch } from 'react-redux';
import { closeSearchPage } from '../../store/slice/searchSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/'); // Redirect to login after logout
  };

  return (
    <nav className="bg-black text-white">
      <div className="container mx-auto grid grid-cols-3 items-center justify-between py-4 px-6 shadow-md shadow-white">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="./images/Mandip ko fanatics.png"
            alt="Fanatic Books Logo"
            className="h-10 w-10 mr-2"
          />
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-8 justify-between items-center w-full">
          <li>
            <NavLink
              onClick={() => dispatch(closeSearchPage())}
              className={({ isActive }) =>
                isActive ? 'text-purple-500' : 'hover:text-purple-600'
              }
              to="/"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => dispatch(closeSearchPage())}
              className={({ isActive }) =>
                isActive ? 'text-purple-500' : 'hover:text-purple-600'
              }
              to="/shop"
            >
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => dispatch(closeSearchPage())}
              className={({ isActive }) =>
                isActive ? 'text-purple-500' : 'hover:text-purple-600'
              }
              to="/about"
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => dispatch(closeSearchPage())}
              className={({ isActive }) =>
                isActive ? 'text-purple-500' : 'hover:text-purple-600'
              }
              to="/cart"
            >
              Cart
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => dispatch(closeSearchPage())}
              className={({ isActive }) =>
                isActive ? 'text-purple-500' : 'hover:text-purple-600'
              }
              to="/contact"
            >
              Feedback
            </NavLink>
          </li>
        </ul>

        {/* User Actions (Login/Logout) */}
        <div className="flex gap-5 items-center justify-end">
          <div>
            <Searchbar />
          </div>
          <Link to="/wishlist" className="hover:text-purple-600">
            {' '}
            {/* Updated link path */}
            <CiHeart size={23} />
          </Link>

          {token ? (
            <button
              onClick={handleLogout}
              className="hover:text-purple-600 text-white"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-purple-600">
                Login
              </Link>
              <Link to="/register" className="hover:text-purple-600">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
