# SwapSquare
Welcome to Swap Square - a community-driven marketplace where users can buy, sell, and swap items with ease. Whether you're looking to declutter your space or find something unique, Swap Square provides a platform for seamless transactions between users. The project is built using MERN stack (MongoDB, Express.js, React.js, Node.js), ensuring a scalable solution for all your marketplace needs.

# Features
- **User Authentication**: Secure login and registration using JWT.
- **Create Listings**: Easily list items for sale or swap, complete with images and descriptions.
- **Browse Listings**: Explore a wide range of items posted by other users.
- **User Dashboard**: Manage your listings, view purchase history, and track transactions.
- **Responsive Design**: Optimized for both desktop and mobile devices.

# Installation
To run Swap Square locally, you'll need to have Node.js installed on your machine. Follow these steps to get started:

# Clone the Repository
git clone https://github.com/yourusername/SwapSquare.git
cd swapsquare

# Install Dependencies
Navigate to the root directory and install the necessary dependencies for both the server and client:
Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Set Up Environment Variables
Create a .env file in the server directory and add the following variables:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Run the Application
Once everything is set up, you can run the development server:
# Run the server
cd server
npm run dev

# Run the client
cd ../client
npm start

The application should be running locally on http://localhost:3000 for the client and http://localhost:5000 for the API.

# Contributing
We welcome contributions to Swap Square! If you'd like to contribute, please fork the repository, create a new branch for your feature or bugfix, and submit a pull request. Make sure to follow the project's coding standards and include detailed descriptions in your commits.

# License
This project is licensed under the MIT License. See the LICENSE file for more information.

