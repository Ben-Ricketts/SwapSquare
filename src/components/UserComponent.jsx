import PropTypes from 'prop-types';
import ItemCard from './ItemCard';
import Carousel from './Carousel';
import Header from './Header';
import Footer from './Footer';

// Function to calculate the total number of items in the cart
const calculateCartCount = (cart) => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};

const UserComponent = ({ items, cart, handleAddToCart, handleSearchChange }) => {
  // Function to handle the "Buy Now" action
  const handleBuyNow = (item) => {
    console.log("Item purchased:", item);
  };

  return (
    <div className="user-container">
      {/* Header component with the cart item count */}
      <Header cartCount={calculateCartCount(cart)} isAuthPage={false} handleSearchChange={handleSearchChange}/>
      
      <h3>Browse</h3>
      {/* Carousel component to browse categories */}
      <Carousel />
      
      <h3>Closing Soon...</h3>
      {/* Display a list of items that are closing soon */}
      <div className="row">
        {items.map((item) => (
          <ItemCard 
            key={item._id} 
            item={item} 
            handleAddToCart={handleAddToCart} 
            handleBuyNow={handleBuyNow} 
          />
        ))}
      </div>
      
      <Footer />
    </div>
  );
};

// PropTypes to validate the props passed to UserComponent
UserComponent.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired, // _id should be a string and is required
    name: PropTypes.string.isRequired, // name should be a string and is required
    description: PropTypes.string, // description should be a string
    imageUrl: PropTypes.arrayOf(PropTypes.string), // imageUrl should be an array of strings
    userId: PropTypes.shape({
      name: PropTypes.string, // userId.name should be a string
    }),
  })).isRequired, // items should be an array of objects with the specified shape and is required
  cart: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired
  })).isRequired, // cart should be an array of objects with _id and quantity fields and is required
  handleAddToCart: PropTypes.func.isRequired, // handleAddToCart should be a function and is required
  handleSearchChange: PropTypes.func.isRequired // PropType validation for handleSearchChange
};

export default UserComponent;
