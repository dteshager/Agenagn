import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './HousingPostForm.css';

function HousingPostForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: ''
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
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.description);
            formDataToSend.append('post_type', 'housing');
            formDataToSend.append('location', formData.location);
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
                alert('Housing post created successfully!');
                // Redirect to housing page
                navigate('/housing');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert(error.response?.data?.error || 'Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="housing-post-form-wrapper">
            <div className="housing-post-form-page">
                <h1>Create Housing Post</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Title:
                        <input 
                            type="text" 
                            name="title"
                            placeholder="Need a roommate"
                            value={formData.title}
                            onChange={handleChange}
                            required 
                        />
                    </label>
                    <label>
                        Description:
                        <textarea 
                            name="description"
                            placeholder="Looking for a roommate to share a 2-bedroom apartment in downtown."
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </label>
                    <label>
                        Location:
                        <input 
                            type="text" 
                            name="location"
                            placeholder="Seattle, WA"
                            value={formData.location}
                            onChange={handleChange}
                            required 
                        />
                    </label>
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
export default HousingPostForm;