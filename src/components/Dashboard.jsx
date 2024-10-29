import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems } from '../services/itemService';
import ItemCard from './ItemCard';
import HeaderDashboard from './HeaderDashboard';
import Footer from './Footer';
import Carousel from './Carousel';
import '../styles.css'; // Import the CSS file

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login-signup');
    }
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await getItems();
    setItems(response.data);
  };

  return (
    <div className="container">
      <HeaderDashboard />
      <h1>User Dashboard</h1>
      <h4>Browse</h4>
      <Carousel />
      <h2>Closing Soon...</h2>
      <div className="items">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} userType="guest" />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
