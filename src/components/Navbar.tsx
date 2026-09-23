import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageType } from '../types';
import { User, LogIn, Menu, X, Home, Scan, TrendingUp, History, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { activePage, setActivePage, user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'scan', label: 'Scan Skin', icon: Scan },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: UserCheck },
  ];

  const handleNavClick = (pageId: PageType) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full pt-4 pb-2 px-3 sm:px-6 md:px-8 z-30 sticky top-0 transition-all">
      <nav
        id="navbar-main"
        aria-label="Main Navigation"
        className="max-w-6xl mx-auto bg-[#faf6ee]/90 backdrop-blur-md border border-[#e8ded0] rounded-full px-4 sm:px-8 py-2.5 md:py-3 flex items-center justify-between shadow-[0_4px_24px_rgba(95,80,55,0.06)] relative"
      >
        {/* Left: AyuDerma Logo */}
        <button
          id="btn-nav-logo"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27] rounded-full p-1 transition-all"
        >
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-[#4a5e2a] bg-[#f2e9db]/80 flex items-center justify-center text-[#4a5e2a] transition-transform group-hover:scale-105 shadow-xs">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5 text-[#4a5e2a]">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79 2.89 1.14 5.21 3.42 6.39 6.29.13.48.24.97.31 1.47.03-.01.06-.03.09-.04zm2-11.86c3.95.49 7 3.85 7 7.93 0 .62-.08 1.21-.21 1.79-2.89-1.14-5.21-3.42-6.39-6.29-.13-.48-.24-.97-.31-1.47-.03.01-.06.03-.09.04z" opacity="0.15" />
              <path d="M17.5 4.5c-4 0-7.5 3.5-7.5 7.5 0 2.5 1.5 4.5 3.5 5.5-1.5 0-3-.5-4.5-1.5-2.5-1.7-4-4.5-4-7.5 0 0 5-1 8.5 2 1-1.5 2.5-3 4-4.5v-1.5z" />
              <path d="M13.5 12c1.5-1.5 3.5-2 5-2-.5 2-2 3.5-3.5 4.5-1-1-1.5-2-1.5-2.5z" />
            </svg>
          </div>
          <div className="flex items-center">
            <span className="font-serif-title font-bold text-xl sm:text-2xl md:text-2xl text-[#2c3817] tracking-tight relative select-none">
              AyuDerma
              <span className="ml-1 text-[#4a5e2a] text-xs">🌿</span>
            </span>
          </div>
        </button>

        {/* Center: Desktop Navigation Links with Motion gliding indicator */}
        <div className="hidden sm:flex items-center gap-1 md:gap-2 bg-[#f2e8d7]/60 p-1 rounded-full border border-[#e2d6c3]">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-3.5 py-1.5 rounded-full text-xs md:text-sm font-sans font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27] select-none ${
                  isActive ? 'text-white font-semibold' : 'text-[#5d5240] hover:text-[#2c3817]'
                }`}
              >
                {/* Gliding Active Indicator Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-[#495c27] rounded-full shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Profile or Login & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2">
          {user.isLoggedIn ? (
            <button
              id="btn-nav-profile"
              onClick={() => handleNavClick('profile')}
              title={`Logged in as ${user.name}`}
              aria-label="User Profile"
              className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27] ${
                activePage === 'profile'
                  ? 'border-[#384a1d] bg-[#495c27] text-white shadow-xs'
                  : 'border-[#516431] text-[#4a5e2a] hover:bg-[#f0e7d8] bg-[#faf6ee]'
              }`}
            >
              <User className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          ) : (
            <button
              id="btn-nav-login"
              onClick={() => handleNavClick('login')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#4a5e2a] bg-[#4a5e2a] text-white hover:bg-[#3b4c20] font-sans font-medium text-xs sm:text-sm shadow-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="sm:hidden p-1.5 rounded-full text-[#4a5e2a] hover:bg-[#eae0cb] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Compact Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden max-w-6xl mx-auto mt-2 bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-2xl p-3 shadow-xl z-40"
          >
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-sans text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#495c27] text-white font-semibold shadow-xs'
                        : 'text-[#4d4231] hover:bg-[#efe5d3]'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              {!user.isLoggedIn && (
                <button
                  onClick={() => handleNavClick('login')}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-sans text-xs font-semibold bg-[#eae0cb] text-[#384a1d] hover:bg-[#e2d5bd]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Sign Up</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
