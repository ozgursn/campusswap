import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myProducts, setMyProducts] = useState([]);

  // --- PREMIUM VE ACİL ÖDEME STATE'LERİ ---
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [checkoutType, setCheckoutType] = useState(''); 

  // 🚨 YENİ: SİLME ONAY MODALI STATE'LERİ
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  // Sembolik kredi kartı inputları
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

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
      toast.warn('🔑 Bu sayfayı görmek için önce giriş yapmalısınız.');
      navigate('/login');
      return;
    }

    const currentUser = JSON.parse(savedUser);
    setUser(currentUser);
    fetchMyProducts(currentUser.id);
  }, [navigate]);

  // 🚨 GÜNCELLENEN SİLME MOTORU (Eski window.confirm kalktı!)
  const openDeleteModal = (productId) => {
    setProductIdToDelete(productId);
    setIsDeleteModalOpen(true); // İlkel confirm yerine kendi şık modalımızı açıyoruz
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false); // Modalı kapat

    try {
      const response = await fetch(`http://localhost:3000/products/${productIdToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      if (response.ok) {
        toast.error('🗑️ İlan başarıyla kaldırıldı.');
        fetchMyProducts(user.id);
      } else {
        toast.error('Silme işlemi başarısız oldu.');
      }
    } catch (err) {
      toast.error('🌐 Sunucuyla bağlantı kurulamadı.');
    }
  };

  const openCheckout = (productId, type) => {
    setSelectedProductId(productId);
    setCheckoutType(type); 
    setIsCheckoutOpen(true);
  };

  const handleCompletePayment = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);

    setTimeout(async () => {
      try {
        const endpoint = checkoutType === 'urgent' ? 'make-urgent' : 'premium';
        const response = await fetch(`http://localhost:3000/products/${selectedProductId}/${endpoint}`, {
          method: 'PATCH',
        });

        if (response.ok) {
          toast.success(`💳 Ödeme Başarılı! 3D Secure Onayı Alındı.`);
          setIsCheckoutOpen(false);
          setCardNumber(''); setExpiry(''); setCvv('');
          fetchMyProducts(user.id); 
        } else {
          toast.error('⚠️ İlan güncellenirken bir sorun oluştu.');
        }
      } catch (error) {
        toast.error('🌐 Sunucuyla bağlantı kurulamadı.');
      } finally {
        setPaymentLoading(false);
      }
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('👋 Başarıyla çıkış yapıldı.');
    setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 800);
  };

  if (!user) return <div style={{ textAlign: 'center', padding: '5rem', color: 'gray' }}>Yükleniyor...</div>;

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

      {/* Sağ Kart: İlan Listesi */}
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', flex: '1', maxWidth: '600px', border: '1px solid var(--border-color)', textAlign: 'left' }}>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>📦 İlanlarım ({myProducts.length})</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myProducts.length === 0 ? (
            <p style={{ color: 'gray' }}>Henüz bir ürün listelemediniz.</p>
          ) : (
            myProducts.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '0.8rem', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                
                <div onClick={() => navigate(`/product/${item.id}`)} style={{ cursor: 'pointer', flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.3rem 0', color: 'var(--text-main)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-main)'}>{item.title}</h4>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{item.price} TL</span>
                  <span style={{ fontSize: '0.8rem', color: 'gray', marginLeft: '1rem' }}>📍 {item.campus}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '140px' }}>
                  
                  {/* 🚨 SİLME BUTONU: Yeni fonksiyona bağlandı */}
                  <button 
                    onClick={() => openDeleteModal(item.id)}
                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', width: '100%' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#fca5a5'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#fee2e2'}
                  >
                    🗑️ Sil
                  </button>

                  {!item.isPremium ? (
                    <button onClick={() => openCheckout(item.id, 'premium')} style={{ background: '#FFB703', color: '#0D1F16', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', width: '100%' }}>🌟 Öne Çıkar</button>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#1B4332', fontWeight: 'bold', textAlign: 'center', background: '#D8F3DC', padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid #52B788' }}>🚀 Öne Çıkarıldı</span>
                  )}

                  {!item.isUrgent ? (
                    <button onClick={() => openCheckout(item.id, 'urgent')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', width: '100%' }}>⚡ Acil Satılık Yap</button>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#7f1d1d', fontWeight: 'bold', textAlign: 'center', background: '#ffeeee', padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid #fca5a5' }}>🚨 Acil Modunda</span>
                  )}

                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 💳 DİNAMİK ÖDEME MODALI (Aynen Kalıyor) */}
      {isCheckoutOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#0D1F16', fontSize: '1.2rem' }}>{checkoutType === 'urgent' ? '⚡ Acil Satılık İlan Dopingi' : '🌟 Premium İlan Dopingi'}</h3>
              <button onClick={() => setIsCheckoutOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>
              {checkoutType === 'urgent' ? 'İlanınızın push bildirimiyle fırlatılması için sembolik doping ücreti: ' : 'İlanınızın en üst sırada listelenmesi için sembolik doping ücreti: '}
              <strong>{checkoutType === 'urgent' ? '29.90 TL' : '19.90 TL'}</strong>
            </p>
            <form onSubmit={handleCompletePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" required placeholder="Kart Üzerindeki İsim" style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.4rem' }} />
              <input type="text" required placeholder="Kart Numarası" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.4rem' }} />
              {/* 💳 Genişliği Sabitlenen ve Kibarlaştırılan SKT/CVV Alanı */}
<div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '220px' }}>
  <input 
    type="text" 
    required 
    placeholder="MM/YY" 
    value={expiry} 
    onChange={(e) => setExpiry(e.target.value)} 
    style={{ flex: 1, minWidth: 0, padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.4rem' }} 
  />
  <input 
    type="text" 
    required 
    maxLength="3" 
    placeholder="CVV" 
    style={{ flex: 1, minWidth: 0, padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.4rem' }} 
  />
</div>
              <button type="submit" disabled={paymentLoading} style={{ background: '#2D6A4F', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
                {paymentLoading ? '🔒 Güvenli Ödeme Yapılıyor...' : `💳 ${checkoutType === 'urgent' ? '29.90' : '19.90'} TL Öde`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🚨 YENİ: MODERN SİLME ONAY MODALI */}
      {isDeleteModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', width: '360px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🗑️</div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.25rem' }}>İlanı Silmek İstiyor Musunuz?</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Bu işlem geri alınamaz. Seçtiğiniz ilan kampüs vitrininden tamamen kaldırılacaktır.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', flex: 1 }}
              >
                Vazgeç
              </button>
              <button 
                onClick={handleConfirmDelete} 
                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', flex: 1 }}
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default Profile;