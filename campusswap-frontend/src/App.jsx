import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateAd from './pages/CreateAd';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile'; // Dosya isminin büyük/küçük harfine dikkat!
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-ad" element={<CreateAd />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

// Vite'ın hata vermesini engelleyen en kritik satır:
export default App;