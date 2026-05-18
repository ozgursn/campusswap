import React from 'react';

const CreateAd = () => {
  return (
    <main className="main-content" style={{ display: 'flex', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px', border: '1px solid var(--border-color)', textAlign: 'left' }}>
        
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: 'var(--text-main)' }}>Yeni İlan Ver</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Kampüsteki diğer öğrencilerin işine yarayacak eşyalarını hemen listele.
        </p>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* İlan Başlığı */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>İlan Başlığı</label>
            <input 
              type="text" 
              placeholder="Örn: Temiz Kullanılmış Fizik 101 Kitabı" 
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none' }}
            />
          </div>

          {/* Kategori ve Fiyat (Yan Yana) */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Kategori</label>
              <select style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none', background: 'white' }}>
                <option>Kitap & Not</option>
                <option>Elektronik</option>
                <option>Ev & Yurt Eşyası</option>
                <option>Hobi & Spor</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Fiyat (TL)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none' }}
              />
            </div>
          </div>

          {/* Kampüs Seçimi */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Teslimat Kampüsü</label>
            <select style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none', background: 'white' }}>
              <option>Merkez Kampüs</option>
              <option>Kuzey Kampüs</option>
              <option>Tıp Fakültesi Kampüsü</option>
            </select>
          </div>

          {/* Fotoğraf Yükleme (Şimdilik Görsel Temsili) */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Ürün Fotoğrafı</label>
            <div style={{ border: '2px dashed #cbd5e1', padding: '2rem', textAlign: 'center', borderRadius: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              📸 Fotoğraf Seç veya Sürükle Bırak
            </div>
          </div>

          {/* Gönder Butonu */}
          <button type="button" className="btn-post" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1rem' }}>
            İlanı Yayına Al
          </button>

        </form>
      </div>
    </main>
  );
};

export default CreateAd;