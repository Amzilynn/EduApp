import React from 'react';
import './ProgressStars.css';

const ProgressStars = ({ total, current }) => {
  return (
    <div className="progress-stars">
      {Array.from({ length: total }).map((_, i) => (
        <span 
          key={i} 
          className={`star-unit ${i < current ? 'earned' : ''}`}
        >
          {i < current ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

export default ProgressStars;
