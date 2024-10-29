const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const jwt = require("jsonwebtoken");
const Signup = require("../models/signup");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    console.log("JWT_SECRET being used:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT payload:", decoded);

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

router.get("/getAllComments", async (req, res) => {
  try {
    const comments = await Comment.find().populate("userId", "email");
    res.status(200).send(comments);
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).send({
      message: "An error occurred while fetching comments",
      error: error.message,
    });
  }
});

router.post("/items/:itemId/comments", authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { comment } = req.body;

    const newComment = new Comment({
      comment,
      userId: req.user._id,
      email: req.user.email,
    });

    // Save the comment
    await newComment.save();

    // Find the item and push the new comment into the comments array
    const item = await Item.findById(itemId);
    item.comments.push(newComment._id);
    await item.save();

    res.status(201).send({
      message: "Comment successfully posted",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error posting comment:", error.message);
    res.status(500).send("An error occurred");
  }
});




router.get("/items/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId)
      .populate("userId", "name email")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "name email" } // Populate user details in comments
      });

    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Error fetching item", error });
  }
});


module.exports = router;
