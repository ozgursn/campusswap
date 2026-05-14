import React from 'react';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Üstteki Küçük Havalı Etiket */}
        <div className="hero-badge">
          <span>🎓 Sadece Onaylı Öğrenciler</span>
        </div>

        {/* Ana Başlık ve Slogan */}
        <h1 className="hero-title">
          Kargo Bekleme, <br />
          <span className="text-highlight">Kantinde Buluş!</span>
        </h1>

        {/* Alt Açıklama */}
        <p className="hero-subtitle">
          İhtiyacın olan ders kitabını, laboratuvar malzemesini veya ev eşyasını 
          kendi kampüsündeki öğrencilerden anında ve güvenle devral.
        </p>

        {/* İstatistikler / Vurgular */}
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-icon">⚡</span>
            <div>
              <strong>0 TL</strong>
              <p>Kargo Ücreti</p>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-icon">🤝</span>
            <div>
              <strong>%100</strong>
              <p>Elden Teslimat</p>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-icon">🔒</span>
            <div>
              <strong>.edu.tr</strong>
              <p>Güvenli Ağ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;