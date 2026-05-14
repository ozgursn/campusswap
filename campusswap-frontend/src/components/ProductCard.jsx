import React from 'react';

const ProductCard = ({ image, title, price, campus, category }) => {
  return (
    <div className="product-card">
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