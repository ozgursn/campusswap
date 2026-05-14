import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>♻️ CampusSwap</h3>
          <p>Kargo bekleme, kantinde buluş!</p>
        </div>
        <div className="footer-info">
          <p>🔒 Sadece <b>.edu.tr</b> uzantılı e-postalar ile güvenli erişim.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CampusSwap. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;