import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myProducts, setMyProducts] = useState([]);

  // --- PREMIUM VE ACİL ÖDEME STATE'LERİ ---
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [checkoutType, setCheckoutType] = useState(''); // 'premium' veya 'urgent' değerlerini tutacak

  // Sembolik kredi kartı inputları
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Sayfa yüklenirken ilanları çeken fonksiyon
  const fetchMyProducts = (userId) => {
    fetch(`http://localhost:3000/products/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setMyProducts(data))
      .catch((err) => console.error("İlanlar yüklenemedi:", err));
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!savedUser || !token) {
      alert('Bu sayfayı görmek için önce giriş yapmalısınız.');
      navigate('/login');
      return;
    }

    const currentUser = JSON.parse(savedUser);
    setUser(currentUser);
    fetchMyProducts(currentUser.id);
  }, [navigate]);

  // GERÇEK SİLME FONKSİYONU
  const handleDelete = async (productId) => {
    if (!window.confirm('Bu ilanı tamamen kaldırmak istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await response.json();

      if (response.ok) {
        alert('İlan başarıyla kaldırıldı.');
        fetchMyProducts(user.id);
      } else {
        alert(data.message || 'Silme işlemi başarısız oldu.');
      }
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Sunucuyla bağlantı kurulamadı.');
    }
  };

  // 🚀 Ödeme penceresini hangi doping türü seçildiyse ona göre açan fonksiyon
  const openCheckout = (productId, type) => {
    setSelectedProductId(productId);
    setCheckoutType(type); // 'premium' veya 'urgent'
    setIsCheckoutOpen(true);
  };

  // Sembolik Ödemeyi Tamamlayıp Backend'e Sinyal Gönderen Dinamik Fonksiyon
  const handleCompletePayment = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);

    // Gerçekçi olsun diye banka onay sürecini 2 saniye simüle ediyoruz
    setTimeout(async () => {
      try {
        // Seçilen türe göre endpoint dinamik olarak belirleniyor
        const endpoint = checkoutType === 'urgent' ? 'make-urgent' : 'premium';

        const response = await fetch(`http://localhost:3000/products/${selectedProductId}/${endpoint}`, {
          method: 'PATCH',
        });

        const data = await response.json();

        if (response.ok) {
          alert(`💳 Ödeme Başarılı! 3D Secure Onayı Alındı.\n⚡ ${data.message || 'İlanınız güncellendi!'}`);
          setIsCheckoutOpen(false);
          
          // Form alanlarını temizle
          setCardNumber('');
          setExpiry('');
          setCvv('');
          
          fetchMyProducts(user.id); // Sayfayı yenilemeden listeyi tazele
        } else {
          alert('Ödeme onaylandı fakat ilan güncellenirken bir sorun oluştu.');
        }
      } catch (error) {
        console.error("Doping ödeme hatası:", error);
        alert('Sunucuyla bağlantı kurulamadı.');
      } finally {
        setPaymentLoading(false);
      }
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Çıkış yapıldı.');
    navigate('/');
    window.location.reload();
  };

  if (!user) {
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Yükleniyor...</div>;
  }

  return (
    <main className="main-content" style={{ display: 'flex', justifyContent: 'center', padding: '3rem 1.5rem', gap: '2rem', flexWrap: 'wrap' }}>
      
      {/* Sol Kart: Profil Bilgileri */}
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', width: '100%', maxWidth: '350px', border: '1px solid var(--border-color)', textAlign: 'center', height: 'fit-content' }}>
        <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>👨‍💻</div>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{user.name}</h2>
        <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', marginBottom: '1.5rem' }}>🎓 Onaylı Üye</p>
        
        <div style={{ textAlign: 'left', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
          <p>📧 <strong>E-posta:</strong> <br/><span style={{ color: 'var(--text-muted)' }}>{user.email}</span></p>
          <p>📍 <strong>Durum:</strong> <br/><span style={{ color: 'var(--text-muted)' }}>Kampüs Ağı Aktif</span></p>
        </div>

        <button onClick={handleLogout} className="btn-view" style={{ width: '100%', marginTop: '2rem', borderColor: '#ef4444', color: '#ef4444', cursor: 'pointer' }}>
          Çıkış Yap
        </button>
      </div>

      {/* Sağ Kart: Güvenli İlan Listesi, Silme, Premium ve ACİL BUTONU */}
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', flex: '1', maxWidth: '600px', border: '1px solid var(--border-color)', textAlign: 'left' }}>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>📦 İlanlarım ({myProducts.length})</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myProducts.length === 0 ? (
            <p style={{ color: 'gray' }}>Henüz bir ürün listelemediniz.</p>
          ) : (
            myProducts.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '0.8rem', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {/* 🚀 DETAY BAĞLANTISI: İlan detayına gitmek için başlık alanını tıklanabilir yaptık */}
                <div onClick={() => navigate(`/product/${item.id}`)} style={{ cursor: 'pointer', flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.3rem 0', color: 'var(--text-main)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-main)'}>{item.title}</h4>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{item.price} TL</span>
                  <span style={{ fontSize: '0.8rem', color: 'gray', marginLeft: '1rem' }}>📍 {item.campus}</span>
                </div>

                {/* İşlem Butonları Bölümü (Dikey Hizalanmış) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '140px' }}>
                  
                  {/* 1. SİLME BUTONU */}
                  <button 
                    onClick={() => handleDelete(item.id)}
                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', width: '100%' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#fca5a5'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#fee2e2'}
                  >
                    🗑️ Sil
                  </button>

                  {/* 2. PREMIUM DOBİNG BUTONU */}
                  {!item.isPremium ? (
                    <button 
                      onClick={() => openCheckout(item.id, 'premium')} // 🚀 Tür paslandı
                      style={{ background: '#FFB703', color: '#0D1F16', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', width: '100%' }}
                    >
                      🌟 Öne Çıkar
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#1B4332', fontWeight: 'bold', textAlign: 'center', background: '#D8F3DC', padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid #52B788' }}>
                      🚀 Öne Çıkarıldı
                    </span>
                  )}

                  {/* 3. ⚡ ACİL SATILIK BUTONU - Ödeme ekranına bağlandı */}
                  {!item.isUrgent ? (
                    <button 
                      onClick={() => openCheckout(item.id, 'urgent')} // 🚀 Tür paslandı
                      style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', width: '100%', transition: 'opacity 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      ⚡ Acil Satılık Yap
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#7f1d1d', fontWeight: 'bold', textAlign: 'center', background: '#ffeeee', padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid #fca5a5' }}>
                      🚨 Acil Modunda
                    </span>
                  )}

                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* 💳 DİNAMİK 3D SECURE ÖDEME POPUP PENCERESİ */}
      {isCheckoutOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              {/* 🚀 Seçilen türe göre dinamik başlık */}
              <h3 style={{ margin: 0, color: '#0D1F16', fontSize: '1.2rem' }}>
                {checkoutType === 'urgent' ? '⚡ Acil Satılık İlan Dopingi' : '🌟 Premium İlan Dopingi'}
              </h3>
              <button onClick={() => setIsCheckoutOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {/* 🚀 Seçilen türe göre dinamik açıklama metni ve ücret */}
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              {checkoutType === 'urgent' 
                ? 'İlanınızın kırmızı flaşörlü dalga animasyonuyla listelenmesi ve anlık bildirim fırlatılması için sembolik doping ücreti: ' 
                : 'İlanınızın kampüs ana sayfasında en üst sırada altın sarısı çerçeveyle listelenmesi için sembolik doping ücreti: '
              }
              <strong>{checkoutType === 'urgent' ? '19.90 TL' : '29.90 TL'}</strong>
            </p>

            <form onSubmit={handleCompletePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Kart Üzerindeki İsim</label>
                <input type="text" required placeholder="Özgür Yılmaz" style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.4rem', fontSize: '0.9rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Kart Numarası</label>
                <input type="text" required maxLength="19" placeholder="4355 4400 1234 1920" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.4rem', fontSize: '0.9rem' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Son Kullanma</label>
                  <input type="text" required placeholder="MM/YY" maxLength="5" value={expiry} onChange={(e) => setExpiry(e.target.value)} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.4rem', fontSize: '0.9rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>CVV</label>
                  <input type="password" required maxLength="3" placeholder="***" value={cvv} onChange={(e) => setCvv(e.target.value)} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.4rem', fontSize: '0.9rem' }} />
                </div>
              </div>

              {/* 🚀 Dinamik buton yazısı */}
              <button 
                type="submit" 
                disabled={paymentLoading}
                style={{ background: '#2D6A4F', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.95rem', cursor: paymentLoading ? 'not-allowed' : 'pointer', marginTop: '1rem', opacity: paymentLoading ? 0.7 : 1 }}
              >
                {paymentLoading ? '🔒 Güvenli Ödeme Yapılıyor...' : `💳 ${checkoutType === 'urgent' ? '19.90' : '29.90'} TL Öde ve Aktif Et`}
              </button>
            </form>

          </div>
        </div>
      )}

    </main>
  );
};

export default Profile;