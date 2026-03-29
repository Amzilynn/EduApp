import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
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

function DraggableLetter({ letterObj }) {
  const { speak } = useSpeech();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: letterObj.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.1)`, zIndex: 100 }
    : {};

  return (
    <motion.button
      ref={setNodeRef}
      style={{ ...style, touchAction: 'none' }}
      {...listeners}
      {...attributes}
      onPointerDown={(e) => {
        if (!isDragging) speak(letterObj.letter);
        if (listeners?.onPointerDown) listeners.onPointerDown(e);
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={`pool-letter-btn ${isDragging ? 'dragging' : ''}`}
    >
      {letterObj.letter}
    </motion.button>
  );
}

function DroppableSlot({ index, letterObj, isError, isCorrect, onRemove }) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${index}` });

  return (
    <motion.div
      ref={setNodeRef}
      whileTap={letterObj ? { scale: 0.95 } : {}}
      onClick={() => letterObj && onRemove(letterObj, index)}
      className={`letter-slot ${letterObj ? 'filled' : ''} ${isOver && !letterObj ? 'over' : ''} ${isError ? 'error' : ''}`}
      style={{
        background: isCorrect ? 'var(--c-grass)' : letterObj ? 'var(--bg-warm-white)' : 'white',
        color: isCorrect || letterObj ? 'var(--text-dark)' : '#ccc',
        borderColor: isOver && !letterObj ? 'var(--level-primary)' : 'var(--level-primary-light)'
      }}
    >
      {letterObj ? letterObj.letter : ''}
    </motion.div>
  );
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
    setLetterPool(shuffle(allLetters.map((l, i) => ({ id: `pool-${l}-${i}`, letter: l }))));
    setPlaced(Array(currentWord.word.length).fill(null));
    setFeedbackState(null);
    if (onProgress) onProgress(wordIndex);
  }, [wordIndex, currentWord]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  function handleDragEnd({ active, over }) {
    if (!over || feedbackState) return;

    const letterObj = letterPool.find(l => l.id === active.id);
    if (!letterObj) return;

    const slotId = over.id;
    if (slotId.startsWith('slot-')) {
      const slotIdx = parseInt(slotId.split('-')[1]);
      
      if (placed[slotIdx]) return; 

      const newPlaced = [...placed];
      newPlaced[slotIdx] = letterObj;
      setPlaced(newPlaced);

      const remainingInPool = letterPool.filter(l => l.id !== letterObj.id);

      if (newPlaced.every(v => v !== null)) {
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
              setLetterPool(prev => shuffle([...remainingInPool, ...newPlaced]));
              setPlaced(Array(currentWord.word.length).fill(null));
              setFeedbackState(null);
            }, 1000);
          }
        }, 400);
      }
    }
  }

  function handleRemoveLetter(letterObj, idx) {
    if (feedbackState === 'correct') return;
    const newPlaced = [...placed];
    newPlaced[idx] = null;
    setPlaced(newPlaced);
    setLetterPool(prev => shuffle([...prev, letterObj]));
  }

  if (!currentWord) return null;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
        <div className="word-slots-row" dir={isAr ? "rtl" : "ltr"}>
          {placed.map((filled, i) => (
            <DroppableSlot
              key={i}
              index={i}
              letterObj={filled}
              isError={feedbackState === 'error'}
              isCorrect={feedbackState === 'correct'}
              onRemove={handleRemoveLetter}
            />
          ))}
        </div>

        {/* Pool Section */}
        <div className="letter-pool-grid" dir={isAr ? "rtl" : "ltr"}>
          <AnimatePresence>
            {letterPool.map(letterObj => {
              const insidePlaced = placed.find(p => p?.id === letterObj.id);
              if (insidePlaced) return null;
              
              return (
                <DraggableLetter
                  key={letterObj.id}
                  letterObj={letterObj}
                />
              );
            })}
          </AnimatePresence>
        </div>

        <p className="interaction-tip">
          {isAr ? 'اسحب الحروف لترتيب الكلمة' : 'Glisse les lettres pour former le mot'}
        </p>
      </div>
    </DndContext>
  );
}
