const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const itemRoutes = require("./routes/itemRoutes");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoute");
const checkout = require("./routes/checkout");
const searchRoute = require("./routes/search");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const Stripe = require("stripe"); // Ensure you have required Stripe

dotenv.config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// secrete key

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Pass upload middleware to itemRoutes
app.use("/items", itemRoutes); // Now itemRoutes can handle image upload
app.use("/auth", authRoutes); // Use the auth routes
app.use("/comments", commentRoutes);
app.use("/checkout", checkout);
app.use("/search", searchRoute);

app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount should be in the smallest currency unit
      currency: "usd", // Replace with your currency
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
