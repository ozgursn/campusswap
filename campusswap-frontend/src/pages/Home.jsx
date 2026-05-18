import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

const Home = () => {
  // Sahte İlan Verileri
  const products = [
    { id: 1, title: "Fizik 101 Ders Kitabı", price: 150, campus: "Merkez Kampüs", category: "Kitap" },
    { id: 2, title: "Laboratuvar Önlüğü (L Beden)", price: 200, campus: "Tıp Fakültesi", category: "Eşya" },
    { id: 3, title: "Çizim Masası - Mimar Sinan", price: 850, campus: "Mimarlık Fak.", category: "Mobilya" },
    { id: 4, title: "Hesap Makinesi (Casio)", price: 400, campus: "Mühendislik Fak.", category: "Elektronik" },
  ];

  return (
    <main className="main-content">
      <Hero />
      <section className="ads-section">
        <div className="section-header">
          <h2>Son Eklenen İlanlar</h2>
          <button className="btn-all">Tümünü Gör</button>
        </div>
        <div className="product-grid">
          {products.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;