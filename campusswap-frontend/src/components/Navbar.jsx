import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Tarayıcı hafızasında kullanıcı var mı kontrol et
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : null;

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-icon">♻️</span>
          <h1>Campus<span>Swap</span></h1>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Kampüste ne arıyorsun?" />
          <button className="search-btn">Ara</button>
        </div>

        <nav className="nav-links">
          {/* Giriş Yapılmadıysa Bu Butonları Göster */}
          {!token ? (
            <button className="btn-login" onClick={() => navigate('/login')}>
              Giriş Yap
            </button>
          ) : (
            // Giriş Yapıldıysa Kullanıcının İsmini ve Profil Butonunu Göster
            <button 
              onClick={() => navigate('/profile')}
              style={{ background: '#f1f5f9', border: 'none', padding: '0.6rem 1rem', borderRadius: '0.8rem', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}
            >
              👤 {user?.name}
            </button>
          )}

          <button className="btn-post" onClick={() => navigate('/create-ad')}>
            ➕ İlan Ver
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;