import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ id, image, title, price, campus, category }) => { // id eklendi
  const navigate = useNavigate();

  return (
    // Karta tıklandığında ürün ID'sine göre detay sayfasına yönlendirir
    <div className="product-card" onClick={() => navigate(`/product/${id}`)}>
      <div className="product-image">
        <img src={image || "https://placehold.co/300x200?text=Urun+Resmi"} alt={title} />
        <span className="product-category">{category}</span>
      </div>
      <div className="product-details">
        <h3 className="product-title">{title}</h3>
        <p className="product-campus">📍 {campus}</p>
        <div className="product-footer">
          <span className="product-price">{price} TL</span>
          <button className="btn-view">İncele</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;