import React from 'react';
import './Mascot.css';

const Mascot = ({ type = 'sunny', state = 'idle', className = '' }) => {
  const isSunny = type === 'sunny';
  const isRiko = type === 'riko';
  const isLuna = type === 'luna';

  return (
    <div className={`mascot-container ${type} ${state} ${className}`}>
      <svg viewBox="0 0 100 120" className="mascot-svg">
        {/* Shadow */}
        <ellipse cx="50" cy="110" rx="30" ry="5" fill="rgba(0,0,0,0.1)" className="mascot-shadow" />

        <g className="mascot-body-group">
          {isSunny && (
            <>
              {/* Sunny the Chick */}
              <circle cx="50" cy="65" r="35" fill="var(--c-sunshine)" className="body-part body" />
              {/* Mohawk */}
              <path d="M45 30 Q50 15 55 30" fill="var(--c-sunshine)" className="body-part mohawk" />
              {/* Cheeks */}
              <circle cx="35" cy="75" r="5" fill="var(--c-rose)" opacity="0.4" />
              <circle cx="65" cy="75" r="5" fill="var(--c-rose)" opacity="0.4" />
              {/* Eyes */}
              <g className="eyes-group">
                <circle cx="40" cy="65" r="4" fill="var(--text-dark)" className="eye eye-left" />
                <circle cx="60" cy="65" r="4" fill="var(--text-dark)" className="eye eye-right" />
              </g>
              {/* Beak */}
              <path d="M47 72 L53 72 L50 78 Z" fill="var(--c-tangerine)" className="body-part beak" />
              {/* Wings */}
              <path d="M15 65 Q5 55 15 45" fill="var(--c-sunshine)" className="body-part wing wing-left" />
              <path d="M85 65 Q95 55 85 45" fill="var(--c-sunshine)" className="body-part wing wing-right" />
            </>
          )}

          {isRiko && (
            <>
              {/* Riko the Fox */}
              <path d="M20 90 Q50 110 80 90 L85 50 Q50 30 15 50 Z" fill="var(--c-tangerine)" className="body-part body" />
              {/* White chest */}
              <path d="M35 90 Q50 100 65 90 L60 70 Q50 65 40 70 Z" fill="white" opacity="0.8" />
              {/* Ears */}
              <path d="M25 45 L15 20 L40 35 Z" fill="var(--c-tangerine)" className="body-part ear ear-left" />
              <path d="M75 45 L85 20 L60 35 Z" fill="var(--c-tangerine)" className="body-part ear ear-right" />
              {/* Eyes */}
              <g className="eyes-group">
                <circle cx="40" cy="60" r="4" fill="var(--text-dark)" className="eye eye-left" />
                <circle cx="60" cy="60" r="4" fill="var(--text-dark)" className="eye eye-right" />
              </g>
              {/* Nose */}
              <circle cx="50" cy="75" r="3" fill="var(--text-dark)" />
              {/* Tail */}
              <path d="M80 85 Q110 60 90 40" fill="var(--c-tangerine)" stroke="white" strokeWidth="4" className="body-part tail" />
            </>
          )}

          {isLuna && (
            <>
              {/* Luna the Owl */}
              <ellipse cx="50" cy="65" rx="35" ry="40" fill="var(--c-lavender)" className="body-part body" />
              {/* Chest feathers */}
              <path d="M35 70 Q50 85 65 70" fill="rgba(255,255,255,0.3)" />
              <path d="M30 80 Q50 95 70 80" fill="rgba(255,255,255,0.2)" />
              {/* Glasses */}
              <g className="glasses-group">
                <circle cx="38" cy="60" r="10" fill="none" stroke="var(--text-dark)" strokeWidth="2" />
                <circle cx="62" cy="60" r="10" fill="none" stroke="var(--text-dark)" strokeWidth="2" />
                <line x1="48" y1="60" x2="52" y2="60" stroke="var(--text-dark)" strokeWidth="2" />
              </g>
              {/* Eyes */}
              <g className="eyes-group">
                <circle cx="38" cy="60" r="3" fill="var(--text-dark)" className="eye eye-left" />
                <circle cx="62" cy="60" r="3" fill="var(--text-dark)" className="eye eye-right" />
              </g>
              {/* Beak */}
              <path d="M48 70 L52 70 L50 76 Z" fill="var(--c-sunshine)" className="body-part beak" />
              {/* Tuft Ears */}
              <path d="M30 35 L20 25 L40 30" fill="var(--c-lavender)" className="body-part ear-tuft" />
              <path d="M70 35 L80 25 L60 30" fill="var(--c-lavender)" className="body-part ear-tuft" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

export default Mascot;
