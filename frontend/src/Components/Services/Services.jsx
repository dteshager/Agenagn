import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Services.css';

function Services() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchServicePosts();
    }, []);

    const fetchServicePosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/posts/services');
            setPosts(response.data.posts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching service posts:', error);
            setError('Failed to load service posts');
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading service posts...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="services-wrapper">
            <div className="services-page">
                <div className="services-header">
                    <h1>Service Listings</h1>
                    <p>Find services available in your area.</p>
                    
                    <button 
                        onClick={() => navigate('/post/services')}
                        className="post-service-btn"
                    >
                        Post Service
                    </button>
                </div>

                <div className="services-content">
                    {posts.length === 0 ? (
                        <p className="no-posts">No service posts available yet.</p>
                    ) : (
                        <div className="posts-container">
                            {posts.map(post => (
                                <div key={post.id} className="post-card">
                                    <h3>{post.title}</h3>
                                    <p><strong>Contact:</strong> {post.contact_info}</p>
                                    <p>{post.content}</p>
                                    
                                    {post.images && post.images.length > 0 && (
                                        <div className="post-images">
                                            <h4>Images:</h4>
                                            <div className="images-grid">
                                                {post.images.map((image, index) => (
                                                    <img 
                                                        key={index}
                                                        src={`http://localhost:5000${image.url}`}
                                                        alt={`Post image ${index + 1}`}
                                                        className="post-image"
                                                        onClick={() => window.open(`http://localhost:5000${image.url}`, '_blank')}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <small className="post-meta">Posted by: {post.user_email} on {new Date(post.created_at).toLocaleDateString()}</small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Services;