import React from 'react';
// 🚨 KİLİT IMPORT: Detay sayfasına uçmak için React Router kancasını ekliyoruz
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  // 🛡️ Güvenlik kalkanı
  if (!product) return null;

  const navigate = useNavigate(); // 👈 Yönlendiriciyi bileşen içinde tanımlıyoruz

  const { id, title, price, imageUrl, category, campus, isPremium, isUrgent, user } = product;

  let cardStyle = {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'all 0.3s ease',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    cursor: 'pointer' // 👈 Kullanıcı üzerine geldiğinde tıklanabilir el işareti çıksın
  };

  if (isUrgent) {
    cardStyle.border = '2px solid #ef4444';
    cardStyle.boxShadow = '0 0 15px rgba(239, 68, 68, 0.3)';
    cardStyle.animation = 'pulse 2s infinite ease-in-out'; 
  } else if (isPremium) {
    cardStyle.border = '2px solid #FB8500';
    cardStyle.boxShadow = '0 0 12px rgba(251, 133, 0, 0.2)';
  }

  // Yerel veritabanındaki gerçek yüklenen resmi frontend'e bağlayan fonksiyon
  const getProductImage = () => {
    if (!imageUrl) return 'https://via.placeholder.com/300'; 
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:3000/${imageUrl}`;
  };

  return (
    // 🚨 KİLİT DEĞİŞİKLİK: En dıştaki div'e onClick vererek tüm kartı tıklanabilir yaptık!
    // Bu sayede tıklandığı an urldeki ID ile detay sayfasına gidip satıcı verilerini çekecek.
    <div 
      style={cardStyle} 
      className={isUrgent ? 'urgent-card' : ''} 
      onClick={() => navigate(`/product/${id}`)}
    >
      
      {/* ⚡ ACİL SATILIK ROZETI */}
      {isUrgent && (
        <div style={{ position: 'absolute', top: '-12px', left: '16px', backgroundColor: '#ef4444', color: '#ffffff', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', zIndex: 10 }}>
          ⚡ ACİL SATILIK
        </div>
      )}

      {/* 🌟 PREMIUM ROZETI */}
      {!isUrgent && isPremium && (
        <div style={{ position: 'absolute', top: '-12px', left: '16px', backgroundColor: '#FB8500', color: '#ffffff', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', zIndex: 10 }}>
          🌟 ÖNE ÇIKAN İLAN
        </div>
      )}

      {/* 📦 KULLANICININ YÜKLEDİĞİ GERÇEK RESİM */}
      <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
        <img 
          src={getProductImage()} 
          alt={title || 'Ürün'} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      {/* Ürün Bilgileri */}
      <div>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: isUrgent ? '#ef4444' : (isPremium ? '#FB8500' : '#52B788'), textTransform: 'uppercase' }}>
          {category} • {campus}
        </span>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginTop: '0.3rem', color: '#0D1F16' }}>{title}</h3>
      </div>

      {/* Fiyat ve Satıcı */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.8rem', marginTop: 'auto' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: isUrgent ? '#ef4444' : (isPremium ? '#FB8500' : '#1B4332') }}>
          {price} TL
        </span>
        <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>
          👤 {user?.username || 'Öğrenci'}
        </span>
      </div>

    </div>
  );
}