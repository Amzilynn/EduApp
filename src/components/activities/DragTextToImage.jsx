import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useSpeech } from '../../hooks/useSpeech';
import { useSettings } from '../../context/SettingsContext';
import FamilyIllustration from '../illustrations/FamilyIllustration';
import ColorSwatch from '../illustrations/ColorSwatch';
import ShapeIllustration from '../illustrations/ShapeIllustration';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- Draggable Label Chip ----
function DraggableChip({ item, isPlaced }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: isPlaced,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.08) rotate(2deg)` }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        touchAction: 'none',
        opacity: isPlaced ? 0.35 : 1,
        pointerEvents: isPlaced ? 'none' : 'auto',
      }}
      {...(isPlaced ? {} : listeners)}
      {...(isPlaced ? {} : attributes)}
    >
      <div
        className="px-5 py-3 rounded-[12px] font-extrabold text-xl text-[#2D2D2D] text-center select-none cursor-grab active:cursor-grabbing"
        style={{
          background: isPlaced ? '#e0e0e0' : '#FFD93D',
          border: `3px solid ${isPlaced ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.15)'}`,
          boxShadow: isDragging
            ? '0 12px 30px rgba(0,0,0,0.25)'
            : 'var(--shadow-card)',
          minWidth: '80px',
        }}
      >
        {item.label}
      </div>
    </div>
  );
}

// ---- Drop Zone Card ----
function DropZoneCard({ zone, placedItem, feedbackState }) {
  const { setNodeRef, isOver } = useDroppable({ id: zone.id });
  const isCorrect = feedbackState === 'correct';
  const isError = feedbackState === 'error';

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col items-center gap-2 rounded-[20px] p-3 border-[3px] transition-all duration-200"
      style={{
        background: isCorrect ? 'rgba(107,203,119,0.2)' : isOver ? 'rgba(107,203,119,0.2)' : 'rgba(107,203,119,0.06)',
        borderColor: isCorrect ? '#4CAF50' : isError ? '#FF6B6B' : isOver ? '#6BCB77' : '#C5E1A5',
        borderStyle: placedItem || isOver ? 'solid' : 'dashed',
        boxShadow: isCorrect ? '0 0 0 4px rgba(107,203,119,0.3)' : 'var(--shadow-card)',
        minWidth: '100px',
        animation: isError ? 'gentleShake 400ms ease-in-out' : isCorrect ? 'starBurst 400ms ease-in-out' : 'none',
      }}
    >
      {/* Illustration */}
      <div className="w-20 h-20 flex items-center justify-center">
        {zone.type === 'family' && <FamilyIllustration memberId={zone.shapeId} size={80} />}
        {zone.type === 'color' && <ColorSwatch color={zone.color} size={80} />}
        {zone.type === 'shape' && <ShapeIllustration shapeId={zone.shapeId} size={80} />}
      </div>

      {/* Placed label or empty slot */}
      {placedItem ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="px-3 py-1 rounded-full font-bold text-base"
          style={{ background: '#6BCB77', color: 'white', border: '2px solid rgba(0,0,0,0.1)' }}
        >
          {placedItem.label} ✓
        </motion.div>
      ) : (
        <div
          className="w-20 h-8 rounded-lg border-b-4 border-[#ccc] border-dashed flex items-center justify-center"
        >
          <span className="text-sm text-[#aaa]">— — —</span>
        </div>
      )}
    </div>
  );
}

export default function DragTextToImage({ activity, onComplete }) {
  const { settings } = useSettings();
  const { speak } = useSpeech();
  const isAr = settings.language === 'ar';

  const [placements, setPlacements] = useState({}); // zoneId -> item
  const [feedback, setFeedback] = useState({}); // zoneId -> 'correct' | 'error'
  const [activeId, setActiveId] = useState(null);
  
  // Stable shuffled states to avoid re-shuffling on every render
  const [shuffledItems, setShuffledItems] = useState(() => shuffle([...activity.items]));
  const [shuffledZones, setShuffledZones] = useState(() => {
    const items = shuffle([...activity.items]);
    return items.map(item => ({
      id: item.id,
      acceptsId: item.id,
      type: item.imageKey?.startsWith('family') ? 'family'
           : item.imageKey?.startsWith('color') ? 'color'
           : 'shape',
      color: item.color,
      shapeId: item.imageKey,
      label: item.label, // cache label for zones
    }));
  });

  useEffect(() => {
    const items = shuffle([...activity.items]);
    setShuffledItems(items);
    setShuffledZones(items.map(item => ({
      id: item.id,
      acceptsId: item.id,
      type: item.imageKey?.startsWith('family') ? 'family'
           : item.imageKey?.startsWith('color') ? 'color'
           : 'shape',
      color: item.color,
      shapeId: item.imageKey,
      label: item.label,
    })));
    setPlacements({});
    setFeedback({});
  }, [activity]);

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

    const itemId = active.id;
    const zoneId = over.id;
    const zone = shuffledZones.find(z => z.id === zoneId);
    const item = activity.items.find(i => i.id === itemId);

    if (!zone || !item) return;
    if (feedback[zoneId] === 'correct') return;

    if (zone.acceptsId === itemId) {
      const newPlacements = { ...placements, [zoneId]: item };
      setPlacements(newPlacements);
      setFeedback(prev => ({ ...prev, [zoneId]: 'correct' }));
      speak(item.audio);

      const allPlaced = activity.items.every(it => 
        Object.values(newPlacements).some(p => p.id === it.id)
      );
      if (allPlaced) {
        setTimeout(() => onComplete(), 1000);
      }
    } else {
      setFeedback(prev => ({ ...prev, [zoneId]: 'error' }));
      speak(isAr ? 'حاول مرة أخرى!' : 'Essaie encore !');
      setTimeout(() => {
        setFeedback(prev => ({ ...prev, [zoneId]: null }));
      }, 600);
    }
  }

  const placedIds = Object.values(placements).map(i => i.id);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-6 pb-4">
        {/* Progress dots */}
        <div className="flex gap-2 justify-center flex-wrap">
          {activity.items.map((item) => (
            <div key={item.id} className="w-3 h-3 rounded-full transition-all duration-300" style={{
              background: placedIds.includes(item.id) ? '#6BCB77' : '#e0e0e0'
            }} />
          ))}
        </div>

        {/* Draggable Label Chips Row (Stable shuffled order) */}
        <div className="flex flex-wrap gap-3 justify-center py-2">
          {shuffledItems.map(item => (
            <DraggableChip
              key={item.id}
              item={item}
              isPlaced={placedIds.includes(item.id)}
            />
          ))}
        </div>

        {/* Drop zones grid (Stable shuffled order) */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(activity.items.length, 3)}, 1fr)`,
          }}
        >
          {shuffledZones.map(zone => (
            <DropZoneCard
              key={zone.id}
              zone={zone}
              placedItem={placements[zone.id] || null}
              feedbackState={feedback[zone.id] || null}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}
