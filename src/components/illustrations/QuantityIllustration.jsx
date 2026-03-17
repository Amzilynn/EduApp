import React from 'react';

/**
 * Premium SVG Quantity Illustrations
 * Renders Apples, Stars, or Balloons with details
 */
export default function QuantityIllustration({ type = 'apple', size = 40 }) {
  const [useFallback, setUseFallback] = React.useState(false);
  const imagePath = `/assets/images/${type}.png`;
  
  const s = size;
  const stroke = "#2D2D2D";
  const strokeW = 4;

  if (!useFallback) {
    return (
      <img 
        src={imagePath} 
        alt={type}
        width={s}
        height={s}
        className="object-contain"
        onError={() => setUseFallback(true)}
      />
    );
  }

  switch (type) {
    case 'apple':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Stem */}
          <path d="M50 25C50 15 55 10 60 8" stroke="#4A2D1B" strokeWidth="4" strokeLinecap="round" />
          {/* Leaf */}
          <path d="M50 20C40 10 30 15 32 25C34 35 48 25 50 20Z" fill="#6BCB77" stroke={stroke} strokeWidth="2" />
          {/* Fruit */}
          <path d="M50 30C35 30 20 40 20 60C20 85 40 92 50 92C60 92 80 85 80 60C80 40 65 30 50 30Z" fill="#FF6B6B" stroke={stroke} strokeWidth={strokeW} />
          {/* Highlight */}
          <circle cx="35" cy="50" r="6" fill="white" fillOpacity="0.3" />
        </svg>
      );
    case 'star':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5L63 35L95 35L70 55L80 85L50 70L20 85L30 55L5 35L37 35L50 5Z" fill="#FFD93D" stroke={stroke} strokeWidth={strokeW} strokeLinejoin="round" />
          {/* Detail */}
          <path d="M50 20L58 38H78L62 50L68 70L50 60Z" fill="white" fillOpacity="0.25" />
        </svg>
      );
    case 'balloon':
      return (
        <svg width={s} height={s} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* String */}
          <path d="M50 85Q50 95 45 105" stroke={stroke} strokeWidth="2" strokeDasharray="4 4" />
          {/* Balloon body */}
          <ellipse cx="50" cy="45" rx="35" ry="40" fill="#4D96FF" stroke={stroke} strokeWidth={strokeW} />
          {/* Bottom knot */}
          <path d="M42 85L58 85L50 78Z" fill="#4D96FF" stroke={stroke} strokeWidth="2" />
          {/* Shine */}
          <ellipse cx="35" cy="30" rx="10" ry="8" fill="white" fillOpacity="0.35" transform="rotate(-30 35 30)" />
        </svg>
      );
    default:
      return <span>❓</span>;
  }
}
