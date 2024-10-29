const express = require("express");
const router = express.Router();
const multer = require('multer'); // Import multer for file handling
const path = require('path');
const jwt = require("jsonwebtoken"); // Import JWT for authentication
const Item = require("../models/Item");
const Signup = require("../models/signup"); // Import the Signup model
const Comment = require("../models/comment"); 

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads')); // Save images to the uploads folder
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Save with unique names
  }
});

const upload = multer({ storage: storage });

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    console.log("No Authorization header provided");
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    console.log("JWT_SECRET being used:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT payload in item routes:", decoded);

    // Select both name and email
    const user = await Signup.findById(decoded.userId).select("name email");
    if (!user) {
      console.log("User not found for decoded userId:", decoded.userId);
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

// POST route to create a new item with image upload
router.post("/", authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    // Get paths of uploaded images
    const imageUrls = req.files.map(file => `uploads/${file.filename}`);

    // Create the new item with the uploaded images and form data
    const newItem = new Item({
      ...req.body,
      imageUrl: imageUrls, // Save the array of image URLs to the database
      userId: req.user._id // Attach the user ID of the logged-in user
    });

    // Save the item to the database
    await newItem.save();

    // Send the saved item back in the response
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error saving item:', error); // Log the error for more details
    res.status(500).json({ message: 'Error creating item', error });
  }
});

router.post("/:itemId/comments", authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { comment } = req.body;

    console.log("Received comment:", comment);
    console.log("User ID:", req.user._id);

    const newComment = new Comment({
      comment,
      userId: req.user._id,
      email: req.user.email,
    });

    // Save the comment
    await newComment.save();
    console.log("Comment saved:", newComment);

    // Find the item and push the new comment into the comments array
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).send({ message: "Item not found" });
    }else{
      console.log("Item found:", item);
    }
    

    item.comments.push(newComment._id);
    await item.save();
    console.log("Item updated with new comment.");

    res.status(201).send({
      message: "Comment successfully posted",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error posting comment:", error.message);
    res.status(500).send("An error occurred");
  }
});


// PUT route to update an item with image upload
router.put("/:id", authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
      const itemId = req.params.id;

      // Log the incoming files and form data for debugging
      console.log('Request Body:', req.body);
      console.log('Request Files:', req.files);

      // Handle existing images: Remove ones that are not needed
      let existingImages = req.body.existingImages || [];
      if (!Array.isArray(existingImages)) {
          existingImages = [existingImages];
      }

      // Get paths of new uploaded images
      const newImageUrls = req.files.map(file => `uploads/${file.filename}`);

      // Combine existing and new images if needed
      const allImages = [...existingImages, ...newImageUrls];

      // Remove duplicates (optional, if your app allows replacing images)
      const uniqueImages = [...new Set(allImages)];

      console.log('Final Images:', uniqueImages); // Log the final image paths

      const updatedItem = await Item.findByIdAndUpdate(itemId, {
          ...req.body,
          imageUrl: uniqueImages,
          userId: req.user._id // Ensure the updated item has the correct user ID
      }, { new: true });

      res.status(200).json(updatedItem);
  } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ message: 'Error updating item', error });
  }
});

router.get("/my-items", authMiddleware, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user._id }).populate("userId", "name email");
    res.json(items);
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({ message: 'Error fetching user items', error });
  }
});

// GET route to fetch a single item by ID, including user details
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("userId", "name email")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "name" } // Populate user details in comments
      });

    if (!item) {
      return res.status(404).send({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Error fetching item", error });
  }
});

// GET route to fetch all items, including user details
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().populate("userId", "name email"); // Populate user details
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items', error });
  }
});




// DELETE route to delete an item by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Error deleting item', error });
  }
});

module.exports = router;
