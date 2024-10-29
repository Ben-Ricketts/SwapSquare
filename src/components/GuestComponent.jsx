import PropTypes from 'prop-types';
import ItemCard from './ItemCard';
import Carousel from './Carousel';
import Header from './Header';
import Footer from './Footer';

// Function to calculate the total number of items in the cart
const calculateCartCount = (cart) => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};

const GuestComponent = ({ items, cart, handleAddToCart, handleSearchChange }) => {
  const handleBuyNow = (item) => {
    console.log("Item purchased:", item);
  };

  return (
    <div className="guest-container">
      {/* Header with the cart item count */}
      <Header cartCount={calculateCartCount(cart)}  isAuthPage={false} handleSearchChange={handleSearchChange}/>
      
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
            handleBuyNow={handleBuyNow} // Pass handleBuyNow to ItemCard
          />
        ))}
      </div>
      
      <Footer />
    </div>
  );
};

// PropTypes to validate the props passed to GuestComponent
GuestComponent.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired, 
    name: PropTypes.string.isRequired,
    cost: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired
  })).isRequired, // 'items' should be an array of objects
  cart: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired
  })).isRequired, // 'cart' should be an array of objects
  handleAddToCart: PropTypes.func.isRequired, // 'handleAddToCart' should be a function
  handleSearchChange: PropTypes.func.isRequired // PropType validation for handleSearchChange
};

export default GuestComponent;
