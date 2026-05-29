import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateAd from './pages/CreateAd';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile'; 
import './App.css';

function App() {
  // 💾 Hafıza Kilidi: Web tarayıcısında en son ekrana fırlatılan acil ilanın ID'sini tutar
  const [lastUrgentId, setLastUrgentId] = useState(null);

// 🖥️ WEB CANLI BİLDİRİM MOTORU (NGROK BYPASS KORUMALI)
  useEffect(() => {
    const BASE_URL = 'https://litter-stew-sensitize.ngrok-free.dev';

    const interval = setInterval(() => {
      // ⚡ Ngrok'un aradaki uyarı sayfasını tamamen bypass eden profesyonel başlık yapısı:
      fetch(`${BASE_URL}/products?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true', // 🔥 Tarayıcı uyarısını zorla geçen satır!
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error('Ağ yanıtı başarısız');
          return res.json();
        })
        .then((data) => {
          if (!data || !Array.isArray(data) || data.length === 0) return;
          
          const latestProduct = data[0]; // Zirvedeki eleman

          if (
            latestProduct && 
            latestProduct.id !== undefined &&
            (latestProduct.isUrgent === true || String(latestProduct.isUrgent) === 'true' || Number(latestProduct.isUrgent) === 1) && 
            latestProduct.id !== lastUrgentId
          ) {
            console.log('🖥️ Web yakaladı! Yeni Acil ID:', latestProduct.id);
            setLastUrgentId(latestProduct.id);

            // Kıpkırmızı toast bildirimi tetikleniyor
            toast.error(`🚨 KAMPÜSTE ACİL İLAN! | "${latestProduct.title}" az önce acil satılık durumuna alındı! Fiyat: ${latestProduct.price} TL.`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "colored",
            });
          }
        })
        .catch((err) => {
          // Konsolu kirletmemesi ve hata birikmemesi için burayı sessize aldık şef
        });
    }, 6000);

    return () => clearInterval(interval);
  }, [lastUrgentId]);

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

        {/* 🚀 TOAST CONTAINER: Bildirimlerin web ekranında fiziksel olarak canlandığı yuva */}
        <ToastContainer 
          position="top-right"    
          autoClose={3000}         
          hideProgressBar={false}  
          newestOnTop={true}       
          closeOnClick            
          pauseOnHover             
          draggable                
          theme="colored"          
        />
      </div>
    </BrowserRouter>
  );
}

export default App;