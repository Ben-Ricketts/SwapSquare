const mongoose = require("mongoose");

// Define the schema for an order
const orderSchema = new mongoose.Schema({
  // Reference to the user who placed the order
  userId: { 
    type: mongoose.Schema.Types.ObjectId, // Stores the ObjectId of the user
    ref: "Signup", // References the Signup model (user collection)
    required: true // This field is required
  },
  // Array of items included in the order
  items: [
    {
      // Reference to the specific item being ordered
      itemId: { 
        type: mongoose.Schema.Types.ObjectId, // Stores the ObjectId of the item
        ref: "Item", // References the Item model (item collection)
        required: true // This field is required
      },
      // Name of the item (for quick reference)
      name: String, 
      // Price of the item at the time of order
      price: Number, 
      // Quantity of the item ordered
      quantity: Number, 
    }
  ],
  // The total cost of the order (sum of item prices * quantities)
  totalCost: { 
    type: Number, 
    required: true // This field is required
  },
  // The selected shipping option (e.g., "Pick Up", "Post")
  shippingOption: { 
    type: String, 
    required: true // This field is required
  },
  // The selected payment method (e.g., "Credit Card", "Bank Transfer")
  paymentMethod: { 
    type: String, 
    required: true // This field is required
  },
  // The date the order was placed, defaults to the current date and time
  orderDate: { 
    type: Date, 
    default: Date.now // Automatically sets to the current date and time
  }
});

// Export the Order model, based on the orderSchema
module.exports = mongoose.model("Order", orderSchema);
