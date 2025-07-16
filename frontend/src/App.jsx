import './App.css'
import LoginSignupForm from "./Components/Assets/LoginSignupForm/LoginSignupForm.jsx";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage/HomePage.jsx';
import Housing from './Components/Housing/Housing.jsx';
import Jobs from './Components/Jobs/Jobs.jsx';
import Services from './Components/Services/Services.jsx';
import PostTypeSelector from './Components/CreatePost/PostTypeSelector.jsx';
import HousingPostForm from './Components/Housing/HousingPostForm.jsx';
import JobsPostForm from './Components/Jobs/JobsPostForm.jsx';
import ServicesPostForm from './Components/Services/ServicesPostForm.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginSignupForm />} />
              <Route path="/signup" element={<LoginSignupForm />} />
              <Route path="/housing" element={<Housing />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/post" element={<PostTypeSelector />} />
              <Route path="/post/housing" element={<HousingPostForm />} />
              <Route path="/post/jobs" element={<JobsPostForm />} />
              <Route path="/post/services" element={<ServicesPostForm />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App
