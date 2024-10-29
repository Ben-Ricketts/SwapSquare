const express = require("express");
const Signup = require("../models/signup");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Sign up route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new Signup({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Generated JWT Token on signup:", token);

    // Return the token in the response
    res.status(201).json({ token, message: "User created and authenticated" });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});


// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Signup.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Generated JWT Token:", token);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

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

// Test dashboard route
router.get("/testdashboard", authMiddleware, (req, res) => {
  console.log(`Hello ${req.user.email}`);
  res.status(200).json({ message: `Hello ${req.user.email}` });
});

// User route to get name and email Created by Zina to get the user name to display
router.get("/user", authMiddleware, (req, res) => {
  try {
    // Return both name and email
    res.status(200).json({ name: req.user.name, email: req.user.email });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user information" });
  }
});

module.exports = router;
