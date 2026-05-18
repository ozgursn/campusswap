import React from 'react';

const Login = () => {
  return (
    <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '1rem' }}>Giriş Yap</h2>
        <p style={{ color: 'gray', marginBottom: '2rem' }}>Sadece .edu.tr uzantılı e-postalar.</p>
        
        <input 
          type="email" 
          placeholder="ogrenci@universite.edu.tr" 
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
        />
        <input 
          type="password" 
          placeholder="Şifre" 
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1.5rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
        />
        
        <button className="btn-post" style={{ width: '100%' }}>Giriş Yap</button>
      </div>
    </main>
  );
};

export default Login;