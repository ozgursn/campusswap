import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateAd from './pages/CreateAd'; // 1. Yeni sayfayı import ettik
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-ad" element={<CreateAd />} /> {/* 2. Yeni rotayı ekledik */}
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;