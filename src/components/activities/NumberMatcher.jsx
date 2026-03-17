import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useSettings } from '../../context/SettingsContext';
import QuantityIllustration from '../illustrations/QuantityIllustration';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Number Matcher has NO audio per CDC spec

function NumberCard({ num, isPlaced }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `num-${num}`,
    disabled: isPlaced,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.1) rotate(3deg)` }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, touchAction: 'none' }}
      {...(isPlaced ? {} : listeners)}
      {...(isPlaced ? {} : attributes)}
    >
      <div
        className="w-16 h-16 rounded-[14px] flex items-center justify-center font-black text-3xl text-[#2D2D2D] cursor-grab active:cursor-grabbing select-none border-[3px] transition-all"
        style={{
          background: isPlaced ? '#d0d0d0' : '#FFD93D',
          borderColor: isPlaced ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.15)',
          boxShadow: isDragging ? '0 12px 30px rgba(0,0,0,0.25)' : 'var(--shadow-card)',
          opacity: isPlaced ? 0.4 : 1,
        }}
      >
        {num}
      </div>
    </div>
  );
}

function QuantityZone({ pair, placedNumber, feedbackState }) {
  const { setNodeRef, isOver } = useDroppable({ id: `zone-${pair.number}` });
  const isCorrect = feedbackState === 'correct';
  const isError = feedbackState === 'error';

  // Build count array
  const items = Array(pair.number).fill(pair.object);

  return (
    <div
      ref={setNodeRef}
      className="rounded-[20px] p-4 flex flex-col items-center gap-3 border-[3px] transition-all duration-200"
      style={{
        background: isCorrect ? 'rgba(107,203,119,0.2)' : isOver ? 'rgba(107,203,119,0.2)' : 'rgba(107,203,119,0.06)',
        borderColor: isCorrect ? '#4CAF50' : isError ? '#FF6B6B' : isOver ? '#6BCB77' : '#C5E1A5',
        borderStyle: placedNumber !== null || isOver ? 'solid' : 'dashed',
        boxShadow: 'var(--shadow-card)',
        animation: isError ? 'gentleShake 400ms ease-in-out' : isCorrect ? 'starBurst 400ms ease-in-out' : 'none',
        minWidth: '110px',
      }}
    >
      {/* Visual Qty */}
      <div className="flex flex-wrap gap-1 justify-center max-w-[130px]">
        {items.map((type, i) => (
          <QuantityIllustration key={i} type={type} size={28} />
        ))}
      </div>

      {/* Drop slot */}
      {placedNumber !== null ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
          className="w-12 h-12 rounded-[10px] flex items-center justify-center font-black text-2xl"
          style={{ background: '#6BCB77', color: 'white', border: '2px solid rgba(0,0,0,0.1)' }}
        >
          {placedNumber} {isCorrect ? '✓' : ''}
        </motion.div>
      ) : (
        <div
          className="w-12 h-12 rounded-[10px] flex items-center justify-center border-2 border-dashed"
          style={{ borderColor: '#C5E1A5', background: 'white' }}
        >
          <span className="text-2xl text-gray-300">?</span>
        </div>
      )}
    </div>
  );
}

export default function NumberMatcher({ activity, onComplete }) {
  const { settings } = useSettings();
  const isAr = settings.language === 'ar';
  const [roundIndex, setRoundIndex] = useState(0);
  const [placements, setPlacements] = useState({}); // zoneKey -> number
  const [feedback, setFeedback] = useState({}); // zoneKey -> 'correct'|'error'|null
  const [activeId, setActiveId] = useState(null);

  const [shuffledBank, setShuffledBank] = useState([]);
  const [shuffledZones, setShuffledZones] = useState([]);

  const round = activity.rounds[roundIndex];
  const totalRounds = activity.rounds.length;

  useEffect(() => {
    if (round) {
      setShuffledBank(shuffle([...round.pairs]));
      setShuffledZones(shuffle([...round.pairs]));
      setPlacements({});
      setFeedback({});
    }
  }, [roundIndex, activity]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  function handleDragStart({ active }) {
    setActiveId(active.id);
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over) return;

    const numId = active.id; // 'num-3'
    const zoneId = over.id;  // 'zone-3'

    const num = parseInt(numId.replace('num-', ''));
    const zoneNum = parseInt(zoneId.replace('zone-', ''));

    if (feedback[zoneId] === 'correct') return; // Already correct

    if (num === zoneNum) {
      const newPlacements = { ...placements, [zoneId]: num };
      setPlacements(newPlacements);
      setFeedback(prev => ({ ...prev, [zoneId]: 'correct' }));

      // Check all placed in round
      const allPlaced = round.pairs.every(p => newPlacements[`zone-${p.number}`] !== undefined);
      if (allPlaced) {
        setTimeout(() => {
          if (roundIndex < totalRounds - 1) {
            setRoundIndex(i => i + 1);
            setPlacements({});
            setFeedback({});
          } else {
            onComplete();
          }
        }, 1000);
      }
    } else {
      setFeedback(prev => ({ ...prev, [zoneId]: 'error' }));
      setTimeout(() => {
        setFeedback(prev => ({ ...prev, [zoneId]: null }));
      }, 600);
    }
  }

  const placedNumbers = Object.values(placements);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-6 pb-4">
        {/* Round progress */}
        <div className="flex gap-2 justify-center">
          {activity.rounds.map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full transition-all" style={{
              background: i < roundIndex ? '#6BCB77' : i === roundIndex ? '#FFD93D' : '#e0e0e0'
            }} />
          ))}
        </div>

        {/* Round label */}
        <div className="text-center">
          <span className="inline-block px-4 py-2 rounded-full font-bold text-base"
            style={{ background: '#FFF3D4', border: '2px solid rgba(0,0,0,0.06)' }}>
            {isAr ? `الجولة ${roundIndex + 1}` : `Manche ${roundIndex + 1}`}
          </span>
        </div>

        {/* Number bank (shuffled) */}
        <div className="flex flex-wrap gap-3 justify-center py-2">
          {shuffledBank.map(pair => (
            <NumberCard
              key={pair.number}
              num={pair.number}
              isPlaced={placedNumbers.includes(pair.number)}
            />
          ))}
        </div>

        {/* Quantity drop zones (shuffled) */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {shuffledZones.map(pair => (
            <QuantityZone
              key={pair.number}
              pair={pair}
              placedNumber={placements[`zone-${pair.number}`] ?? null}
              feedbackState={feedback[`zone-${pair.number}`] || null}
            />
          ))}
        </div>

        {/* No-audio notice */}
        <p className="text-center text-sm text-[#aaa]">
          {isAr ? '🔇 هذا النشاط بدون صوت' : '🔇 Activité silencieuse'}
        </p>
      </div>
    </DndContext>
  );
}
