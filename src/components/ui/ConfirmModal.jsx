import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import Button from './Button';

export default function ConfirmModal({ message, onConfirm, onCancel, isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            exit={{ scale: 0.7, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-[20px] p-8 shadow-2xl max-w-sm w-full text-center"
          >
            <div className="text-5xl mb-4">🏠</div>
            <p className="text-xl font-bold text-[#2D2D2D] mb-6">{message}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={onCancel}>✕</Button>
              <Button variant="primary" onClick={onConfirm}>✓</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
