import React from 'react';
import { useApp } from '../context/AppContext';
import { PageType } from '../types';
import { User, LogIn } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activePage, setActivePage, user } = useApp();

  const navItems: { id: PageType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'scan', label: 'Scan Skin' },
    { id: 'progress', label: 'Progress' },
    { id: 'history', label: 'History' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <header className="w-full pt-4 pb-2 px-4 md:px-8 z-30 sticky top-0 transition-all">
      <nav
        id="navbar-main"
        className="max-w-6xl mx-auto bg-[#faf6ee]/90 backdrop-blur-md border border-[#e8ded0] rounded-full px-6 md:px-10 py-2.5 md:py-3.5 flex items-center justify-between shadow-[0_4px_24px_rgba(95,80,55,0.06)]"
      >
        {/* Left: AyuDerma Logo */}
        <button
          id="btn-nav-logo"
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-[#4a5e2a] flex items-center justify-center text-[#4a5e2a] transition-transform group-hover:scale-105">
            {/* Custom organic leaf emblem */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#4a5e2a]">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79 2.89 1.14 5.21 3.42 6.39 6.29.13.48.24.97.31 1.47.03-.01.06-.03.09-.04zm2-11.86c3.95.49 7 3.85 7 7.93 0 .62-.08 1.21-.21 1.79-2.89-1.14-5.21-3.42-6.39-6.29-.13-.48-.24-.97-.31-1.47-.03.01-.06.03-.09.04z" opacity="0.15" />
              <path d="M17.5 4.5c-4 0-7.5 3.5-7.5 7.5 0 2.5 1.5 4.5 3.5 5.5-1.5 0-3-.5-4.5-1.5-2.5-1.7-4-4.5-4-7.5 0 0 5-1 8.5 2 1-1.5 2.5-3 4-4.5v-1.5z" />
              <path d="M13.5 12c1.5-1.5 3.5-2 5-2-.5 2-2 3.5-3.5 4.5-1-1-1.5-2-1.5-2.5z" />
            </svg>
          </div>
          <div className="flex items-center">
            <span className="font-kunstler text-3xl md:text-4xl text-[#394a1d] tracking-wide relative select-none">
              AyuDerma
              <span className="absolute -top-1 right-0 text-[#4a5e2a] text-xs">🌿</span>
            </span>
          </div>
        </button>

        {/* Center: Navigation Links */}
        <div className="hidden sm:flex items-center gap-6 md:gap-10">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => setActivePage(item.id)}
                className={`group relative flex flex-col items-center py-1 transition-all focus:outline-none ${
                  isActive ? 'text-[#384a1d]' : 'text-[#646e55] hover:text-[#384a1d]'
                }`}
              >
                {/* Active mini leaf indicator */}
                <div
                  className={`text-[11px] transition-all duration-300 transform -mb-1 ${
                    isActive ? 'opacity-100 translate-y-0 text-[#4c5f2b]' : 'opacity-0 -translate-y-1'
                  }`}
                >
                  🌿
                </div>

                <span
                  className={`font-handwriting text-base md:text-lg transition-colors ${
                    isActive ? 'font-bold text-[#384a1d]' : 'font-normal'
                  }`}
                >
                  {item.label}
                </span>

                {/* Underline bar */}
                <span
                  className={`h-[2px] bg-[#495b28] transition-all duration-300 rounded-full ${
                    isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-40'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right: Profile or Login Button */}
        <div className="flex items-center gap-2">
          {user.isLoggedIn ? (
            <button
              id="btn-nav-profile"
              onClick={() => setActivePage('profile')}
              title={`Logged in as ${user.name}`}
              className={`w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all ${
                activePage === 'profile'
                  ? 'border-[#384a1d] bg-[#eae2d3] text-[#384a1d]'
                  : 'border-[#516431] text-[#516431] hover:bg-[#f0e7d8]'
              }`}
            >
              <User className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          ) : (
            <button
              id="btn-nav-login"
              onClick={() => setActivePage('login')}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#4a5e2a] text-[#4a5e2a] hover:bg-[#4a5e2a] hover:text-white font-handwriting text-sm transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <div className="sm:hidden flex items-center">
            <select
              value={activePage}
              onChange={(e) => setActivePage(e.target.value as PageType)}
              aria-label="Navigation Menu"
              className="bg-[#f5ecdd] border border-[#d8cdb9] text-[#384a1d] text-xs rounded-full px-2.5 py-1 font-handwriting"
            >
              <option value="home">Home</option>
              <option value="scan">Scan Skin</option>
              <option value="progress">Progress</option>
              <option value="history">History</option>
              <option value="profile">Profile</option>
              <option value="login">Login</option>
            </select>
          </div>
        </div>
      </nav>
    </header>
  );
};
