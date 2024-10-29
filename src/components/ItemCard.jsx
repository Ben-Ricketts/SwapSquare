import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ item, handleAddToCart }) => {
  const [quantity, setQuantity] = useState(0); // State to manage the quantity of the item to add to the cart
  const navigate = useNavigate();

  // Handle changes to the quantity input
  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  // Function to handle adding the item to the cart
  const addToCart = () => {
    if (quantity > 0) {
      handleAddToCart(item, quantity);
    } else {
      alert("Please select a quantity greater than zero.");
    }
  };

  // Function to handle buying the item immediately
  const buyItem = () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
      const expiry = tokenPayload.exp * 1000;

      if (Date.now() >= expiry) {
        localStorage.removeItem('authToken');
        alert("Your session has expired. Please log in again.");
        navigate('/login-signup'); // Redirect to login page if the session has expired
      } else {
        navigate('/checkout'); // Redirect to checkout if the session is still valid
      }
    } else {
      navigate('/login-signup'); // Redirect to login page if the user is not logged in
    }
  };

  // Function to navigate to the item details page
  const viewItem = () => {
    navigate(`/view-item/${item._id}`);
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card h-100">
        <a href="" onClick={viewItem} className="image-link">
          {/* Display the item's image or a placeholder if no image is available */}
          {item.imageUrl && item.imageUrl.length > 0 ? (
            <img
              src={`http://localhost:5001/${item.imageUrl[0]}`}
              className="card-img-top"
              alt={item.name}
              style={{ objectFit: 'cover', height: '200px', width: '100%' }}
            />
          ) : (
            <div className="placeholder-image">
              <p>No Image Available</p>
            </div>
          )}
        </a>
        <div className="card-body d-flex flex-column">
          {/* Display the seller's name if available */}
          {item.userId && (
            <h6 className="seller-name">Seller: {item.userId.name}</h6>
          )}
          <h5 className="card-title">{item.name}</h5>
          <p className="card-text">{item.description}</p>
          <div className="mt-auto">
            {/* Quantity input field */}
            <input 
              type="number" 
              value={quantity} 
              onChange={handleQuantityChange} 
              min={0}
            />
            {/* Button to add the item to the cart */}
            <button onClick={addToCart}>Add To Cart</button>
            {/* Button to buy the item immediately */}
            <button onClick={buyItem}>Buy Now</button>        
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes to validate the props passed to ItemCard
ItemCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired, // _id should be a string and is required
    name: PropTypes.string.isRequired, // name should be a string and is required
    description: PropTypes.string, // description should be a string
    imageUrl: PropTypes.arrayOf(PropTypes.string), // imageUrl should be an array of strings
    userId: PropTypes.shape({
      name: PropTypes.string, // userId.name should be a string
    }),
  }).isRequired, // item prop should be an object with the specified shape and is required
  handleAddToCart: PropTypes.func.isRequired, // handleAddToCart should be a function and is required
  handleBuyNow: PropTypes.func.isRequired, // handleBuyNow should be a function and is required
};

export default ItemCard;
