import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwapLogo from '../assets/SwapLogo.png';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa'; // Import the search icon

const HeaderDashboard = ({ cartCount }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Correct key usage
    const authToken = localStorage.getItem('authToken');
    console.log('Auth Token:', authToken); // Debugging line to check the token

    if (authToken) {
      try {
        const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
        console.log('Token Payload:', tokenPayload); // Debugging line to check the token payload
        const expiry = tokenPayload.exp * 1000;
        if (Date.now() < expiry) {
          setIsLoggedIn(true); // User is logged in
          console.log('User is logged in'); // Debugging line to confirm login status
        } else {
          console.log('Token expired, user is logged out'); // Debugging line for expired token
          localStorage.removeItem('authToken'); // Remove expired token
          setIsLoggedIn(false); // User is not logged in
        }
      } catch (error) {
        console.error('Failed to parse token:', error); // Error handling in case of malformed token
        setIsLoggedIn(false);
      }
    } else {
      console.log('No token found, user is not logged in'); // Debugging line for missing token
      setIsLoggedIn(false); // No token found, user is not logged in
    }
  }, [navigate]); // Adding navigate as a dependency to re-run when navigating

  const goToCheckout = () => {
    navigate('/checkout');
  };

  const goToDashboard = () => {
    navigate('/testdashboard');
  };

  const handleLogout = () => {
    console.log('Logging out...'); // Debugging line for logout

    // Clear user data from localStorage
    localStorage.removeItem('authToken'); // Clear the token
    localStorage.clear(); // Clear all localStorage if needed

    setIsLoggedIn(false); // Update state to reflect logged out status
    navigate('/'); // Redirect to the home or guest page
  };

  return (
    <header>
      <div className="navbar-left">
        <img
          src={SwapLogo}
          alt="SwapSquare Logo"
          className="logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }} // Make the logo clickable to go to the landing page
        />
      </div>
      <div className="navbar-center">
        {/* Search bar with icon */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <input
            type="search"
            placeholder="Search item..."
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
      </div>
      <div className="navbar-right">
        <div className="checkout" onClick={goToCheckout} style={{ cursor: 'pointer' }}>
          &#x1F6D2;
        </div> {/* Shopping cart symbol */}
        <span className="cart-count">{cartCount}</span>
        <div className="dropdown">
          <select>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="mi">Maori</option>
          </select>
        </div>

        {isLoggedIn ? (
          <>
          <button onClick={goToDashboard}>Dashboard</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => navigate('/login-signup')}>Login/Signup</button>
        )}
      </div>
    </header>
  );
};

// Define PropTypes to validate the props passed to the Header component
HeaderDashboard.propTypes = {
  cartCount: PropTypes.number.isRequired, // cartCount is required and should be a number 
};

export default HeaderDashboard;
