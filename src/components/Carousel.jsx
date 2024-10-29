import { useState, useEffect } from 'react';
import '../styles.css'; // Import the CSS file

// Define the list of categories to be displayed in the carousel
const categories = ["Shoes", "Technology", "Gaming", "Jewellery", "Furniture", "Books", "Clothes", "Sports", "Health", "Beauty"];

const Carousel = () => {
  // State to manage the currently visible categories
  const [visibleCategories, setVisibleCategories] = useState([]);
  // State to track the starting index for visible categories
  const [startIndex, setStartIndex] = useState(0);
  // State to determine how many categories should be shown based on screen size
  const [categoriesToShow, setCategoriesToShow] = useState(6);

  // Function to handle resizing the window and adjusting the number of visible categories
  const handleResize = () => {
    if (window.innerWidth <= 480) {
      setCategoriesToShow(2); // Show 2 categories on small screens
    } else if (window.innerWidth <= 768) {
      setCategoriesToShow(3); // Show 3 categories on medium screens
    } else {
      setCategoriesToShow(6); // Show 6 categories on larger screens
    }
  };

  // useEffect to handle updates to visible categories and window resizing
  useEffect(() => {
    const updateVisibleCategories = () => {
      const newVisibleCategories = [];
      for (let i = 0; i < categoriesToShow; i++) {
        // Ensure categories loop around when reaching the end of the array
        newVisibleCategories.push(categories[(startIndex + i) % categories.length]);
      }
      setVisibleCategories(newVisibleCategories);
    };

    updateVisibleCategories(); // Initial update of visible categories
    window.addEventListener('resize', handleResize); // Add event listener for resizing
    handleResize(); // Call handleResize initially to set the correct number of categories

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup event listener on component unmount
    };
  }, [startIndex, categoriesToShow]); // Dependencies: update when startIndex or categoriesToShow changes

  // Function to handle clicking the previous button left
  const handlePrevious = () => {
    const newStartIndex = (startIndex - 1 + categories.length) % categories.length;
    setStartIndex(newStartIndex);
  };

  // Function to handle clicking the next button right
  const handleNext = () => {
    const newStartIndex = (startIndex + 1) % categories.length;
    setStartIndex(newStartIndex);
  };

  return (
    <div className="carousel">
      <button className="carousel-arrow left" aria-label="Previous" onClick={handlePrevious}>&lt;</button>
      <div className="carousel-content">
        {visibleCategories.map((category) => (
          <button key={category} className="carousel-category">{category}</button>
        ))}
      </div>
      <button className="carousel-arrow right" aria-label="Next" onClick={handleNext}>&gt;</button>
    </div>
  );
};

export default Carousel;
