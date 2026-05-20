import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

const Home = () => {
  // Veritabanından gelecek ürünleri tutacağımız state
  const [products, setProducts] = useState([]);

  // Sayfa yüklendiğinde bir kere çalışacak kod (useEffect)
  useEffect(() => {
    // Backend API'mizden verileri çekiyoruz
    fetch('http://localhost:3000/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data); // Gelen veriyi state'e yazdır
      })
      .catch((err) => console.error("Veri çekme hatası:", err));
  }, []);

  return (
    <main className="main-content">
      <Hero />
      <section className="ads-section">
        <div className="section-header">
          <h2>Son Eklenen İlanlar</h2>
          <button className="btn-all">Tümünü Gör</button>
        </div>
        
        <div className="product-grid">
          {/* Eğer ürün yoksa kullanıcıya mesaj göster, varsa kartları çiz */}
          {products.length === 0 ? (
            <p style={{ color: 'gray', gridColumn: '1 / -1', textAlign: 'center' }}>
              Henüz ilan eklenmemiş. İlk ilanı sen ver!
            </p>
          ) : (
            products.map((item) => (
              <ProductCard 
                key={item.id} 
                title={item.title}
                price={item.price}
                campus={item.campus}
                category={item.category}
                image={item.imageUrl} // Resim adresi gelirse gösterecek
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;