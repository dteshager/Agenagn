import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function PostTypeSelector() {
  const [postType, setPostType] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 🔐 Check for authentication
  useEffect(() => {
    const user = localStorage.getItem('user'); // or your token
    if (!user) {
      alert('You must be logged in to create a post.');
      // Redirect to login with current location state
      navigate('/login', { state: { from: location } });
    }
  }, [navigate, location]);

  const handleContinue = () => {
    if (postType === '') {
      alert('Please select a post type');
      return;
    }
    navigate(`/post/${postType}`);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Create a Post</h2>

      <select
        value={postType}
        onChange={(e) => setPostType(e.target.value)}
        style={{ padding: '10px', fontSize: '1rem', width: '200px', marginTop: '20px' }}
      >
        <option value="">Select Post Type</option>
        <option value="housing">Housing</option>
        <option value="jobs">Jobs</option>
        <option value="services">Services</option>
      </select>

      <br /><br />
      <button onClick={handleContinue} style={{
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#0077ff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
      }}>
        Continue
      </button>
    </div>
  );
}

export default PostTypeSelector;
