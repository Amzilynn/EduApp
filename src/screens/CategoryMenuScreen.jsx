import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { getContent } from '../data/content';
import { useSpeech } from '../hooks/useSpeech';
import CategoryCard from '../components/ui/CategoryCard';
import Mascot from '../components/Mascot';
import ConfirmModal from '../components/ui/ConfirmModal';
import './CategoryMenuScreen.css';

export default function CategoryMenuScreen() {
  const { settings, dispatch } = useSettings();
  const navigate = useNavigate();
  const { speak } = useSpeech();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const isAr = settings.language === 'ar';

  const content = getContent(settings.level, settings.language);
  const mascotType = settings.level === 3 ? 'sunny' : settings.level === 4 ? 'riko' : 'luna';

  useEffect(() => {
    // Play welcome message after 600ms
    const timer = setTimeout(() => {
      speak(content.welcomeMsg);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  function handleCategoryTap(category) {
    speak(category.title);
    setTimeout(() => {
      navigate(`/activity/${category.id}`);
    }, 500);
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

  return (
    <div 
      className={`category-menu-screen screen-enter ${getBgClass()}`} 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <header className="app-header">
        <button className="home-btn" onClick={() => setShowConfirm(true)}>
          🏠
        </button>

        <div className="level-badge">
          <div className="badge-mascot">
            <Mascot type={mascotType} state="idle" />
          </div>
          <span>
            {isAr ? `${settings.level} سنوات` : `${settings.level} ans`}
          </span>
        </div>

        <button className="speaker-btn" onClick={() => speak(content.welcomeMsg)}>
          🔊
        </button>
      </header>

      {/* Main Menu */}
      <main className="menu-main">
        <motion.div 
          className="menu-title-card"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2>{isAr ? 'ماذا نتعلم اليوم؟' : "Qu'est-ce qu'on apprend ?"}</h2>
        </motion.div>

        <div className="category-grid">
          {content.categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              className="stagger-child"
              style={{ '--delay': `${index * 100}ms` }}
            >
              <CategoryCard 
                title={cat.title}
                icon={cat.icon}
                color={cat.color}
                onClick={() => handleCategoryTap(cat)}
              />
            </motion.div>
          ))}
        </div>
      </main>

      {/* Mascot in corner */}
      <div className="menu-mascot-wrapper wave">
        <Mascot type={mascotType} state="idle" />
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        message={isAr ? 'العودة إلى الرئيسية؟' : "Retour à l'accueil ?"}
        onConfirm={handleGoHome}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
