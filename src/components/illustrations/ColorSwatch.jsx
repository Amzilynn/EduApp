import React from 'react';

/**
 * Inline SVG color swatch illustrations
 * Bold, rounded circles with shine effect
 */
export default function ColorSwatch({ color = '#FF4444', size = 80, label }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" fill={color} stroke="#2D2D2D" strokeWidth="5.5" />
      {/* Shine highlight */}
      <ellipse cx="34" cy="34" rx="14" ry="10" fill="rgba(255,255,255,0.40)" transform="rotate(-30 34 34)" />
      {/* Bottom shadow */}
      <ellipse cx="62" cy="68" rx="10" ry="7" fill="rgba(0,0,0,0.10)" />
    </svg>
  );
}
