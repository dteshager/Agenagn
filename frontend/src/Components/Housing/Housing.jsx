import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Housing.css';

function Housing() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHousingPosts();
    }, []);

    const fetchHousingPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/posts/housing');
            setPosts(response.data.posts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching housing posts:', error);
            setError('Failed to load housing posts');
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading housing posts...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="housing-wrapper">
            <div className="housing-page">
                <div className="housing-header">
                    <h1>Housing Listings</h1>
                    <p>Find available housing options in your area.</p>
                    
                    <button 
                        onClick={() => navigate('/post/housing')}
                        className="post-housing-btn"
                    >
                        Post Housing
                    </button>
                </div>

                <div className="housing-content">
                    {posts.length === 0 ? (
                        <p className="no-posts">No housing posts available yet.</p>
                    ) : (
                        <div className="posts-container">
                            {posts.map(post => (
                                <div key={post.id} className="post-card">
                                    <h3>{post.title}</h3>
                                    <p><strong>Location:</strong> {post.location}</p>
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
export default Housing;