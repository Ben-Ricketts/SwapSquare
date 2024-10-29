import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import HeaderDashboard from './HeaderDashboard';
import Footer from './Footer';

const CreateListing = () => {
  const { register, handleSubmit, formState: { errors } } = useForm(); // Initialize useForm
  const [images, setImages] = useState([]); // State to manage images uploaded by the user
  const navigate = useNavigate(); // Hook to navigate between routes

  // Handle file changes and update the images state
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(prevImages => [...prevImages, ...files]);
  };

  // Handle form submission and send the data to the server
  const onSubmit = async (formData) => {
    const data = new FormData();

    // Append form data to FormData object
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    // Append images to FormData object
    images.forEach((image) => {
      data.append('images', image);
    });

    try {
      const token = localStorage.getItem('authToken');  // Assuming the JWT is stored in localStorage
      const response = await axios.post('http://localhost:5001/items', data, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Include the Authorization header
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Item created:', response.data);
      window.alert('Your item has been added successfully!');
      navigate('/testdashboard'); // Navigate to the dashboard after successful creation
    } catch (error) {
      console.error('Error creating item:', error);
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error response:', error.response.data);
        window.alert('Error creating item: ' + error.response.data.message);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Error request:', error.request);
        window.alert('Error creating item: No response from server.');
      } else {
        // Something else caused the error
        console.error('Error message:', error.message);
        window.alert('Error creating item: ' + error.message);
      }
    }
  };

  return (
    <div className="container">
      <HeaderDashboard cartCount={0}/>
      <div className="dashboard-container">
        <main className="dashboard-content">
          <section className="create-listing-section">
            <h2>Create A New Listing</h2>
            <form className="listing-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-table">
                {/* Form row for product name */}
                <div className="form-row">
                  <label>Name:</label>
                  <input
                    type="text"
                    {...register("name", { required: "Product name is required" })}
                    placeholder="Enter product name... "
                  />
                  {errors.name && <span className="error">{errors.name.message}</span>}
                </div>
                {/* Form row for item title */}
                <div className="form-row">
                  <label>Title:</label>
                  <input
                    type="text"
                    {...register("title", { required: "Item title is required" })}
                    placeholder="Enter item title..."
                  />
                  {errors.title && <span className="error">{errors.title.message}</span>}
                </div>
                {/* Form row for item description */}
                <div className="form-row">
                  <label>Description:</label>
                  <textarea
                    {...register("description", { required: "Description is required" })}
                    placeholder="Enter item description..."
                  ></textarea>
                  {errors.description && <span className="error">{errors.description.message}</span>}
                </div>
                {/* Form row for location */}
                <div className="form-row">
                  <label>Location:</label>
                  <input
                    type="text"
                    {...register("location", { required: "Location is required" })}
                    placeholder="Enter location..."
                  />
                  {errors.location && <span className="error">{errors.location.message}</span>}
                </div>
                {/* Form row for item cost */}
                <div className="form-row">
                  <label>Cost:</label>
                  <input
                    type="number"
                    {...register("cost", { required: "Cost is required", min: 0 })}
                    placeholder="Enter cost..."
                  />
                  {errors.cost && <span className="error">{errors.cost.message}</span>}
                </div>
                {/* Form row for shipping cost */}
                <div className="form-row">
                  <label>Shipping:</label>
                  <input
                    type="number"
                    {...register("shipping", { required: "Shipping cost is required", min: 0 })}
                    placeholder="Enter shipping cost..."
                  />
                  {errors.shipping && <span className="error">{errors.shipping.message}</span>}
                </div>
                {/* Form row for date */}
                <div className="form-row">
                  <label>Date:</label>
                  <div className="input-with-icon">
                    <input
                      type="date"
                      {...register("date", { required: "Date is required" })}
                    />
                    <i className="fas fa-calendar-alt"></i> 
                  </div>
                  {errors.date && <span className="error">{errors.date.message}</span>}
                </div>
              </div>
              {/* Image upload section */}
              <div className="image-upload-section">
                <div className="image-upload">
                  <label htmlFor="file-upload">Drag and Drop Images to Upload</label>
                  <input id="file-upload" type="file" multiple onChange={handleFileChange} />
                </div>
                <div className="image-preview">
                  <h6>Images Will Display Here</h6>
                  <div className="image-grid">
                    {images.map((image, index) => {
                      const imageUrl = URL.createObjectURL(image);
                      return (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`preview ${index}`}
                          className="preview-image"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Submit button */}
              <button type="submit" className="create-listing-button">Create Listing</button>
            </form>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CreateListing;
