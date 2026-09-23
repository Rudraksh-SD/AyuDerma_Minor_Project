import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ScanSkinPage } from './pages/ScanSkinPage';
import { ProgressPage } from './pages/ProgressPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { RecommendationsModal } from './components/RecommendationsModal';
import { EditProfileModal } from './components/EditProfileModal';
import { ScanDetailModal } from './components/ScanDetailModal';
import { AddRemedyModal } from './components/AddRemedyModal';
import { IMAGES } from './data/initialData';
import { motion, AnimatePresence } from 'motion/react';
import { pageVariants } from './utils/animations';

const MainLayout: React.FC = () => {
  const { activePage, toast } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'login':
        return <LoginPage />;
      case 'scan':
        return <ScanSkinPage />;
      case 'progress':
        return <ProgressPage />;
      case 'history':
        return <HistoryPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div
      id="app-root-container"
      className="min-h-screen text-[#2c2823] flex flex-col items-center justify-start py-2 sm:py-4 px-2 sm:px-4 font-sans selection:bg-[#495c27]/20 selection:text-[#2c3817] bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${IMAGES.bgHomepage})`,
        backgroundColor: '#f3ecde',
      }}
    >
      {/* 16:9 Aspect Frame Container */}
      <div
        id="frame-16-9-container"
        className="w-full max-w-[1536px] min-h-[92vh] border border-[#dfd2be] rounded-[24px] sm:rounded-[36px] shadow-[0_20px_60px_rgba(80,68,48,0.12)] flex flex-col justify-between overflow-hidden relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${IMAGES.bgHomepage})`,
          backgroundColor: '#f7f1e6',
        }}
      >
        {/* Subtle warm wash overlay to harmonize text contrast while displaying background on all pages */}
        <div className="absolute inset-0 bg-[#f7f1e6]/35 pointer-events-none z-0" />

        {/* Navigation Bar */}
        <div className="relative z-10">
          <Navbar />
        </div>

        {/* Dynamic Page Content with Motion Page Transitions */}
        <main className="relative z-10 flex-1 flex flex-col justify-between overflow-y-auto pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1 flex flex-col w-full"
            >
              {renderActivePage()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Subtle Decorative Botanical Corner Accents */}
        <div className="pointer-events-none absolute bottom-0 right-0 w-32 h-32 opacity-15 select-none z-0">
          <svg viewBox="0 0 100 100" fill="#495b28">
            <path d="M100,100 C70,100 50,80 50,50 C50,20 70,0 100,0 Z" />
          </svg>
        </div>
      </div>

      {/* Global Interactive Modals */}
      <AnimatePresence>
        <RecommendationsModal />
        <EditProfileModal />
        <ScanDetailModal />
        <AddRemedyModal />
      </AnimatePresence>

      {/* Toast Notification Banner with Motion animation */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div
              className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-sans font-semibold flex items-center gap-2.5 backdrop-blur-md ${
                toast.type === 'info'
                  ? 'bg-[#faf5eb]/95 border-[#d6c7b0] text-[#4d4231]'
                  : 'bg-[#495c27]/95 border-[#3b4c1f] text-white shadow-[0_8px_24px_rgba(73,92,39,0.3)]'
              }`}
            >
              <span className="text-sm">🌿</span>
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
