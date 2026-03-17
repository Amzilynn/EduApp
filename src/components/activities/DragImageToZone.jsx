import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useSpeech } from '../../hooks/useSpeech';
import { useSettings } from '../../context/SettingsContext';

// ---- Shape/Color SVG renderer ----
function ShapeRenderer({ shape, color, size = 60 }) {
  const s = size;
  switch (shape) {
    case 'circle':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill={color} stroke="#2D2D2D" strokeWidth="6" />
          <circle cx="35" cy="35" r="10" fill="rgba(255,255,255,0.35)" />
        </svg>
      );
    case 'square':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="8" y="8" width="84" height="84" rx="14" fill={color} stroke="#2D2D2D" strokeWidth="6" />
          <rect x="20" y="20" width="28" height="18" rx="6" fill="rgba(255,255,255,0.35)" />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <polygon points="50,8 94,92 6,92" fill={color} stroke="#2D2D2D" strokeWidth="6" strokeLinejoin="round" />
          <polygon points="50,18 70,60 38,60" fill="rgba(255,255,255,0.20)" />
        </svg>
      );
    case 'rectangle':
      return (
        <svg width={s} height={70} viewBox="0 0 140 100">
          <rect x="6" y="10" width="128" height="80" rx="14" fill={color} stroke="#2D2D2D" strokeWidth="6" />
          <rect x="20" y="20" width="44" height="20" rx="6" fill="rgba(255,255,255,0.35)" />
        </svg>
      );
    default:
      return null;
  }
}

// ---- Draggable Image Option ----
function DraggableOption({ item, isDragging }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.08) rotate(2deg)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center gap-2 p-4 rounded-[16px] bg-white cursor-grab active:cursor-grabbing select-none border-[2px] border-black/08"
      style={{
        ...style,
        boxShadow: isDragging ? '0 12px 30px rgba(0,0,0,0.25)' : 'var(--shadow-card)',
        touchAction: 'none',
        minWidth: '90px',
        border: '2px solid rgba(0,0,0,0.08)',
      }}
    >
      <ShapeRenderer shape={item.shape} color={item.color} size={64} />
      <span className="text-xs font-bold text-[#6B6B6B] text-center">{item.colorName} {item.shapeName}</span>
    </div>
  );
}

// ---- Drop Zone ----
function AnswerDropZone({ filled, filledItem }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'answer-zone' });

  return (
    <div
      ref={setNodeRef}
      className="drop-zone flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] w-full min-h-[140px]"
      style={{
        background: isOver
          ? 'rgba(107,203,119,0.25)'
          : filled ? 'rgba(107,203,119,0.15)' : 'rgba(107,203,119,0.08)',
        border: `3px ${filled || isOver ? 'solid' : 'dashed'} ${filled ? '#4CAF50' : '#6BCB77'}`,
        transform: isOver ? 'scale(1.03)' : 'scale(1)',
        transition: 'all 200ms',
      }}
    >
      {filled ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex flex-col items-center gap-2"
        >
          <ShapeRenderer shape={filledItem.shape} color={filledItem.color} size={80} />
          <span className="text-2xl">✅</span>
        </motion.div>
      ) : (
        <div className="text-center text-[#6B6B6B]">
          <div className="text-3xl mb-1">🎯</div>
          <div className="text-sm font-semibold">Dépose ici / ضع هنا</div>
        </div>
      )}
    </div>
  );
}

export default function DragImageToZone({ activity, onComplete }) {
  const { settings } = useSettings();
  const { speak, speakOpposite } = useSpeech();
  const isAr = settings.language === 'ar';
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'error' | null
  const [activeId, setActiveId] = useState(null);

  const question = activity.questions[currentQ];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  // Speak question on mount/question change
  useEffect(() => {
    const t = setTimeout(() => {
      const isSame = currentQ % 2 === 0;
      const speakFn = isSame ? speak : speakOpposite;
      speakFn(question.question);
    }, 400);
    return () => clearTimeout(t);
  }, [currentQ]);

  function handleDragStart({ active }) {
    setActiveId(active.id);
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over || over.id !== 'answer-zone') return;
    if (answer) return; // Already answered

    const droppedItem = question.options.find(o => o.id === active.id);
    if (!droppedItem) return;

    if (active.id === question.correctId) {
      setAnswer(droppedItem);
      setFeedback('correct');
      speak(isAr
        ? `أحسنت! ${droppedItem.colorName} ${droppedItem.shapeName}`
        : `Bravo ! ${droppedItem.colorName} ${droppedItem.shapeName}`);
      setTimeout(() => {
        if (currentQ < activity.questions.length - 1) {
          setCurrentQ(q => q + 1);
          setAnswer(null);
          setFeedback(null);
        } else {
          onComplete();
        }
      }, 1500);
    } else {
      setFeedback('error');
      speak(isAr ? 'حاول مرة أخرى!' : 'Essaie encore !');
      setTimeout(() => setFeedback(null), 600);
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-6 pb-4">
        {/* Progress */}
        <div className="flex gap-2 justify-center">
          {activity.questions.map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full transition-all" style={{
              background: i < currentQ ? '#6BCB77' : i === currentQ ? '#FFD93D' : '#e0e0e0'
            }} />
          ))}
        </div>

        {/* Question */}
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-[#FFF3D4] rounded-[20px] p-5 border-2 border-[rgba(0,0,0,0.06)]"
        >
          <div className="text-4xl mb-2">❓</div>
          <p className="text-xl font-extrabold text-[#2D2D2D]">{question.question}</p>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const isSame = currentQ % 2 === 0;
              (isSame ? speak : speakOpposite)(question.question);
            }}
            className="mt-3 inline-flex items-center gap-2 bg-[#4D96FF] text-white px-4 py-2 rounded-full text-sm font-bold shadow"
          >🔊 {isAr ? 'استمع' : 'Écouter'}</motion.button>
        </motion.div>

        {/* Options Grid */}
        <motion.div key={`options-${currentQ}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-2 gap-4 justify-items-center">
            {question.options.map(item => (
              <DraggableOption key={item.id} item={item} isDragging={activeId === item.id} />
            ))}
          </div>
        </motion.div>

        {/* Drop Zone */}
        <AnswerDropZone filled={!!answer} filledItem={answer} />

        {/* Feedback */}
        <AnimatePresence>
          {feedback === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-[#FF6B6B] font-bold text-lg"
            >
              {isAr ? '❌ حاول مرة أخرى!' : '❌ Essaie encore !'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndContext>
  );
}
