import React from 'react';

const Navbar = () => {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Logo Kısmı */}
        <div className="logo">
          <span className="logo-icon">♻️</span>
          <h1>Campus<span>Swap</span></h1>
        </div>

        {/* Arama Çubuğu */}
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Kampüste ne arıyorsun? (Örn: Fizik 101 Kitabı)" 
          />
          <button className="search-btn">Ara</button>
        </div>

        {/* Menü Butonları */}
        <nav className="nav-links">
          <button className="btn-login">Giriş Yap</button>
          <button className="btn-post">➕ İlan Ver</button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;