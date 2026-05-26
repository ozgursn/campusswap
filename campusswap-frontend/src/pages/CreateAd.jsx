import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 🚨 KİLİT IMPORT: Modern bildirim motorunu sayfaya dahil ediyoruz
import { toast } from 'react-toastify';

const CreateAd = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kitap');
  const [campus, setCampus] = useState('Merkez Kampüs');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null); // Dosyanın kendisini tutacak state

  const handleSubmit = async (e) => {
    e.preventDefault();

    const savedUser = localStorage.getItem('user');
    const currentUser = savedUser ? JSON.parse(savedUser) : null;

    if (!currentUser) {
      toast.error('❌ İlan verebilmek için önce giriş yapmalısınız!');
      navigate('/login');
      return;
    }

    // Fotoğraf gönderebilmek için standart JSON yerine FormData kullanıyoruz
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('campus', campus);
    formData.append('price', Number(price));
    formData.append('userId', currentUser.id);
    
    // Eğer kullanıcı bir fotoğraf seçtiyse pakete ekle
    if (imageFile) {
      formData.append('image', imageFile); 
    }

    try {
      // ⏳ Bilgi: İstek başladığında kullanıcıya ufak bir yükleniyor havası verebiliriz, ama doğrudan fetch'e geçiyoruz
      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        // DİKKAT: FormData kullanırken 'Content-Type'ı elinle yazmıyorsun, tarayıcı otomatik ayarlar!
        body: formData, 
      });

      if (response.ok) {
        // 🚀 Başarılı İlan Ekleme Bildirimi
        toast.success('🎉 İlanınız fotoğrafıyla birlikte başarıyla kampüs vitrinine eklendi!');
        navigate('/');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || '❌ İlan eklenirken bir hata oluştu. Verileri kontrol edin.');
      }
    } catch (error) {
      console.error("İlan eklenirken hata oluştu:", error);
      toast.error('🌐 Sunucuya bağlanılamadı. Backend API ayakta mı?');
    }
  };

  return (
    <main className="main-content" style={{ display: 'flex', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px', border: '1px solid var(--border-color)' }}>
        
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '1.5rem', textAlign: 'center' }}>📦 Yeni İlan Oluştur</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Ürün Adı</label>
            <input type="text" required placeholder="Örn: Temel Fizik Kitabı" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', backgroundColor: '#f8fafc' }}>
                <option value="Kitap">📚 Kitap</option>
                <option value="Elektronik">⚡ Elektronik</option>
                <option value="Eşya">🪑 Ev/Oda Eşyası</option>
                <option value="Giyim">👕 Giyim</option>
                <option value="Diğer">🌀 Diğer</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Kampüs</label>
              <select value={campus} onChange={(e) => setCampus(e.target.value)} style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', backgroundColor: '#f8fafc' }}>
                <option value="Merkez Kampüs">Merkez Kampüs</option>
                <option value="Mühendislik Kampüsü">Mühendislik Kampüsü</option>
                <option value="Tıp Fakültesi">Tıp Fakültesi</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Fiyat (TL)</label>
            <input type="number" required placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} />
          </div>

          {/* DOSYA SEÇME ALANI */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Ürün Fotoğrafı</label>
            <input 
              type="file" 
              accept="image/*" // Sadece resim dosyalarını seçtirir
              required // Şimdilik zorunlu yapalım test için
              onChange={(e) => setImageFile(e.target.files[0])} // Seçilen ilk dosyayı state'e atar
              style={{ width: '100%', padding: '0.5rem', border: '1px dashed #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer' }} 
            />
          </div>

          <button type="submit" className="btn-post" style={{ padding: '1rem', fontSize: '1rem', width: '100%', borderRadius: '0.5rem', marginTop: '1rem' }}>
            🚀 İlanı Yayınla
          </button>

        </form>
      </div>
    </main>
  );
};

export default CreateAd;