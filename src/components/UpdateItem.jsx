import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import HeaderDashboard from './HeaderDashboard';
import Footer from './Footer';

const UpdateItem = () => {
  const { id } = useParams(); // Get item ID from URL
  const { register, handleSubmit, setValue, formState: { errors } } = useForm(); // Initialize useForm
  const [images, setImages] = useState([]); // New images to be uploaded
  const [existingImages, setExistingImages] = useState([]); // Existing images
  const [cartCount, setCartCount] = useState(0); // Assuming you have logic to calculate cart count
  const navigate = useNavigate();

  // Fetch the item data when the component mounts
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/items/${id}`);
        const itemData = response.data;

        // Set form values using setValue
        setValue('name', itemData.name);
        setValue('title', itemData.title);
        setValue('description', itemData.description);
        setValue('location', itemData.location);
        setValue('cost', itemData.cost);
        setValue('shipping', itemData.shipping);
        setValue('date', new Date(itemData.date).toISOString().split('T')[0]); // Format date for input

        setExistingImages(itemData.imageUrl); // Set existing images
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    fetchItem();
  }, [id, setValue]);

  // Handle file changes and update the images state
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(prevImages => [...prevImages, ...files]);
  };

  // Handle form submission to update the item
  const onSubmit = async (formData) => {
    const data = new FormData();

    // Append form data to FormData object
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    // Append new images (only if there are any)
    if (images.length > 0) {
      images.forEach((image) => {
        data.append('images', image);
      });
    }

    // Append existing images
    existingImages.forEach((image) => {
      data.append('existingImages', image);
    });

    try {
      const token = localStorage.getItem('authToken');  // Get JWT token from localStorage
      await axios.put(`http://localhost:5001/items/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Include the Authorization header
          'Content-Type': 'multipart/form-data',
        },
      });
      window.alert('Your item has been updated successfully!');
      navigate('/testdashboard'); // Redirect to the dashboard after successful update
    } catch (error) {
      console.error('Error updating item:', error);
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error response:', error.response.data);
        window.alert('Error updating item: ' + error.response.data.message);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Error request:', error.request);
        window.alert('Error updating item: No response from server.');
      } else {
        // Something else caused the error
        console.error('Error message:', error.message);
        window.alert('Error updating item: ' + error.message);
      }
    }
  };

  // Remove an existing image from the list of images
  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <HeaderDashboard isAuthPage={false} cartCount={cartCount}/>
      <div className="dashboard-container">
        <main className="dashboard-content">
          <section className="update-item-section">
            <h2>Update Item</h2>
            <form className="listing-form" onSubmit={handleSubmit(onSubmit)}>
              <label>Name:</label>
              <input
                type="text"
                {...register('name', { required: 'Item name is required' })}
                placeholder="Enter item name..."
              />
              {errors.name && <span className="error">{errors.name.message}</span>}

              <label>Title:</label>
              <input
                type="text"
                {...register('title', { required: 'Item title is required' })}
                placeholder="Enter item title..."
              />
              {errors.title && <span className="error">{errors.title.message}</span>}

              <label>Description:</label>
              <textarea
                {...register('description', { required: 'Item description is required' })}
                placeholder="Enter item description..."
              ></textarea>
              {errors.description && <span className="error">{errors.description.message}</span>}

              <label>Location:</label>
              <input
                type="text"
                {...register('location', { required: 'Location is required' })}
                placeholder="Enter location..."
              />
              {errors.location && <span className="error">{errors.location.message}</span>}

              <label>Cost:</label>
              <input
                type="number"
                {...register('cost', { required: 'Cost is required', min: 0 })}
                placeholder="Enter cost..."
              />
              {errors.cost && <span className="error">{errors.cost.message}</span>}

              <label>Shipping:</label>
              <input
                type="number"
                {...register('shipping', { required: 'Shipping cost is required', min: 0 })}
                placeholder="Enter shipping cost..."
              />
              {errors.shipping && <span className="error">{errors.shipping.message}</span>}

              <label>Date:</label>
              <input
                type="date"
                {...register('date', { required: 'Date is required' })}
              />
              {errors.date && <span className="error">{errors.date.message}</span>}

              <div className="existing-images">
                <h4>Existing Images</h4>
                <div className="image-preview">
                  {existingImages.map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img 
                        src={`http://localhost:5001/${image}`} 
                        alt={`existing ${index}`} 
                        style={{ width: '100px', height: 'auto', margin: '10px' }}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeExistingImage(index)}
                        style={{
                          position: 'absolute', top: '5px', right: '5px', backgroundColor: 'red', color: 'white'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="image-upload">
                <label htmlFor="file-upload">Upload New Images</label>
                <input id="file-upload" type="file" multiple onChange={handleFileChange} />
              </div>

              <div className="image-preview">
                {images.map((image, index) => {
                  const imageUrl = URL.createObjectURL(image);
                  return (
                    <img 
                      key={index} 
                      src={imageUrl} 
                      alt={`preview ${index}`} 
                      style={{ width: '100px', height: 'auto', margin: '10px' }}
                    />
                  );
                })}
              </div>

              <button type="submit" className="update-listing-button">Update Listing</button>
            </form>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default UpdateItem;
