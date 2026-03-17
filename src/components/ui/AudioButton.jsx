import React from 'react';
import { motion } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';

export default function AudioButton({ text, className = '', size = 40 }) {
  const { speak } = useSpeech();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => speak(text)}
      className={`inline-flex items-center justify-center rounded-full bg-[#4D96FF] text-white shadow-md ${className}`}
      style={{ width: size, height: size, border: '2px solid rgba(0,0,0,0.1)' }}
      title="Écouter / استمع"
      aria-label="Play audio"
    >
      <span style={{ fontSize: size * 0.45 }}>🔊</span>
    </motion.button>
  );
}
