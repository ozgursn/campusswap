import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAd = () => {
  const navigate = useNavigate();
  
  // Formdaki verileri tutacağımız state (Hafıza)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Kitap & Not',
    price: '',
    campus: 'Merkez Kampüs'
  });

  // Girdiler değiştikçe hafızayı güncelleyen fonksiyon
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form gönderildiğinde API'ye istek atan fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller

    try {
      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price) // Fiyatı sayıya çevirerek gönderiyoruz
        })
      });

      if (response.ok) {
        // İlan başarıyla eklendiyse ana sayfaya yönlendir
        navigate('/');
      }
    } catch (error) {
      console.error("İlan eklenirken hata oluştu:", error);
    }
  };

  return (
    <main className="main-content" style={{ display: 'flex', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px', border: '1px solid var(--border-color)', textAlign: 'left' }}>
        
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: 'var(--text-main)' }}>Yeni İlan Ver</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Kampüsteki diğer öğrencilerin işine yarayacak eşyalarını hemen listele.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>İlan Başlığı</label>
            <input 
              type="text" name="title" required
              value={formData.title} onChange={handleChange}
              placeholder="Örn: Temiz Kullanılmış Fizik 101 Kitabı" 
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Kategori</label>
              <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none', background: 'white' }}>
                <option>Kitap & Not</option>
                <option>Elektronik</option>
                <option>Ev & Yurt Eşyası</option>
                <option>Hobi & Spor</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Fiyat (TL)</label>
              <input 
                type="number" name="price" required min="0"
                value={formData.price} onChange={handleChange}
                placeholder="0.00" 
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Teslimat Kampüsü</label>
            <select name="campus" value={formData.campus} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none', background: 'white' }}>
              <option>Merkez Kampüs</option>
              <option>Kuzey Kampüs</option>
              <option>Tıp Fakültesi Kampüsü</option>
            </select>
          </div>

          <button type="submit" className="btn-post" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1rem' }}>
            İlanı Yayına Al
          </button>

        </form>
      </div>
    </main>
  );
};

export default CreateAd;