import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Güvenlik Kontrolü: .edu.tr uzantısı
    if (!email.endsWith('.edu.tr')) {
      setError('Sadece .edu.tr uzantılı üniversite e-postaları ile işlem yapılabilir.');
      return;
    }

    if (isRegister) {
      // --- KAYIT OLMA AKIŞI ---
      try {
        const response = await fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
          setIsRegister(false); // Kullanıcıyı giriş yapma sekmesine geçir
          setPassword(''); // Şifre alanını temizle
        } else {
          // Backend'den gelen hata mesajını göster (Örn: "Bu e-posta zaten kullanımda")
          setError(data.message || 'Kayıt sırasında bir hata oluştu.');
        }
      } catch (err) {
        console.error('Kayıt hatası:', err);
        setError('Sunucuya bağlanılamadı.');
      }
    } else {
      // --- GİRİŞ YAPMA AKIŞI (Şimdilik Simüle Ediyoruz) ---
      alert('Giriş başarılı!');
      navigate('/');
    }
  };

  return (
    <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 1.5rem' }}>
      <div style={{ 
        background: 'white', 
        padding: '3rem 2.5rem', 
        borderRadius: '1.5rem', 
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '450px',
        border: '1px solid var(--border-color)'
      }}>
        
        {/* Üst Sekmeler */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
          <button 
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            style={{ flex: 1, background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: isRegister ? '500' : '700', color: isRegister ? 'var(--text-muted)' : 'var(--text-main)', cursor: 'pointer' }}
          >
            Giriş Yap
          </button>
          <button 
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            style={{ flex: 1, background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: isRegister ? '700' : '500', color: isRegister ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer' }}
          >
            Kayıt Ol
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            {isRegister ? 'Kampüs Ağına Katıl' : 'Hesabına Giriş Yap'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isRegister ? 'Sadece doğrulanmış üniversite öğrencileri.' : 'Kaldığın yerden devam et.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {isRegister && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Ad Soyad</label>
              <input 
                type="text" required placeholder="Örn: Ali Yılmaz" 
                value={name} onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none', backgroundColor: '#f8fafc' }} 
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Üniversite E-Postası</label>
            <input 
              type="email" required placeholder="ogrenci@universite.edu.tr" 
              value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 1rem', border: error ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none', backgroundColor: '#f8fafc' }} 
            />
            {error && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>{error}</span>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Şifre</label>
            <input 
              type="password" required placeholder="••••••••" 
              value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none', backgroundColor: '#f8fafc' }} 
            />
          </div>

          <button type="submit" className="btn-post" style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1rem', width: '100%', borderRadius: '0.5rem' }}>
            {isRegister ? 'Hesap Oluştur' : 'Giriş Yap'}
          </button>

        </form>
      </div>
    </main>
  );
};

export default Login;