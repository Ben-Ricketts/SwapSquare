import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwapLogo from '../assets/SwapLogo.png';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const Header = ({ cartCount, isAuthPage, handleSearchChange }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
        const expiry = tokenPayload.exp * 1000;
        if (Date.now() < expiry) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('authToken');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Failed to parse token:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);

  const goToCheckout = () => {
    navigate('/checkout');
  };

  const goToDashboard = () => {
    navigate('/testdashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
  };

  // Handle search input changes
  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    handleSearchChange(e); // Pass the search term back to the parent component

    if (query.length > 2) { // Start searching when the query is at least 3 characters
      try {
        const response = await axios.get(`http://localhost:5001/search`, {
          params: { q: query }
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <header>
      <div className="navbar-left">
        <img
          src={SwapLogo}
          alt="SwapSquare Logo"
          className="logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <div className="navbar-center" style={{ position: 'relative' }}>
        {/* Search bar with icon */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <input
            type="search"
            placeholder="Search item..."
            value={searchTerm}
            onChange={handleInputChange}
            className="search-bar"
            style={{ paddingRight: '30px' }} // Ensure space for the icon
          />
          <FaSearch
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Autocomplete suggestions */}
        {suggestions.length > 0 && (
          <ul style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            backgroundColor: 'white',
            color: 'blue',
            border: '1px solid #ccc',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            zIndex: 1000
          }}>
            {suggestions.map((item) => (
              <li
                key={item._id}
                onClick={() => {
                  navigate(`/item/${item._id}`);
                  setSearchTerm('');
                  setSuggestions([]);
                }}
                style={{ padding: '8px', cursor: 'pointer' }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="navbar-right">
        {!isAuthPage && (
          <>
            <div className="checkout" onClick={goToCheckout} style={{ cursor: 'pointer' }}>
              &#x1F6D2;
            </div>
            <span className="cart-count">{cartCount}</span>
            <div className="dropdown">
              <select>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="mi">Maori</option>
              </select>
            </div>
          </>
        )}
        {isLoggedIn ? (
          <>
            <button onClick={goToDashboard}>Dashboard</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          !isAuthPage && <button onClick={() => navigate('/login-signup')}>Login/Signup</button>
        )}
      </div>
    </header>
  );
};

// Define PropTypes to validate the props passed to the Header component
Header.propTypes = {
  cartCount: PropTypes.number.isRequired,
  isAuthPage: PropTypes.bool.isRequired,
  handleSearchChange: PropTypes.func.isRequired, // Added handleSearchChange to PropTypes
};

export default Header;
