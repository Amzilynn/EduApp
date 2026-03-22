import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { getContent } from '../data/content';
import { useSpeech } from '../hooks/useSpeech';
import CategoryCard from '../components/ui/CategoryCard';
import Mascot from '../components/Mascot';
import ScreenWrapper from '../components/layout/ScreenWrapper';
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
    const timer = setTimeout(() => {
      speak(content.welcomeMsg);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const isV3 = true; // Apply V3 premium design to all levels

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

  const standardHeader = (
    <>
      <button className="home-btn-pill" onClick={() => setShowConfirm(true)}>
        <span className="home-icon">🏠</span>
        <span className="home-label">{isAr ? 'الرئيسية' : 'Accueil'}</span>
      </button>

      <div className="level-badge-frosted">
        <div className="badge-mascot-wrap">
          <Mascot type={mascotType} state="idle" />
        </div>
        <span>
          {isAr ? `${settings.level} سنوات` : `${settings.level} ans`}
        </span>
      </div>

      <button className="speaker-btn-frosted" onClick={() => speak(content.welcomeMsg)}>
        🔊
      </button>
    </>
  );

  const v3Header = (
    <div className="v3-header-clean">
      <button className="home-btn-3d-premium" onClick={() => setShowConfirm(true)}>
        <div className="home-btn-3d-inner">
          <img src="/assets/images/3d/3d_home_icon.png" alt="Home" className="home-icon-3d-fancy" onError={(e) => e.target.src = '🏠'} />
          <span className="home-label-3d-bold">{isAr ? 'الرئيسية' : 'Accueil'}</span>
        </div>
      </button>

      <div className="v3-mascot-focus">
        <div className="mascot-waving-container">
          <Mascot type={mascotType} state="waving" className="chick-premium-anim" />
          <div className="mascot-pointer-down">👇</div>
        </div>
      </div>

      <div className="v3-header-right">
        <button className="speaker-btn-3d-premium" onClick={() => speak(content.welcomeMsg)}>
          <span className="speaker-icon-3d">🔊</span>
        </button>
      </div>
    </div>
  );

  return (
    <ScreenWrapper 
      header={isV3 ? v3Header : standardHeader}
      dataLevel={settings.level}
      dir="ltr"
      className={isV3 ? 'category-screen-v3-adventure' : 'category-screen-v2'}
    >
      <div className={isV3 ? "category-menu-layout-v3-adventure" : "category-menu-layout"}>
        {isV3 && (
          <div className="adventure-floor-bg">
            <div className="adventure-path"></div>
            <div className="stepping-stone stone-1"></div>
            <div className="stepping-stone stone-2"></div>
            <div className="stepping-stone stone-3"></div>
            <div className="gentle-hill hill-1"></div>
            <div className="gentle-hill hill-2"></div>
            
            {/* Playful 3D objects */}
            <div className="clay-object floating-heart">❤️</div>
            <div className="clay-object floating-droplet droplet-1">💧</div>
            <div className="clay-object floating-droplet droplet-2">💧</div>
          </div>
        )}

        <div className={isV3 ? "category-cards-container-v3" : "category-list-stretch"}>
          {content.categories.map((cat, index) => (
            <React.Fragment key={cat.id}>
              <motion.div
                className={isV3 ? "v3-card-item-premium" : "stagger-child category-card-wrapper"}
                initial={isV3 ? { opacity: 0, scale: 0.8, y: 50, rotate: index === 0 ? -2 : 2 } : {}}
                animate={isV3 ? { opacity: 1, scale: 1, y: 0, rotate: index === 0 ? -2 : 2 } : {}}
                transition={{ 
                  delay: index * 0.2, 
                  type: 'spring', 
                  stiffness: 100, 
                  damping: 12 
                }}
              >
                <CategoryCard 
                  variant={isV3 ? 'v3' : 'v1'}
                  title={cat.title}
                  icon={isV3 && ['famille', 'couleurs'].includes(cat.id) ? `/assets/images/3d/3d_${cat.id}_card.png` : cat.icon}
                  color={cat.color}
                  onClick={() => handleCategoryTap(cat)}
                />
              </motion.div>

            </React.Fragment>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        message={isAr ? 'العودة إلى الرئيسية؟' : "Retour à l'accueil ?"}
        onConfirm={handleGoHome}
        onCancel={() => setShowConfirm(false)}
      />
    </ScreenWrapper>
  );
}
