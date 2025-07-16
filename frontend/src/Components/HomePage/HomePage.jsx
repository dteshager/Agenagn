import React, { useState, useEffect } from "react";
import './HomePage.css';
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Check authentication status on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        alert('Logged out successfully!');
    };

    return (
        <div className="home-wrapper">
            {/* Login/Signup buttons or user info with logout */}
            <div className='auth-buttons'>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>{user.email}</span>
                        <button onClick={handleLogout} className='signin'>Logout</button>
                    </div>
                ) : (
                    <>
                        <button onClick={() => navigate('/login')} className='signin'>Login</button>
                        <button onClick={() => navigate('/signup')} className='signup'>Sign Up</button>
                    </>
                )}
            </div>

            {/* A new central container for the main content */}
            <div className="home-container">
                <div className="welcome-section">
                    <h1>Welcome to Agenagn</h1>
                    <p>Helping Ethiopians in North America find housing, jobs, and services.</p>
                </div>

                <div className='main-content'>
                    <button onClick={() => navigate('/housing')}>Housing</button>
                    <button onClick={() => navigate('/jobs')}>Jobs</button>
                    <button onClick={() => navigate('/services')}>Services</button>
                    <button onClick={() => navigate('/post')}>Create a Post</button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;