import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        
        {/* Logo Kısmı - Tıklayınca Ana Sayfaya Gider */}
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-icon">♻️</span>
          <h1>Campus<span>Swap</span></h1>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Kampüste ne arıyorsun?" />
          <button className="search-btn">Ara</button>
        </div>

        <nav className="nav-links">
          <button className="btn-login" onClick={() => navigate('/login')}>
            Giriş Yap
          </button>
          {/* İlan Ver butonuna yönlendirme eklendi */}
          <button className="btn-post" onClick={() => navigate('/create-ad')}>
            ➕ İlan Ver
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;