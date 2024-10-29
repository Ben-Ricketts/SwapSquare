import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'; // Import social media icons from react-icons
import SwapLogo from '../assets/SwapLogo.png';

// Footer component definition
const Footer = () => {
  return (
    // Footer element styled with flexbox to align content horizontally and center it vertically
    <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0'}}>
      
      {/* Container for social media icons */}
      <div style={{ marginLeft: '35px' }}>
        {/* Facebook Icon with link */}
        <a 
          href="https://www.facebook.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ margin: '0 5px', color: '#3b5998' }} // Apply margin and color to the icon
        >
          <FaFacebookF /> {/* Render Facebook icon */}
        </a>
        
        {/* Twitter Icon with link */}
        <a 
          href="https://www.twitter.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ margin: '0 5px', color: '#00acee' }} // Apply margin and color to the icon
        >
          <FaTwitter /> {/* Render Twitter icon */}
        </a>
        
        {/* Instagram Icon with link */}
        <a 
          href="https://www.instagram.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ margin: '0 5px', color: '#C13584' }} // Apply margin and color to the icon
        >
          <FaInstagram /> {/* Render Instagram icon */}
        </a>
      </div>
      
      {/* Copyright Text and Logo */}
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '35px' }}>
        &copy;  
        {/* Add your logo next to the copyright text */}
        <img 
          src={SwapLogo} 
          alt="SwapSquare Logo" 
          style={{ marginLeft: '5px', height: '20px', marginRight: '5px'}} // Adjust the size of the logo here
        /> 
        <p style={{ margin: '0', display: 'inline-block', verticalAlign: 'middle' }}>2024</p>
      </div>
    </footer>
  );
};

export default Footer; // Export the Footer component as the default export
