import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Jobs.css';

function Jobs() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchJobPosts();
    }, []);

    const fetchJobPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/posts/jobs');
            setPosts(response.data.posts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching job posts:', error);
            setError('Failed to load job posts');
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading job posts...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="jobs-wrapper">
            <div className="jobs-page">
                <div className="jobs-header">
                    <h1>Job Listings</h1>
                    <p>Find job opportunities in your area.</p>
                    
                    <button 
                        onClick={() => navigate('/post/jobs')}
                        className="post-job-btn"
                    >
                        Post Job
                    </button>
                </div>

                <div className="jobs-content">
                    {posts.length === 0 ? (
                        <p className="no-posts">No job posts available yet.</p>
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
export default Jobs;