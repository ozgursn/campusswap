import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams(); // URL'den ürün IDsini alır
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Sadece bu ID'ye sahip ürünü arka yüzden çek
    fetch(`http://localhost:3000/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Ürün detayı çekilemedi:", err));
  }, [id]);

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Yükleniyor...</div>;
  }

  return (
    <main className="main-content" style={{ display: 'flex', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ background: 'white', display: 'flex', gap: '2rem', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', width: '100%', maxWidth: '900px', border: '1px solid var(--border-color)', textAlign: 'left' }}>
        
        {/* Sol Taraf: Görsel */}
        <div style={{ flex: '1', background: '#f1f5f9', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} style={{ width: '100%', borderRadius: '0.5rem' }} />
          ) : (
            <span style={{ fontSize: '4rem' }}>📦</span>
          )}
        </div>

        {/* Sağ Taraf: Detaylar */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{product.category}</span>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{product.title}</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{product.price} TL</p>
          
          <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>📍 <strong>Teslimat:</strong> {product.campus}</p>
            <p style={{ margin: '0' }}>🕒 <strong>İlan Tarihi:</strong> {new Date(product.createdAt).toLocaleDateString('tr-TR')}</p>
          </div>

          <button className="btn-post" style={{ padding: '1rem', fontSize: '1.1rem', marginBottom: '1rem' }}>
            Satıcıyla İletişime Geç
          </button>
          <button className="btn-view" onClick={() => navigate('/')}>
            Geri Dön
          </button>
        </div>

      </div>
    </main>
  );
};

export default ProductDetail;