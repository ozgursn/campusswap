import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Tarayıcı hafızasından kullanıcıyı oku
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    // Eğer giriş yapılmış bir kullanıcı veya token yoksa, bu sayfayı görmesine izin verme
    if (!savedUser || !token) {
      alert('Bu sayfayı görmek için önce giriş yapmalısınız.');
      navigate('/login');
      return;
    }

    setUser(JSON.parse(savedUser));
  }, [navigate]);

  // Çıkış Yapma Fonksiyonu (Hafızayı temizler)
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Çıkış yapıldı.');
    navigate('/');
    window.location.reload(); // Menüyü sıfırlamak için sayfayı yenile
  };

  if (!user) {
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Yükleniyor...</div>;
  }

  return (
    <main className="main-content" style={{ display: 'flex', justifyContent: 'center', padding: '3rem 1.5rem', gap: '2rem', flexWrap: 'wrap' }}>
      
      {/* Sol Kart: Gerçek Profil Bilgileri */}
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', width: '100%', maxWidth: '350px', border: '1px solid var(--border-color)', textAlign: 'center', height: 'fit-content' }}>
        <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>👨‍💻</div>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{user.name}</h2>
        <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', marginBottom: '1.5rem' }}>🎓 Onaylı Üye</p>
        
        <div style={{ textAlign: 'left', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
          <p>📧 <strong>E-posta:</strong> <br/><span style={{ color: 'var(--text-muted)' }}>{user.email}</span></p>
          <p>📍 <strong>Durum:</strong> <br/><span style={{ color: 'var(--text-muted)' }}>Kampüs Ağı Aktif</span></p>
        </div>

        <button onClick={handleLogout} className="btn-view" style={{ width: '100%', marginTop: '2rem', borderColor: '#ef4444', color: '#ef4444', cursor: 'pointer' }}>
          Çıkış Yap
        </button>
      </div>

      {/* Sağ Kart: İlanlarım (Şimdilik Statik, daha sonra backend'e bağlayacağız) */}
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', flex: '1', maxWidth: '600px', border: '1px solid var(--border-color)', textAlign: 'left' }}>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>📦 İlanlarım</h3>
        <p style={{ color: 'gray' }}>Henüz bir ürün listelemediniz.</p>
      </div>

    </main>
  );
};

export default Profile;