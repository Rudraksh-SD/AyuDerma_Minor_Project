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
      className="min-h-screen text-[#423725] flex flex-col items-center justify-start py-2 sm:py-4 px-2 sm:px-4 font-sans selection:bg-[#495c27]/20 selection:text-[#384a1d] bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${IMAGES.bgHomepage})`,
        backgroundColor: '#f3ecde',
      }}
    >
      {/* 16:9 Aspect Frame Container */}
      <div
        id="frame-16-9-container"
        className="w-full max-w-[1536px] min-h-[92vh] xl:aspect-[16/9] border border-[#dfd2be] rounded-[32px] sm:rounded-[36px] shadow-[0_20px_60px_rgba(80,68,48,0.14)] flex flex-col justify-between overflow-hidden relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${IMAGES.bgHomepage})`,
          backgroundColor: '#f7f1e6',
        }}
      >
        {/* Subtle warm wash overlay to harmonize text contrast while displaying background on all pages */}
        <div className="absolute inset-0 bg-[#f7f1e6]/30 pointer-events-none z-0" />

        {/* Navigation Bar */}
        <div className="relative z-10">
          <Navbar />
        </div>

        {/* Dynamic Page Content */}
        <main className="relative z-10 flex-1 flex flex-col justify-between overflow-y-auto pb-4">
          {renderActivePage()}
        </main>

        {/* Subtle Decorative Botanical Corner Accents */}
        <div className="pointer-events-none absolute bottom-0 right-0 w-32 h-32 opacity-15 select-none z-0">
          <svg viewBox="0 0 100 100" fill="#495b28">
            <path d="M100,100 C70,100 50,80 50,50 C50,20 70,0 100,0 Z" />
          </svg>
        </div>
      </div>

      {/* Global Interactive Modals */}
      <RecommendationsModal />
      <EditProfileModal />
      <ScanDetailModal />
      <AddRemedyModal />

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-medium flex items-center gap-2 backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-red-50/95 border-red-200 text-red-800'
                : toast.type === 'info'
                ? 'bg-[#faf5eb]/95 border-[#d6c7b0] text-[#4d4231]'
                : 'bg-[#495c27]/95 border-[#3b4c1f] text-white'
            }`}
          >
            <span>🌿</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
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
