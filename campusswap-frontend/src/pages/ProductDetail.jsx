import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 🚨 KİLİT IMPORT: Modern bildirim kütüphanesini dahil ediyoruz
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Giriş yapan kullanıcının bilgisi
  const savedUser = localStorage.getItem('user');
  const currentUser = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('İlan yüklenemedi:', err);
        setLoading(false);
      });
  }, [id]);

  // E-POSTA İLETİŞİM MOTORU (Outlook Türkçe Karakter Çözümlü)
  const handleContactSeller = () => {
    // 🚨 ESKİ ALERT YERİNE MODERN UYARI
    if (!currentUser) {
      toast.warn('🔑 Satıcıyla iletişime geçebilmek için önce giriş yapmalısınız.');
      navigate('/login');
      return;
    }

    const sellerEmail = product.user?.email;
    // 🚨 ESKİ ALERT YERİNE MODERN HATA BİLDİRİMİ
    if (!sellerEmail) {
      toast.error('❌ Satıcının iletişim bilgisine şu an ulaşılamıyor.');
      return;
    }

    const subjectText = `CampusSwap - ${product.title} Ilandiniz Hakkinda`; 
    
    // Gövde metni
    const bodyText = `Merhaba,\n\nCampusSwap platformunda yayinladiginiz "${product.title}" baslikli ilaninizla ilgileniyorum. Urun hala satilik mi? Kampuste ne zaman ve nerede bulusabiliriz?\n\nIyi calismalar,\n${currentUser.name}`;

    // Outlook'un kafasını karıştırmamak için en standart URI encoding işlemini yapıyoruz
    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(bodyText);

    // Tetikleme
    window.location.href = `mailto:${sellerEmail}?subject=${subject}&body=${body}`;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: 'gray' }}>İlan yükleniyor...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '5rem', color: 'gray' }}>İlan bulunamadı.</div>;

  return (
    <main className="main-content" style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1.5rem' }}>
      
      <div style={{ display: 'flex', gap: '3rem', background: 'white', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
        
        {/* Sol Taraf: Ürün Fotoğrafı */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <img src={product.imageUrl || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500'} alt={product.title} style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', borderRadius: '1rem' }} />
        </div>

        {/* Sağ Taraf: Ürün Bilgileri ve İletişim */}
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: '600' }}>{product.category}</span>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginTop: '1rem', marginBottom: '0.5rem' }}>{product.title}</h2>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '1.5rem' }}>{product.price} TL</p>
            
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-muted)' }}>
              <p>📍 <strong>Kampüs:</strong> {product.campus}</p>
              <p>👤 <strong>Satıcı:</strong> {product.user?.name || 'Onaylı Kampüs Üyesi'}</p>
              <p>📅 <strong>Yayınlanma Tarihi:</strong> {new Date(product.createdAt).toLocaleDateString('tr-TR')}</p>
            </div>
          </div>

          {/* İletişime Geç Butonu */}
          {currentUser?.id !== product.userId ? (
            <button onClick={handleContactSeller} className="btn-post" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '0.8rem', marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              📧 Satıcıyla İletişime Geç
            </button>
          ) : (
            <p style={{ color: 'gray', fontStyle: 'italic', marginTop: '2rem', textAlign: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>Bu ilan size ait.</p>
          )}
        </div>

      </div>
    </main>
  );
};

export default ProductDetail;