import PropTypes from 'prop-types';
import { deleteItem } from '../services/itemService';

const ItemsList = ({ setEditingItem, items, fetchItems }) => {

  // Function to handle the deletion of an item
  const handleDelete = async (id) => {
    await deleteItem(id);
    fetchItems();  // Re-fetch items after deletion to update the list
  };

  return (
    <div>
      <h2>Items List</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - {item.description}
            {/* Button to set the current item for editing */}
            <button onClick={() => setEditingItem(item)}>Edit</button>
            {/* Button to delete the current item */}
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// PropTypes to validate the props passed to ItemsList
ItemsList.propTypes = {
  setEditingItem: PropTypes.func.isRequired, // setEditingItem should be a function and is required
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired, // _id should be a string and is required
    name: PropTypes.string.isRequired, // name should be a string and is required
    description: PropTypes.string, // description should be a string
  })).isRequired, // items should be an array of objects with the specified shape and is required
  fetchItems: PropTypes.func.isRequired, // fetchItems should be a function and is required
};

export default ItemsList;
