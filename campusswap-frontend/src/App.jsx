import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// 🚨 TOASTIFY IMPORTLARI: Kütüphaneyi ve stil dosyasını buraya ekliyoruz
import { ToastContainer } from 'react-toastify';
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

        {/* 🚀 TOAST CONTAINER: Ekranın sağ üst köşesinde canlanacak modern bildirim havuzu */}
        <ToastContainer 
          position="top-right"    // Sağ üst köşede çıksın
          autoClose={3000}         // 3 saniye (3000ms) sonra kapansın
          hideProgressBar={false}  // Altındaki zaman çizgisini göster (Zaman akışını jüri görsün, şık duruyor)
          newestOnTop={true}       // Üst üste bildirim gelirse yenisi en üstte açılsin
          closeOnClick             // Tıklayınca anında kapansın
          pauseOnHover             // Fareyle üzerine gelince geri sayım dursun
          draggable                // Sürükleyerek fırlatıp kapatılabilsin
          theme="colored"          // Başarılı/Başarısız durumlarına göre yeşil/kırmızı temayı açar
        />
      </div>
    </BrowserRouter>
  );
}

// Vite'ın hata vermesini engelleyen en kritik satır:
export default App;