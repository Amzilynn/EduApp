import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { getCategory } from '../data/content';
import { useSpeech } from '../hooks/useSpeech';
import DragTextToImage from '../components/activities/DragTextToImage';
import DragImageToZone from '../components/activities/DragImageToZone';
import LetterSequencer from '../components/activities/LetterSequencer';
import NumberMatcher from '../components/activities/NumberMatcher';
import ConfirmModal from '../components/ui/ConfirmModal';
import Mascot from '../components/Mascot';
import InstructionBanner from '../components/ui/InstructionBanner';
import ProgressStars from '../components/ui/ProgressStars';
import BigButton from '../components/ui/BigButton';
import './ActivityScreen.css';

export default function ActivityScreen() {
  const { categoryId } = useParams();
  const { settings, dispatch } = useSettings();
  const navigate = useNavigate();
  const { speak } = useSpeech();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const isAr = settings.language === 'ar';
  const category = getCategory(settings.level, settings.language, categoryId);
  const activity = category?.activity;
  const mascotType = settings.level === 3 ? 'sunny' : settings.level === 4 ? 'riko' : 'luna';

  // Play instruction on mount
  useEffect(() => {
    if (activity?.instruction) {
      const timer = setTimeout(() => {
        if (!activity.noAudio) speak(activity.instruction);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [activity]);

  if (!category || !activity) {
    navigate('/categories');
    return null;
  }

  function handleComplete() {
    setCompleted(true);
    setProgress(activity.items?.length || 5);
  }

  function handleNext() {
    setCompleted(false);
    navigate('/categories');
  }

  function handleGoHome() {
    dispatch({ type: 'RESET' });
    navigate('/');
  }

  const getBgClass = () => {
    if (settings.level === 3) return 'bg-sky-l3';
    if (settings.level === 4) return 'bg-sky-l4';
    if (settings.level === 5) return 'bg-sky-l5';
    return 'bg-sky-l3';
  };

  function renderActivity() {
    // Pass setProgress to activities to track progress
    const props = { 
      activity, 
      onComplete: handleComplete,
      onProgress: setProgress // Future enhancement for activities
    };

    switch (activity.type) {
      case 'drag-text-to-image':
        return <DragTextToImage {...props} />;
      case 'drag-image-to-zone':
        return <DragImageToZone {...props} />;
      case 'letter-sequencer':
        return <LetterSequencer {...props} />;
      case 'number-matcher':
        return <NumberMatcher {...props} />;
      default:
        return <div>Activité inconnue</div>;
    }
  }

  return (
    <div 
      className={`activity-screen screen-enter ${getBgClass()}`} 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <header className="activity-header">
        <button className="home-btn" onClick={() => setShowConfirm(true)}>
          🏠
        </button>

        <h1 className="activity-title truncate mx-4">
          {activity.title}
        </h1>

        <button className="speaker-btn" onClick={() => speak(activity.instruction)}>
          🔊
        </button>
      </header>

      {/* Activity Content */}
      <main className="activity-main">
        <InstructionBanner 
          text={activity.instruction} 
          onSpeak={() => speak(activity.instruction)}
        />

        <div className="activity-card-container">
          {renderActivity()}
        </div>

        <div className="activity-progress-info">
          <ProgressStars 
            total={activity.items?.length || 5} 
            current={progress} 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="activity-footer">
        <button className="btn-footer-secondary" onClick={() => navigate('/categories')}>
          {isAr ? 'القائمة' : 'Menu'}
        </button>
        
        <BigButton 
          variant="primary"
          className={`btn-footer-primary ${completed ? 'visible' : ''}`}
          onClick={handleNext}
        >
          {isAr ? 'التالي →' : 'SUIVANT →'}
        </BigButton>

        <button className="btn-footer-secondary" onClick={() => speak(activity.instruction)}>
          {isAr ? 'أعد' : 'Relire'}
        </button>
      </footer>

      {/* Mascot in corner */}
      <div className="activity-mascot-wrapper wave">
        <Mascot type={mascotType} state={completed ? 'success' : 'idle'} />
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {completed && (
          <motion.div 
            className="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="success-card"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <span className="success-trophy">🏆</span>
              <h2 className="success-title">
                {isAr ? 'أحسنت! لقد نجحت!' : 'Bravo ! Tu as réussi !'}
              </h2>
              
              <div className="success-stars-container">
                <ProgressStars total={3} current={3} />
              </div>

              <BigButton onClick={handleNext}>
                {isAr ? 'استمر 🌟' : 'CONTINUER 🌟'}
              </BigButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={showConfirm}
        message={isAr ? 'العودة إلى الرئيسية؟' : "Retour à l'accueil ?"}
        onConfirm={handleGoHome}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
