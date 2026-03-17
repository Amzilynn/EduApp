import React from 'react';
import Mascot from '../Mascot';
import './LevelCard.css';

const LevelCard = ({ level, selected, onClick, type }) => {
  const getAge = (lvl) => {
    if (lvl === 3) return "3 ans";
    if (lvl === 4) return "4 ans";
    if (lvl === 5) return "5 ans";
    return "";
  };

  return (
    <div 
      className={`level-card ${selected ? 'selected' : ''}`} 
      onClick={onClick}
      data-level={level}
    >
      <div className="mascot-badge">
        <Mascot type={type} state={selected ? 'success' : 'idle'} />
      </div>
      <div className="age-badge">
        {getAge(level)}
      </div>
    </div>
  );
};

export default LevelCard;
