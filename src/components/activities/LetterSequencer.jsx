import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';
import { useSettings } from '../../context/SettingsContext';
import './LetterSequencer.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LetterSequencer({ activity, onComplete, onProgress }) {
  const { settings } = useSettings();
  const { speak } = useSpeech();
  const isAr = settings.language === 'ar';

  const [wordsList, setWordsList] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [placed, setPlaced] = useState([]); 
  const [letterPool, setLetterPool] = useState([]);
  const [feedbackState, setFeedbackState] = useState(null); 
  const [bounceId, setBounceId] = useState(null);

  useEffect(() => {
    if (activity && activity.words) {
      const limit = activity.trials || activity.words.length;
      setWordsList(shuffle(activity.words).slice(0, limit));
      setWordIndex(0);
    }
  }, [activity]);

  const currentWord = wordsList[wordIndex];
  const totalWords = wordsList.length;

  useEffect(() => {
    if (!currentWord) return;
    const allLetters = [...currentWord.letters, ...(currentWord.distractors || [])];
    setLetterPool(shuffle(allLetters.map((l, i) => ({ id: `${l}-${i}`, letter: l }))));
    setPlaced([]);
    setFeedbackState(null);
    if (onProgress) onProgress(wordIndex);
  }, [wordIndex, currentWord]);

  function handleLetterTap(letterObj) {
    if (placed.length >= currentWord.word.length || feedbackState) return;
    
    speak(letterObj.letter);
    setBounceId(letterObj.id);
    setTimeout(() => setBounceId(null), 300);

    const newPlaced = [...placed, letterObj];
    setPlaced(newPlaced);
    setLetterPool(prev => prev.filter(l => l.id !== letterObj.id));

    if (newPlaced.length === currentWord.word.length) {
      const formed = newPlaced.map(l => l.letter).join('');
      setTimeout(() => {
        if (formed === currentWord.word) {
          setFeedbackState('correct');
          speak(isAr ? `أحسنت! ${currentWord.hintLabel}` : `Bravo ! ${currentWord.hintLabel}`);
          setTimeout(() => {
            if (wordIndex < totalWords - 1) {
              setWordIndex(i => i + 1);
            } else {
              onComplete();
            }
          }, 1500);
        } else {
          setFeedbackState('error');
          speak(isAr ? 'حاول مرة أخرى!' : 'Essaie encore !');
          setTimeout(() => {
            setLetterPool(prev => shuffle([...prev, ...newPlaced]));
            setPlaced([]);
            setFeedbackState(null);
          }, 1000);
        }
      }, 400);
    }
  }

  function handleRemoveLetter(letterObj, idx) {
    if (feedbackState === 'correct') return;
    const newPlaced = placed.filter((_, i) => i !== idx);
    setPlaced(newPlaced);
    setLetterPool(prev => shuffle([...prev, letterObj]));
  }

  if (!currentWord) return null;

  return (
    <div className="letter-sequencer-container">
      {/* Hint Image Section */}
      <motion.div
        key={wordIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="word-hint-card"
      >
        <span className="hint-emoji float">{currentWord.hint}</span>
        <span className="hint-label">{currentWord.hintLabel}</span>
      </motion.div>

      {/* Slots Section */}
      <div className="word-slots-row">
        {currentWord.word.split('').map((_, i) => {
          const filled = placed[i];
          const isError = feedbackState === 'error';
          const isCorrect = feedbackState === 'correct';
          
          return (
            <motion.div
              key={i}
              whileTap={filled ? { scale: 0.95 } : {}}
              onClick={() => filled && handleRemoveLetter(filled, i)}
              className={`letter-slot ${filled ? 'filled' : ''} ${isError ? 'error' : ''}`}
              style={{
                background: isCorrect ? 'var(--c-grass)' : filled ? 'var(--bg-warm-white)' : 'white',
                color: isCorrect || filled ? 'var(--text-dark)' : '#ccc'
              }}
            >
              {filled ? filled.letter : ''}
            </motion.div>
          );
        })}
      </div>

      {/* Pool Section */}
      <div className="letter-pool-grid">
        <AnimatePresence>
          {letterPool.map(letterObj => (
            <motion.button
              key={letterObj.id}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: bounceId === letterObj.id ? -10 : 0
              }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => handleLetterTap(letterObj)}
              className="pool-letter-btn"
            >
              {letterObj.letter}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <p className="interaction-tip">
        {isAr ? 'اضغط على الحروف لترتيب الكلمة' : 'Touche les lettres pour former le mot'}
      </p>
    </div>
  );
}
