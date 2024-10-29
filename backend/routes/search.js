const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // Import the Item model

// Route to handle search requests
router.get('/', async (req, res) => {
  try {
    const query = req.query.q;

    // Search for items that match the query in name, title, or description
    const items = await Item.find({
      $or: [
        { name: new RegExp(query, 'i') }, // Case-insensitive regex search in the name field
        { title: new RegExp(query, 'i') }, // Case-insensitive regex search in the title field
        { description: new RegExp(query, 'i') } // Case-insensitive regex search in the description field
      ]
    }).limit(10); // Limit the number of search results

    res.json(items); // Send the matching items as a JSON response
  } catch (err) {
    console.error('Error searching for items:', err);
    res.status(500).json({ message: 'Error searching for items' });
  }
});

module.exports = router;
