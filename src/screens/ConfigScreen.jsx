import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import BigButton from '../components/ui/BigButton';
import LevelCard from '../components/ui/LevelCard';
import './ConfigScreen.css';

const LEVELS = [
  { value: 3, type: 'sunny', label: '3 ans' },
  { value: 4, type: 'riko', label: '4 ans' },
  { value: 5, type: 'luna', label: '5 ans' },
];

const LANGUAGES = [
  { value: 'fr', emoji: '🇫🇷', label: 'Français' },
  { value: 'ar', emoji: '🌙', label: 'العربية' },
];

const VOICES = [
  { value: 'girl', emoji: '👧', labelFr: 'Fille', labelAr: 'بنت' },
  { value: 'boy', emoji: '👦', labelFr: 'Garçon', labelAr: 'ولد' },
];

export default function ConfigScreen() {
  const { settings, dispatch } = useSettings();
  const navigate = useNavigate();
  const isAr = settings.language === 'ar';

  const canStart = settings.level && settings.language && settings.voiceType;

  function handleStart() {
    dispatch({ type: 'CONFIRM' });
    navigate('/categories');
  }

  // Set the background based on level if selected
  const getBgStyle = () => {
    if (settings.level === 3) return { background: 'var(--bg-sky-l3)' };
    if (settings.level === 4) return { background: 'var(--bg-sky-l4)' };
    if (settings.level === 5) return { background: 'var(--bg-sky-l5)' };
    return { background: 'var(--bg-sky-l3)' };
  };

  return (
    <div className="config-screen screen-enter" style={getBgStyle()} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background elements */}
      <div className="config-bg-elements">
        <div className="cloud cloud-1">☁️</div>
        <div className="cloud cloud-2">☁️</div>
        <div className="cloud cloud-3">☁️</div>
        <div className="rainbow">🌈</div>
        <div className="flower float" style={{ left: '10%', '--float-delay': '0s' }}>🌸</div>
        <div className="flower float" style={{ left: '30%', '--float-delay': '1s' }}>🌿</div>
        <div className="flower float" style={{ right: '10%', '--float-delay': '0.5s' }}>🌸</div>
        <div className="flower float" style={{ right: '40%', '--float-delay': '1.5s' }}>🌿</div>
      </div>

      <div className="config-content">
        {/* App Logo Card */}
        <motion.div 
          className="app-title-card"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          <span className="app-logo-emoji float">🌟</span>
          <h1 className="app-name">EduKids</h1>
          <p className="app-tagline">
            {isAr ? 'تعلم، العب، وانمو' : 'Apprendre & Jouer'}
          </p>
        </motion.div>

        {/* Level Section */}
        <motion.section 
          className="config-section stagger-child"
          style={{ '--delay': '100ms' }}
        >
          <h2 className="config-section-title">
            <span>🐥</span> {isAr ? 'كم عمرك؟' : 'Quel âge as-tu ?'}
          </h2>
          <div className="options-grid">
            {LEVELS.map(lvl => (
              <LevelCard
                key={lvl.value}
                level={lvl.value}
                type={lvl.type}
                selected={settings.level === lvl.value}
                onClick={() => dispatch({ type: 'SET_LEVEL', payload: lvl.value })}
              />
            ))}
          </div>
        </motion.section>

        {/* Language Section */}
        <motion.section 
          className="config-section stagger-child"
          style={{ '--delay': '200ms' }}
        >
          <h2 className="config-section-title">
            <span>🌍</span> {isAr ? 'ما هي لغتك؟' : 'Quelle langue ?'}
          </h2>
          <div className="options-grid">
            {LANGUAGES.map(lang => (
              <div 
                key={lang.value}
                className={`select-card-simple ${settings.language === lang.value ? 'selected' : ''}`}
                onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: lang.value })}
              >
                <span className="selection-emoji">{lang.emoji}</span>
                <span className="selection-label">{lang.label}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Voice Section */}
        <motion.section 
          className="config-section stagger-child"
          style={{ '--delay': '300ms' }}
        >
          <h2 className="config-section-title">
            <span>🗣️</span> {isAr ? 'اختر الصوت' : 'Quelle voix ?'}
          </h2>
          <div className="options-grid">
            {VOICES.map(v => (
              <div 
                key={v.value}
                className={`select-card-simple ${settings.voiceType === v.value ? 'selected' : ''}`}
                onClick={() => dispatch({ type: 'SET_VOICE', payload: v.value })}
              >
                <span className="selection-emoji">{v.emoji}</span>
                <span className="selection-label">
                  {isAr ? v.labelAr : v.labelFr}
                </span>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {isAr && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 text-center"
              >
                <div className="inline-block px-3 py-2 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-700 italic">
                  💡 ملاحظة: إذا كان الصوت صامتاً، يرجى تفعيل حزمة اللغة العربية في إعدادات جهازك.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Footer CTA */}
        <div className="config-footer">
          <BigButton
            onClick={handleStart}
            disabled={!canStart}
            variant="primary"
            className={canStart ? 'visible' : ''}
          >
            {isAr ? 'ابدأ المغامرة 🌟' : 'COMMENCER 🌟'}
          </BigButton>
        </div>
      </div>
    </div>
  );
}
