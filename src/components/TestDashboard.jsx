import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserItems } from '../services/itemService';
import ItemCardDashboard from './ItemCardDashboard';
import HeaderDashboard from './HeaderDashboard';
import Footer from './Footer';
import '../styles.css';

// Function to calculate the total number of items in the cart
const calculateCartCount = (cart) => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};

const TestDashboard = () => {
  const [items, setItems] = useState([]);  
  const [user, setUser] = useState({ name: '', email: '' });
 
  const [cart, setCart] = useState(() => {
    // Initialize cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    return savedCart;
  });
  const navigate = useNavigate();

  // Fetch user items, user info, and comments when the component mounts
  useEffect(() => {
    fetchUserItems();
    fetchUserInfo();   
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Function to fetch items created by the user
  const fetchUserItems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await getUserItems(token);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching user items', error);
    }
  }; 

  // Function to fetch user information
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5001/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser({ name: response.data.name, email: response.data.email });
    } catch (error) {
      console.error('Error fetching user information', error);
    }
  };

  // Function to handle adding an item to the cart
  const handleAddToCart = (item, quantity = 1) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const existingItemIndex = updatedCart.findIndex(cartItem => cartItem._id === item._id);

      if (existingItemIndex !== -1) {
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        updatedCart.push({ ...item, quantity });
      }

      return updatedCart;
    });
  };

  // Function to navigate to the Create Listing page
  const handleCreateListing = () => {
    navigate('/create-listing');
  };

  // Function to handle item deletion
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
      setItems(items.filter(item => item._id !== id));
    }
  };

  return (
    <div className="container">
      <HeaderDashboard cartCount={calculateCartCount(cart)} />
      <h3>Welcome {user.name}</h3>
      <div className="dashboard-container">

        <section className="account-details">
          <div className="account-header">
            <h2>Account Details</h2>
            <button className="edit-account">Edit Account</button>
          </div>
          <div className="account-info">
            <div className="info-row">
              <span>Account Number:</span><span>59786554</span>
            </div>
            <div className="info-row">
              <span>Name:</span><span>{user.name}</span>
            </div>
            <div className="info-row">
              <span>Email:</span><span>{user.email}</span>
            </div>
            <div className="info-row">
              <span>Location:</span><span>Auckland, New Zealand</span>
            </div>
            <div className="info-row">
              <span>Authenticated:</span><span>Yes</span>
            </div>
          </div>
        </section>

        <section className="user-listings">
          <h2>Your Listings</h2>
          <button className="create-listing" onClick={handleCreateListing}>Create Listing</button>
        </section>

        <div className="row">
          {items.map((item) => (
            <ItemCardDashboard
              key={item._id}
              item={item}
              onDelete={handleDelete}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default TestDashboard;
