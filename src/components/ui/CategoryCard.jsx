import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ title, icon, color, onClick }) => {
  return (
    <div 
      className="category-card" 
      onClick={onClick}
      style={{ '--category-color': color }}
    >
      <div className="icon-wrap">
        {icon}
      </div>
      <h3 className="category-title">{title}</h3>
      <div className="arrow-icon">→</div>
    </div>
  );
};

export default CategoryCard;
