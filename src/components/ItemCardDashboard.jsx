import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ItemCardDashboard = ({ item, onDelete }) => {
  const navigate = useNavigate();

  // Function to navigate to the item view page
  const viewItem = () => {
    navigate(`/view-item/${item._id}`);
  };

  // Function to navigate to the item update page
  const updateItem = () => {
    navigate(`/update-item/${item._id}`);
  };

  // Function to delete the item
  const deleteItem = async () => {
    try {
      const token = localStorage.getItem('authToken');  // Get the JWT token from localStorage
      await axios.delete(`http://localhost:5001/items/${item._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Include the Authorization header
        },
      });
      onDelete(item._id); // Call the onDelete prop to update the UI after deletion
    } catch (error) {
      console.error('Error deleting item:', error);
      window.alert('Failed to delete the item. Please try again.');
    }
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
    <div className="card h-100">      
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
      <div className="card-body d-flex flex-column">
        {/* Display the seller's name if available */}
        {item.userId && (
          <h6 className="seller-name">Seller: {item.userId.name}</h6>
        )}
        <h5 className="card-title">{item.name}</h5>
        <p className="card-text">{item.description}</p>
        <div className="mt-auto">
            {/* Button to view the item details */}
            <button onClick={viewItem} className="">View</button>
            {/* Button to update the item details */}
            <button onClick={updateItem} className="">Update</button>
            {/* Button to delete the item */}
            <button onClick={deleteItem} className="deletebutton">
              <i className="fas fa-trash"></i>
            </button>
          </div>
      </div>
    </div>
  </div>
  );
};

// PropTypes to validate the props passed to ItemCardDashboard
ItemCardDashboard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired, // _id should be a string and is required
    name: PropTypes.string.isRequired, // name should be a string and is required
    description: PropTypes.string, // description should be a string
    imageUrl: PropTypes.arrayOf(PropTypes.string), // imageUrl should be an array of strings
    userId: PropTypes.shape({
      name: PropTypes.string, // userId.name should be a string
    }),
  }).isRequired, // item prop should be an object with the specified shape and is required
  onDelete: PropTypes.func.isRequired, // onDelete should be a function and is required
};

export default ItemCardDashboard;
