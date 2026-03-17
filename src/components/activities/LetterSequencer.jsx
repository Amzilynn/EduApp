import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';
import { useSettings } from '../../context/SettingsContext';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LetterSequencer({ activity, onComplete }) {
  const { settings } = useSettings();
  const { speak } = useSpeech();
  const isAr = settings.language === 'ar';

  const [wordIndex, setWordIndex] = useState(0);
  const [placed, setPlaced] = useState([]); // letters placed in order
  const [letterPool, setLetterPool] = useState([]);
  const [feedbackState, setFeedbackState] = useState(null); // 'correct'|'error'|null
  const [bounceLetter, setBounceLetter] = useState(null);

  const currentWord = activity.words[wordIndex];
  const totalWords = activity.words.length;

  useEffect(() => {
    if (!currentWord) return;
    // Build shuffled letter pool: letters + distractors
    const allLetters = [...currentWord.letters, ...(currentWord.distractors || [])];
    setLetterPool(shuffle(allLetters.map((l, i) => ({ id: `${l}-${i}`, letter: l }))));
    setPlaced([]);
    setFeedbackState(null);
  }, [wordIndex]);

  function handleLetterTap(letterObj) {
    if (placed.length >= currentWord.word.length) return;
    // Play the letter sound
    speak(letterObj.letter);
    setBounceLetter(letterObj.id);
    setTimeout(() => setBounceLetter(null), 300);

    const newPlaced = [...placed, letterObj];
    setPlaced(newPlaced);

    // Remove from pool
    setLetterPool(prev => prev.filter(l => l.id !== letterObj.id));

    // Check if word complete
    if (newPlaced.length === currentWord.word.length) {
      const formed = newPlaced.map(l => l.letter).join('');
      setTimeout(() => {
        if (formed === currentWord.word) {
          setFeedbackState('correct');
          speak(isAr ? `أحسنت! ${currentWord.hintLabel}` : `Bravo ! ${currentWord.hintLabel}`);
          setTimeout(() => {
            if (wordIndex < totalWords - 1) {
              setWordIndex(i => i + 1);
              setFeedbackState(null);
            } else {
              onComplete();
            }
          }, 1500);
        } else {
          setFeedbackState('error');
          speak(isAr ? 'حاول مرة أخرى!' : 'Essaie encore !');
          // Return all placed letters back to pool
          setTimeout(() => {
            setLetterPool(prev => {
              const returned = newPlaced;
              return shuffle([...prev, ...returned]);
            });
            setPlaced([]);
            setFeedbackState(null);
          }, 800);
        }
      }, 300);
    }
  }

  function handleRemoveLetter(letterObj, idx) {
    const newPlaced = placed.filter((_, i) => i !== idx);
    setPlaced(newPlaced);
    setLetterPool(prev => [...prev, letterObj]);
  }

  if (!currentWord) return null;

  return (
    <div className="flex flex-col items-center gap-6 pb-4">
      {/* Progress */}
      <div className="flex gap-2">
        {activity.words.map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full transition-all" style={{
            background: i < wordIndex ? '#6BCB77' : i === wordIndex ? '#FFD93D' : '#e0e0e0'
          }} />
        ))}
      </div>

      {/* Hint Image + Word */}
      <motion.div
        key={wordIndex}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-2 bg-[#FFF3D4] rounded-[20px] p-6 w-full max-w-sm border-2 border-[rgba(0,0,0,0.06)]"
      >
        <span className="text-6xl float">{currentWord.hint}</span>
        <span className="text-lg font-bold text-[#6B6B6B]">{currentWord.hintLabel}</span>
      </motion.div>

      {/* Word Builder Slots */}
      <div className="flex gap-3 justify-center flex-wrap">
        {currentWord.word.split('').map((targetLetter, i) => {
          const filledLetter = placed[i];
          return (
            <motion.div
              key={i}
              whileTap={filledLetter ? { scale: 0.9 } : {}}
              onClick={() => filledLetter && handleRemoveLetter(filledLetter, i)}
              className="w-14 h-14 rounded-[12px] flex items-center justify-center border-[3px] cursor-pointer text-2xl font-black transition-all"
              style={{
                background: filledLetter ? '#6BCB77' : 'white',
                borderColor: feedbackState === 'correct' ? '#4CAF50'
                            : feedbackState === 'error' ? '#FF6B6B'
                            : filledLetter ? '#4CAF50' : '#C5E1A5',
                color: filledLetter ? 'white' : '#ccc',
                boxShadow: 'var(--shadow-card)',
                animation: feedbackState === 'error' ? 'gentleShake 400ms ease-in-out' : 'none',
              }}
            >
              {filledLetter ? filledLetter.letter : '—'}
            </motion.div>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedbackState === 'correct' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-[#4CAF50] font-black text-2xl"
          >
            🌟 {isAr ? 'ممتاز!' : 'Bravo !'}
          </motion.div>
        )}
        {feedbackState === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-[#FF6B6B] font-bold text-lg"
          >
            {isAr ? '❌ حاول مرة أخرى!' : '❌ Essaie encore !'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter Bank */}
      <div className="flex flex-wrap justify-center gap-3">
        {letterPool.map(letterObj => (
          <motion.button
            key={letterObj.id}
            onClick={() => handleLetterTap(letterObj)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={bounceLetter === letterObj.id ? { scale: [1, 1.3, 0.9, 1], rotate: [-3, 5, -2, 0] } : {}}
            className="w-14 h-14 rounded-[12px] flex items-center justify-center font-black text-2xl text-[#2D2D2D] cursor-pointer select-none"
            style={{
              background: '#FFD93D',
              border: '3px solid rgba(0,0,0,0.12)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {letterObj.letter}
          </motion.button>
        ))}
      </div>

      <p className="text-sm text-[#6B6B6B] text-center">
        {isAr ? 'انقر على الحرف لوضعه • انقر على الحرف الموضوع لإزالته'
               : 'Tapez une lettre pour la placer • Tapez une lettre placée pour la retirer'}
      </p>
    </div>
  );
}
