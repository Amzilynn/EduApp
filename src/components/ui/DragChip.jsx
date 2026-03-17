import React from 'react';
import './DragChip.css';

const DragChip = ({ text, color, dragging, placed, onDragStart, onDragEnd, style }) => {
  return (
    <div 
      className={`drag-chip ${dragging ? 'dragging' : ''} ${placed ? 'placed' : ''}`}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
      style={{ '--chip-color': color, ...style }}
    >
      <span className="chip-dot"></span>
      <span className="chip-text">{text}</span>
    </div>
  );
};

export default DragChip;
