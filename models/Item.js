const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new mongoose.Schema({
  imageUrl: [String], // Store multiple image URLs as an array of strings
  name: String,
  title: String,
  description: String,
  location: String,
  cost: Number,
  shipping: Number,
  date: String,
  userId: { type: Schema.Types.ObjectId, ref: "Signup", required: true }, // Reference to the user who created the item
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }] // Array of comments
});

// Check if the model already exists before defining it
module.exports = mongoose.models.Item || mongoose.model("Item", itemSchema);
