import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ServicesPostForm.css';

function ServicesPostForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        serviceTitle: '',
        serviceDescription: '',
        contactInfo: ''
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const MAX_IMAGES = 3;

    // 🔐 Check for authentication
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            alert('You must be logged in to create a post.');
            // Redirect to login with current location state
            navigate('/login', { state: { from: location } });
        }
    }, [navigate, location]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Check if adding these files would exceed the maximum
        if (selectedImages.length + files.length > MAX_IMAGES) {
            alert(`You can only upload a maximum of ${MAX_IMAGES} images. You currently have ${selectedImages.length} images selected.`);
            return;
        }

        // Validate file types
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];
        const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
        
        if (invalidFiles.length > 0) {
            alert('Please select only image files (PNG, JPG, JPEG, GIF, WEBP).');
            return;
        }

        // Validate file sizes (5MB max per image)
        const maxSize = 5 * 1024 * 1024; // 5MB
        const oversizedFiles = files.filter(file => file.size > maxSize);
        
        if (oversizedFiles.length > 0) {
            alert('Each image must be less than 5MB.');
            return;
        }

        // Add new files to existing images
        setSelectedImages(prevImages => [...prevImages, ...files]);
        
        // Clear the file input so users can select the same files again if needed
        e.target.value = '';
    };

    const removeImage = (index) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const formDataToSend = new FormData();
            
            // Append text data
            formDataToSend.append('title', formData.serviceTitle);
            formDataToSend.append('content', formData.serviceDescription);
            formDataToSend.append('post_type', 'services');
            formDataToSend.append('contact_info', formData.contactInfo);
            formDataToSend.append('user_email', user.email);

            // Append image files
            selectedImages.forEach((image, index) => {
                formDataToSend.append('images', image);
            });

            const response = await axios.post('http://localhost:5000/api/CreatePost', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.status === 201) {
                alert('Service post created successfully!');
                // Redirect to services page
                navigate('/services');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert(error.response?.data?.error || 'Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="services-post-form-wrapper">
            <div className="services-post-form-page">
                <h1>Create a Service Post</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="serviceTitle">Service Title:</label>
                    <input 
                        type="text" 
                        id="serviceTitle" 
                        name="serviceTitle" 
                        value={formData.serviceTitle}
                        onChange={handleChange}
                        required 
                    />

                    <label htmlFor="serviceDescription">Description:</label>
                    <textarea 
                        id="serviceDescription" 
                        name="serviceDescription" 
                        value={formData.serviceDescription}
                        onChange={handleChange}
                        required
                    ></textarea>

                    <label htmlFor="contactInfo">Contact Information:</label>
                    <input 
                        type="text" 
                        id="contactInfo" 
                        name="contactInfo" 
                        value={formData.contactInfo}
                        onChange={handleChange}
                        required 
                    />

                    <label>
                        Images (Maximum {MAX_IMAGES}):
                        <input 
                            type="file" 
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="file-input"
                        />
                    </label>
                    
                    {selectedImages.length > 0 && (
                        <div className="images-preview">
                            <h4>Selected Images:</h4>
                            <div className="images-grid">
                                {selectedImages.map((image, index) => (
                                    <div key={index} className="image-preview-container">
                                        <img 
                                            src={URL.createObjectURL(image)} 
                                            alt={`Preview ${index + 1}`}
                                            className="image-preview"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="remove-image-btn"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="submit-btn">
                        {isSubmitting ? 'Creating...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}
export default ServicesPostForm;