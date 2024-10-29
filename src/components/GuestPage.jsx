import { useState, useEffect } from 'react';

import { getItems } from '../services/itemService';
import GuestComponent from './GuestComponent';
import UserComponent from './UserComponent';

const GuestPage = () => {
  const [items, setItems] = useState([]); // All items fetched from the server
  const [filteredItems, setFilteredItems] = useState([]); // Items filtered by search
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);

    if (authToken) {
      const tokenPayload = JSON.parse(atob(authToken.split('.')[1])); // Decode JWT token payload
      const expiry = tokenPayload.exp * 1000; // Convert expiry to milliseconds

      if (Date.now() >= expiry) {
        // If the token has expired, remove it and set logged in state to false
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
      } else {
        // If the token is valid, set logged in state to true
        setIsLoggedIn(true);
      }
    }

    fetchItems(); // Fetch items regardless of login status
  }, []);

  const fetchItems = async () => {
    const response = await getItems();
    const itemsWithQuantity = response.data.map(item => ({
      ...item,
      quantity: item.quantity !== undefined ? item.quantity : 0
    }));
    setItems(itemsWithQuantity);
    setFilteredItems(itemsWithQuantity); // Initially, all items are shown
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter items based on the search term
    if (term) {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items); // Show all items if search term is empty
    }
  };

  const handleAddToCart = (item, quantity = 1) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const existingItemIndex = updatedCart.findIndex(cartItem => cartItem._id === item._id);

      if (existingItemIndex !== -1) {
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        updatedCart.push({ ...item, quantity });
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return (
    <div className="container">
      {isLoggedIn ? (
        <UserComponent
          items={filteredItems}
          cart={cart}
          handleAddToCart={handleAddToCart}
          handleSearchChange={handleSearchChange} // Pass search handler to UserComponent
        />
      ) : (
        <GuestComponent
          items={filteredItems}
          cart={cart}
          handleAddToCart={handleAddToCart}
          handleSearchChange={handleSearchChange} // Pass search handler to GuestComponent
        />
      )}
    </div>
  );
};

export default GuestPage;
