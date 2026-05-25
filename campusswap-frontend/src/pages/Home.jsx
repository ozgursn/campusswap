import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ARAMA/FİLTRE STATE'LERİ ---
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Hepsi');
  const [campus, setCampus] = useState('Hepsi');

  useEffect(() => {
    setLoading(true);

    // Dinamik URL parametrelerini hazırlıyoruz
    const queryParams = new URLSearchParams();
    if (search.trim()) queryParams.append('search', search);
    if (category !== 'Hepsi') queryParams.append('category', category);
    if (campus !== 'Hepsi') queryParams.append('campus', campus);

    // Backend API'mizden filtreleri, acil ve premium sıralamasını çekiyoruz
    fetch(`http://localhost:3000/products?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Veri çekme hatası:", err);
        setLoading(false);
      });
  }, [search, category, campus]); // Filtreler değiştikçe tetiklenir

  return (
    <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
      <Hero />
      
      {/* 🔍 GÖRSEL ARAMA VE FİLTRELEME PANELİ */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '-2rem', position: 'relative', zIndex: 5 }}>
        
        {/* Kelime Arama */}
        <div style={{ flex: '2', minWidth: '250px' }}>
          <input 
            type="text" 
            placeholder="🔍 Kampüste ne aramıştınız? (Örn: Fizik Kitabı, Hesap Makinesi)" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none', fontSize: '0.95rem' }}
          />
        </div>

        {/* Kategori Filtresi */}
        <div style={{ flex: '1', minWidth: '150px' }}>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', backgroundColor: '#f8fafc', fontSize: '0.95rem', cursor: 'pointer' }}>
            <option value="Hepsi">📚 Tüm Kategoriler</option>
            <option value="Kitap">Kitap</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Eşya">Ev/Oda Eşyası</option>
            <option value="Giyim">Giyim</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>

        {/* Kampüs Filtresi */}
        <div style={{ flex: '1', minWidth: '150px' }}>
          <select value={campus} onChange={(e) => setCampus(e.target.value)} style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', backgroundColor: '#f8fafc', fontSize: '0.95rem', cursor: 'pointer' }}>
            <option value="Hepsi">📍 Tüm Kampüsler</option>
            <option value="Merkez Kampüs">Merkez Kampüs</option>
            <option value="Mühendislik Kampüsü">Mühendislik Kampüsü</option>
            <option value="Tıp Fakültesi">Tıp Fakültesi</option>
          </select>
        </div>

      </div>

      {/* 📢 İLANLAR VİTRİN ALANI */}
      <section className="ads-section" style={{ paddingBottom: '4rem' }}>
        <div className="section-header">
          <h2>📢 Güncel Kampüs İlanları</h2>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.1rem', color: 'gray' }}>İlanlar listeleniyor...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '1rem', border: '1px dashed #cbd5e1', color: 'gray' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>🔍 Aradığınız kriterlere uygun ilan bulunamadı.</p>
          </div>
        ) : (
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
            {products.map((item) => (
              <ProductCard 
                key={item.id} 
                product={item} // 🚀 Uyuşmazlığı çözen, tüm objeyi tek seferde gönderen güvenli yapı!
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;