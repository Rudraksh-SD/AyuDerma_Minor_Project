import React from 'react';
import { useApp } from '../context/AppContext';
import { IMAGES } from '../data/initialData';
import { Droplet, Shield, Sparkles, HeartHandshake, Leaf } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between px-6 md:px-14 py-6 md:py-10">
      {/* Subtle Botanical Shadow in background */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none opacity-25 select-none -z-10">
        <svg viewBox="0 0 200 200" fill="#4d5f2a" className="w-full h-full filter blur-[1px]">
          <path d="M20,10 Q60,40 40,90 Q80,70 110,120 Q60,110 30,150 Q70,160 50,200 Q20,130 10,80 Z" opacity="0.6" />
        </svg>
      </div>

      {/* Main Hero Row */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
        {/* Left Typography & Value Propositions */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 pt-2">
          {/* Main AyuDerma Script Logo */}
          <div className="relative">
            <h1 className="font-kunstler text-7xl sm:text-8xl md:text-9xl text-[#394a1d] leading-none tracking-tight select-none">
              AyuDerma
              <span className="inline-block transform translate-y-[-15%] -ml-1 text-[#485926] text-3xl md:text-4xl">🌿</span>
            </h1>

            {/* Star Divider & Subtitle */}
            <div className="mt-4 flex flex-col items-start gap-2">
              <div className="flex items-center gap-3 w-full max-w-md">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b8aa92] to-transparent" />
                <span className="text-[#847558] text-base select-none">✦</span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b8aa92] to-transparent" />
              </div>
              <h2 className="text-[#514532] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase font-sans">
                HEALTHY SKIN. CONFIDENT YOU.
              </h2>
            </div>
          </div>

          {/* 3 Circular Feature Pillars */}
          <div className="flex items-center gap-6 sm:gap-10 py-2">
            {/* Nourish */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#b2a48f] bg-[#faf5ec]/60 flex items-center justify-center text-[#554734] shadow-[0_2px_10px_rgba(100,85,60,0.05)] transition-transform hover:scale-105">
                <Droplet className="w-5 h-5 text-[#5e4f3a]" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#554734] mt-2 uppercase">
                NOURISH
              </span>
            </div>

            <div className="h-10 w-[1px] bg-[#d9cdba]" />

            {/* Protect */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#b2a48f] bg-[#faf5ec]/60 flex items-center justify-center text-[#554734] shadow-[0_2px_10px_rgba(100,85,60,0.05)] transition-transform hover:scale-105">
                <Leaf className="w-5 h-5 text-[#5e4f3a]" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#554734] mt-2 uppercase">
                PROTECT
              </span>
            </div>

            <div className="h-10 w-[1px] bg-[#d9cdba]" />

            {/* Glow */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#b2a48f] bg-[#faf5ec]/60 flex items-center justify-center text-[#554734] shadow-[0_2px_10px_rgba(100,85,60,0.05)] transition-transform hover:scale-105">
                <Sparkles className="w-5 h-5 text-[#5e4f3a]" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#554734] mt-2 uppercase">
                GLOW
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <button
              id="btn-get-started"
              onClick={() => setActivePage('scan')}
              className="group bg-[#4a5d29] hover:bg-[#3d4c20] text-white px-8 py-3.5 rounded-full text-xs md:text-sm font-semibold tracking-[0.2em] shadow-[0_4px_16px_rgba(74,93,41,0.28)] transition-all flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>GET STARTED</span>
              <span className="text-sm transition-transform group-hover:rotate-12">🍃</span>
            </button>
          </div>
        </div>

        {/* Right Hero Image (Wooden mortar & herbs with amla gooseberries) */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end items-center relative">
          <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
            {/* Soft glowing ambient circle */}
            <div className="absolute inset-0 bg-[#ebe1ce]/60 rounded-full filter blur-3xl -z-10 transform scale-90" />

            <img
              src={IMAGES.mortarHerbs}
              alt="Ayurvedic herbs and fresh amla in wooden mortar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-3xl drop-shadow-[0_20px_35px_rgba(80,70,50,0.18)] transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>

      {/* Bottom Floating 4-Pillars Card */}
      <div className="max-w-5xl mx-auto w-full mt-6">
        <div className="bg-[#faf6ee]/85 backdrop-blur-md border border-[#e8dfce] rounded-2xl py-3.5 px-4 sm:px-8 shadow-[0_4px_20px_rgba(95,80,55,0.04)] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-2 items-center">
          {/* Pillar 1 */}
          <div className="flex items-center gap-3 justify-center md:border-r border-[#ded2be] pr-2">
            <div className="w-8 h-8 rounded-full bg-[#eee5d3] flex items-center justify-center text-[#495b28]">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#4d4231] uppercase">
              AYURVEDIC WISDOM
            </span>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-center gap-3 justify-center md:border-r border-[#ded2be] pr-2">
            <div className="w-8 h-8 rounded-full bg-[#eee5d3] flex items-center justify-center text-[#495b28]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M12 2v6m-4-2l4 4 4-4M4 11h16a8 8 0 0 1-16 0z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#4d4231] uppercase">
              NATURAL INGREDIENTS
            </span>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-center gap-3 justify-center md:border-r border-[#ded2be] pr-2">
            <div className="w-8 h-8 rounded-full bg-[#eee5d3] flex items-center justify-center text-[#495b28]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="12" cy="7" r="3" />
                <path d="M5 21a7 7 0 0 1 14 0" />
                <path d="M12 14v7" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#4d4231] uppercase">
              HOLISTIC CARE
            </span>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-center gap-3 justify-center pl-2">
            <div className="w-8 h-8 rounded-full bg-[#eee5d3] flex items-center justify-center text-[#495b28]">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#4d4231] uppercase">
              SAFE &amp; EFFECTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
