import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"; // Import Stripe components
import Header from "./Header";
import Footer from "./Footer";
import "../styles.css";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [shippingOption, setShippingOption] = useState("Post");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const navigate = useNavigate();

  const stripe = useStripe(); // Initialize Stripe
  const elements = useElements(); // Initialize Elements

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const handleQuantityChange = (id, delta) => {
    const updatedCart = cart
      .map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalCost = cart
    .reduce((total, item) => {
      const itemTotal = item.cost * item.quantity;
      return total + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0)
    .toFixed(2);

  const handlePurchase = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Please log in to proceed with the purchase.");
      navigate("/login-signup");
      return;
    }

    try {
      // Request to create a payment intent on the server
      const { data } = await axios.post(
        "http://localhost:5001/create-payment-intent",
        {
          amount: totalCost * 100, // Convert to cents (smallest currency unit)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Confirm the card payment on the client side
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        console.error("Error during payment:", error);
        alert("Payment failed");
      } else if (paymentIntent.status === "succeeded") {
        setCart([]);
        localStorage.removeItem("cart");
        alert("Payment successful! You just purchased through STRIPE PAYMENTS");
        // navigate('/order-confirmation'); // Uncomment to redirect to an order confirmation page
      }
    } catch (error) {
      console.error("Error processing purchase:", error);
    }
  };

  // REAL MONEY TRANSACTION
  // const handlePurchase = async () => {
  //   const token = localStorage.getItem("authToken");

  //   if (!token) {
  //     alert("Please log in to proceed with the purchase.");
  //     navigate("/login-signup");
  //     return;
  //   }

  //   try {
  //     // Request to create a payment intent on the server
  //     const { data } = await axios.post(
  //       "http://localhost:5001/create-payment-intent",
  //       {
  //         amount: totalCost * 100, // Convert to cents (smallest currency unit)
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     // Confirm the card payment on the client side
  //     const { error, paymentIntent } = await stripe.confirmCardPayment(
  //       data.clientSecret,
  //       {
  //         payment_method: {
  //           card: elements.getElement(CardElement),
  //         },
  //       }
  //     );

  //     if (error) {
  //       console.error("Error during payment:", error);
  //       alert("Payment failed");
  //     } else if (paymentIntent.status === "succeeded") {
  //       setCart([]);
  //       localStorage.removeItem("cart");
  //       alert("Payment successful! You just purchased through STRIPE PAYMENTS");
  //       // navigate('/order-confirmation'); // Uncomment to redirect to an order confirmation page
  //     }
  //   } catch (error) {
  //     console.error("Error processing purchase:", error);
  //   }
  // };

  return (
    <div className="container">
      <div className="checkoutcontainer">
        <Header
          cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
          isAuthPage={false}
          handleSearchChange={() => {}}
        />

        <h2>Checkout</h2>

        {cart.length > 0 ? (
          <div className="checkout-container">
            <div className="checkoutcart-items">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>${item.cost}</td>
                      <td>
                        <button
                          onClick={() => handleQuantityChange(item._id, -1)}
                        >
                          -
                        </button>
                        {item.quantity}
                        <button
                          onClick={() => handleQuantityChange(item._id, 1)}
                        >
                          +
                        </button>
                      </td>
                      <td>${(item.cost * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="checkout-summary">
              <h3>Total</h3>
              <table className="summary-table">
                <tbody>
                  <tr>
                    <td>Total:</td>
                    <td>${totalCost}</td>
                  </tr>
                  <tr>
                    <td>Shipping:</td>
                    <td>
                      <div className="checkboxpadding">
                        <label>
                          <input
                            type="radio"
                            value="Pick Up"
                            checked={shippingOption === "Pick Up"}
                            onChange={() => setShippingOption("Pick Up")}
                          />
                          Pick Up
                        </label>
                      </div>
                      <div className="checkboxpadding">
                        <label>
                          <input
                            type="radio"
                            value="Post"
                            checked={shippingOption === "Post"}
                            onChange={() => setShippingOption("Post")}
                          />
                          Post
                        </label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h4>Payment Options:</h4>
              <div className="payment-options">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                {/* Stripe Card Element for Credit Card Payment */}
                {paymentMethod === "Credit Card" && <CardElement />}
              </div>

              <button
                className="proceed-to-checkout"
                onClick={handlePurchase}
                disabled={!stripe || !elements} // Disable button if Stripe isn't ready
              >
                Proceed To Purchase
              </button>
            </div>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Checkout;
