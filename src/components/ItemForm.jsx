import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { addItem, updateItem } from '../services/itemService';

const ItemForm = ({ editingItem, setEditingItem, fetchItems }) => {
  const [name, setName] = useState(''); // State to manage the item name input
  const [description, setDescription] = useState(''); // State to manage the item description input

  // useEffect to populate the form fields if editing an existing item
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDescription(editingItem.description);
    }
  }, [editingItem]);

  // Handle form submission for adding or updating an item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      // Update the existing item
      await updateItem(editingItem._id, { name, description });
      setEditingItem(null); // Clear the editing state after update
    } else {
      // Add a new item
      await addItem({ name, description });
    }
    // Reset form fields after submission
    setName('');
    setDescription('');
    fetchItems(); // Re-fetch items after add or update
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required // Add required attribute for form validation
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required // Add required attribute for form validation
        />
      </div>
      <button type="submit">{editingItem ? 'Update' : 'Add'} Item</button>
    </form>
  );
};

// PropTypes to validate the props passed to ItemForm
ItemForm.propTypes = {
  editingItem: PropTypes.shape({
    _id: PropTypes.string, // _id should be a string
    name: PropTypes.string, // name should be a string
    description: PropTypes.string, // description should be a string
  }),
  setEditingItem: PropTypes.func.isRequired, // setEditingItem should be a function and is required
  fetchItems: PropTypes.func.isRequired, // fetchItems should be a function and is required
};

export default ItemForm;
