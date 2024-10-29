import { useState } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form"; // Import useForm from React Hook Form
import Header from "./Header";
import Footer from "./Footer";
import "../styles.css"; // Import the CSS file

const LoginSignupPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm(); // Initialize useForm
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup modes
  const navigate = useNavigate();

  // Function to switch between login and signup forms
  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  // Function to handle form submission for login or signup
  const onSubmit = async (data) => {
    const { name, email, password, confirmPassword } = data;

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const endpoint = isLogin ? "http://localhost:5001/auth/login" : "http://localhost:5001/auth/signup";
      const payload = isLogin ? { email, password } : { name, email, password };
      
      const response = await axios.post(endpoint, payload);
      localStorage.setItem("authToken", response.data.token);
      console.log('authToken stored:', localStorage.getItem('authToken'));
      navigate("/testdashboard"); // Navigate to dashboard after login/signup
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="container">
      <Header isAuthPage={true} cartCount={0} handleSearchChange={() => {}}/> {/* Pass the isAuthPage prop to indicate that this is an authentication page */}
      <div className="form-page">
        <div className="form-container">
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Show the name field only if the user is signing up */}
            {!isLogin && (
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  {...register("name", { required: true })} // Register the input with useForm
                />
                {errors.name && <span className="error">Name is required</span>}
              </div>
            )}
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                {...register("email", { required: true })} // Register the input with useForm
              />
              {errors.email && <span className="error">Email is required</span>}
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                {...register("password", { required: true })} // Register the input with useForm
              />
              {errors.password && <span className="error">Password is required</span>}
            </div>
            {/* Show the confirm password field only if the user is signing up */}
            {!isLogin && (
              <div className="form-group">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  {...register("confirmPassword", { required: true })} // Register the input with useForm
                />
                {errors.confirmPassword && <span className="error">Confirm Password is required</span>}
              </div>
            )}
            <button type="submit" className="form-button">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          {/* Button to switch between login and signup forms */}
          <button onClick={handleSwitch} className="form-switch">
            {isLogin ? "Switch to Sign Up" : "Switch to Login"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// PropTypes to validate the props passed to LoginSignupPage
LoginSignupPage.propTypes = {
  isAuthPage: PropTypes.bool, // Prop to indicate if this is an authentication page
};

export default LoginSignupPage;
