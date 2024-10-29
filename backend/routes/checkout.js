const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Signup = require("../models/signup"); // Import the Signup model
const Item = require("../models/item"); // Import the Item model
const Order = require("../models/order"); // Import the Order model

// Middleware for authentication
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", ""); // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ error: "No token provided" }); // If no token, return an unauthorized error
  }

  try {
    console.log("JWT_SECRET being used:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the JWT token
    console.log("Decoded JWT payload:", decoded);

    const user = await Signup.findById(decoded.userId).select("name email"); // Find the user by decoded userId
    if (!user) {
      console.log("User not found for decoded userId:", decoded.userId);
      return res.status(401).json({ error: "Invalid token" }); // If user is not found, return an unauthorized error
    }

    req.user = user; // Attach the user object to the request object for use in the next middleware/route
    next(); // Proceed to the next middleware/route
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" }); // If token verification fails, return an unauthorized error
  }
};

// Checkout Route
router.post("/", authMiddleware, async (req, res) => {
  const { items, totalCost, shippingOption, paymentMethod } = req.body; // Destructure the necessary fields from the request body

  try {
    // Validate each item in the cart against the database
    for (let cartItem of items) {
      const dbItem = await Item.findById(cartItem._id); // Find the item in the database using its ID
      if (!dbItem) {
        return res.status(404).json({ success: false, message: `Item not found: ${cartItem.name}` }); // If the item is not found, return a 404 error
      }
      if (dbItem.stock < cartItem.quantity) {
        return res.status(400).json({ success: false, message: `Not enough stock for ${dbItem.name}.` }); // If there is insufficient stock, return a 400 error
      }

      dbItem.stock -= cartItem.quantity; // Deduct the purchased quantity from the item's stock
      await dbItem.save(); // Save the updated item back to the database
    }

    // Create an order
    const newOrder = new Order({
      userId: req.user._id, // Associate the order with the authenticated user
      items: items.map(item => ({
        itemId: item._id, // Reference the item ID
        name: item.name, // Store the item name
        price: item.cost,  // Store the item's cost (price)
        quantity: item.quantity // Store the quantity purchased
      })),
      totalCost, // Store the total cost of the order
      shippingOption, // Store the selected shipping option
      paymentMethod, // Store the selected payment method
      orderDate: new Date(), // Set the order date to the current date
    });

    await newOrder.save(); // Save the new order to the database

    res.status(201).json({ success: true, message: "Order placed successfully!" }); // Return a success message
  } catch (error) {
    console.error("Checkout error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred during checkout." }); // Handle any errors during the checkout process
  }
});

module.exports = router; // Export the router to be used in the main server file
