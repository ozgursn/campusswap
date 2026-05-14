import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import './App.css';

function App() {
  // Sahte İlan Verileri (Backend gelene kadar buradayız)
  const products = [
    { id: 1, title: "Fizik 101 Ders Kitabı", price: 150, campus: "Merkez Kampüs", category: "Kitap" },
    { id: 2, title: "Laboratuvar Önlüğü (L Beden)", price: 200, campus: "Tıp Fakültesi", category: "Eşya" },
    { id: 3, title: "Çizim Masası - Mimar Sinan", price: 850, campus: "Mimarlık Fak.", category: "Mobilya" },
    { id: 4, title: "Hesap Makinesi (Casio)", price: 400, campus: "Mühendislik Fak.", category: "Elektronik" },
    { id: 5, title: "Kampüs Bisikleti (Vitesli)", price: 1200, campus: "Kuzey Kampüs", category: "Ulaşım" },
    { id: 6, title: "Psikolojiye Giriş Notları", price: 50, campus: "Edebiyat Fak.", category: "Notlar" },
  ];

  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <Hero />

        {/* İlanlar Bölümü */}
        <section className="ads-section">
          <div className="section-header">
            <h2>Son Eklenen İlanlar</h2>
            <button className="btn-all">Tümünü Gör</button>
          </div>

          <div className="product-grid">
            {products.map((item) => (
              <ProductCard 
                key={item.id}
                title={item.title}
                price={item.price}
                campus={item.campus}
                category={item.category}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;