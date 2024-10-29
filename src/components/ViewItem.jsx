import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const ViewItem = () => {
  const { id } = useParams(); // Get the item ID from the URL
  const [itemData, setItemData] = useState(null); // State to store item data
  const [comments, setComments] = useState([]); // State to store comments
  const [newComment, setNewComment] = useState(''); // State to store new comment input
  const [cart, setCart] = useState(() => {
    // Initialize cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    return savedCart;
  });
  const navigate = useNavigate();

  // Fetch the item data and comments when the component mounts
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/items/${id}`);
        setItemData(response.data);
        setComments(response.data.comments || []); // Load existing comments
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    fetchItem();
  }, [id]);

  // Handle adding the item to the cart
  const handleAddToCart = () => {
    const updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex(cartItem => cartItem._id === itemData._id);

    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart.push({ ...itemData, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Fetch comments method to refresh comments list
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/items/${id}`);
      setComments(response.data.comments || []); // Set fetched comments to state
    } catch (error) {
      console.error('Error fetching comments', error);
    }
  };

  // Handle submitting a new comment
  const handleCommentSubmit = async () => {
    if (newComment.trim() === '') return; // Prevent empty comments

    const token = localStorage.getItem('authToken');
    
    if (!token) {
      alert('Please log in to post a comment.');
      navigate('/login-signup'); // Redirect to login page
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/items/${id}/comments`,
        { comment: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data.comment]); // Add new comment to the list
      setNewComment(''); // Clear the input field
      fetchComments(); // Refresh comments after posting
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  // Calculate the total number of items in the cart
  const calculateCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Handle the "Buy Now" action
  const buyItem = () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
      const expiry = tokenPayload.exp * 1000;
      if (Date.now() >= expiry) {
        localStorage.removeItem('authToken');
        alert("Your session has expired. Please log in again.");
        navigate('/login-signup');
      } else {
        navigate('/checkout');
      }
    } else {
      navigate('/login-signup');
    }
  };

  if (!itemData) {
    return <p>Loading item data...</p>;
  }

  return (
    <div className="container">
      <Header cartCount={calculateCartCount()} isAuthPage={false} handleSearchChange={() => {}}/>
      <div className="dashboard-container">
        <main className="dashboard-content">
          <section className="view-item-section">
            <div className="item-header">
              <div className="item-images">
                {/* Main image display */}
                <img 
                  src={`http://localhost:5001/${itemData.imageUrl[0]}`} 
                  alt="Main Item" 
                  className="main-image"
                />
                <div className="thumbnail-gallery">
                  {/* Thumbnail images */}
                  {itemData.imageUrl.map((image, index) => (
                    <img 
                      key={index} 
                      src={`http://localhost:5001/${image}`} 
                      alt={`Thumbnail ${index}`} 
                      className="thumbnail"
                    />
                  ))}
                </div>
              </div>
              <div className="item-info">
                <h2>{itemData.title}</h2>
                <p className="item-price">${itemData.cost}</p>
                <div className="item-buttons">
                  {/* Buy Now and Add To Cart buttons */}
                  <button className="buy-now-button" onClick={buyItem}>Buy Now</button>
                  <button className="add-to-cart-button" onClick={handleAddToCart}>Add To Cart</button>
                </div>
                <div className="seller-info">
                  <h4>Seller Info:</h4>
                  <p>Name: {itemData.userId.name}</p>
                  <p>Location: {itemData.location}</p>
                  <p>Shipping: {itemData.shipping}</p>
                </div>
              </div>
            </div>
            <div className="item-description">
              <h3>Description:</h3>
              <p>{itemData.description}</p>
              <h3>Comments:</h3>
              <div className="comments-list">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="comment">
                      <p><strong>{comment.userId.name}</strong>: {comment.comment}</p>
                    </div>
                  ))
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}
              </div>
              <div className="comment-section">
                <textarea 
                  placeholder="Leave a comment..." 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button 
                  className="ask-question-button" 
                  onClick={handleCommentSubmit}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ViewItem;
