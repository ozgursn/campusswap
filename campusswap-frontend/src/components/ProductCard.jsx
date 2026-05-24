import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, title, price, campus, category, image, isPremium }) => {
  return (
    <Link 
      to={`/product/${id}`} 
      className="product-card" 
      style={{ 
        textDecoration: 'none', 
        color: 'inherit', 
        background: 'white', 
        borderRadius: '1rem', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        transition: 'all 0.3s ease',
        
        // 🌟 PREMIUM PARILTI SİHRİ: İlan premium ise altın sarısı kalın çerçeve ve neon gölge efekti ekliyoruz
        border: isPremium ? '2.5px solid #FFB703' : '1px solid var(--border-color)', 
        boxShadow: isPremium 
          ? '0 10px 25px rgba(255, 183, 3, 0.35), 0 0 15px rgba(255, 183, 3, 0.2)' 
          : '0 4px 6px -1px rgba(0,0,0,0.05)', 
      }}
      // Üzerine gelindiğinde yukarı doğru hafifçe esneme (hover) efekti
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      
      {/* 🌟 PREMIUM VIP ROZETİ: Sadece premium ilanlarda sol üst köşede parlar */}
      {isPremium && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'linear-gradient(135deg, #FFB703, #FB8500)', // Canva tasarımdaki turuncu-altın geçişi
          color: '#0D1F16',
          padding: '0.4rem 0.8rem',
          borderRadius: '2rem',
          fontSize: '0.7rem',
          fontWeight: '800',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          zIndex: 10,
          letterSpacing: '0.5px'
        }}>
          🌟 ÖNE ÇIKAN İLAN
        </div>
      )}

      {/* Ürün Görsel Alanı */}
      <div style={{ height: '200px', width: '100%', overflow: 'hidden', background: '#f1f5f9', position: 'relative' }}>
        <img 
          src={image || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500'} 
          alt={title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Ürün Bilgi Alanı */}
      <div style={{ padding: '1.2rem', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Kategori Rozeti */}
          <span style={{ 
            fontSize: '0.75rem', 
            background: isPremium ? '#FFF3D1' : '#f1f5f9', 
            padding: '0.2rem 0.6rem', 
            borderRadius: '1rem', 
            fontWeight: '700', 
            color: isPremium ? '#B57A00' : '#475569' 
          }}>
            {category}
          </span>
          
          {/* İlan Başlığı */}
          <h3 style={{ 
            fontSize: '1.1rem', 
            marginTop: '0.5rem', 
            marginBottom: '0.5rem', 
            color: 'var(--text-main)', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            fontWeight: isPremium ? '700' : '500' 
          }}>
            {title}
          </h3>
          
          {/* Kampüs Bilgisi */}
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>📍 {campus}</p>
        </div>
        
        {/* Fiyat Alanı */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.8rem' }}>
          <span style={{ 
            fontSize: '1.2rem', 
            fontWeight: '800', 
            color: isPremium ? '#FB8500' : 'var(--text-main)' 
          }}>
            {price} TL
          </span>
          <span style={{ fontSize: '0.75rem', color: 'gray', fontWeight: '500' }}>
            🔎 İncele
          </span>
        </div>
      </div>

    </Link>
  );
};

export default ProductCard;