import React from 'react';
import { useApp } from '../context/AppContext';
import { IMAGES } from '../data/initialData';
import { Droplet, HeartHandshake, Leaf, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeUpVariants, staggerContainer, cardHoverProps } from '../utils/animations';

export const HomePage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between px-6 md:px-14 py-6 md:py-10">
      {/* Background shadow leaf */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none opacity-20 select-none -z-10">
        <svg viewBox="0 0 200 200" fill="#4d5f2a" className="w-full h-full filter blur-[1px]">
          <path d="M20,10 Q60,40 40,90 Q80,70 110,120 Q60,110 30,150 Q70,160 50,200 Q20,130 10,80 Z" opacity="0.6" />
        </svg>
      </div>

      {/* Main Hero Row */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
        {/* Left Typography & Value Propositions */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="lg:col-span-6 flex flex-col justify-center space-y-6 pt-2"
        >
          {/* Main AyuDerma Script & Display Header */}
          <motion.div variants={fadeUpVariants} className="relative">
            <span className="text-xs font-semibold tracking-widest text-[#495c27] uppercase mb-2 block font-sans">
              AI/ML-ASSISTED AYURVEDIC SKIN WELLNESS
            </span>

            <h1 className="font-serif-title text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#2c3817] leading-[1.05] tracking-tight select-none">
              AyuDerma
              <span className="inline-block transform translate-y-[-10%] ml-2 text-[#495c27] text-3xl md:text-4xl">🌿</span>
            </h1>

            {/* Star Divider & Subtitle */}
            <div className="mt-4 flex flex-col items-start gap-2">
              <div className="flex items-center gap-3 w-full max-w-md">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b8aa92] to-transparent" />
                <span className="text-[#847558] text-sm select-none">✦</span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b8aa92] to-transparent" />
              </div>
              <h2 className="text-[#514532] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase font-sans">
                Healthy Skin. Confident You.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5d5240] mt-3 max-w-lg leading-relaxed font-sans">
              Experience holistic skin analysis powered by modern machine learning and guided by centuries of traditional Ayurvedic botanical wisdom.
            </p>
          </motion.div>

          {/* 3 Circular Feature Pillars */}
          <motion.div variants={fadeUpVariants} className="flex items-center gap-6 sm:gap-10 py-2">
            {/* Nourish */}
            <motion.div {...cardHoverProps} className="flex flex-col items-center cursor-pointer">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#b2a48f] bg-[#faf5ec]/80 flex items-center justify-center text-[#554734] shadow-xs">
                <Droplet className="w-5 h-5 text-[#495c27]" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#4d4231] mt-2.5 uppercase font-sans">
                NOURISH
              </span>
            </motion.div>

            <div className="h-10 w-[1px] bg-[#d9cdba]" />

            {/* Protect */}
            <motion.div {...cardHoverProps} className="flex flex-col items-center cursor-pointer">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#b2a48f] bg-[#faf5ec]/80 flex items-center justify-center text-[#554734] shadow-xs">
                <Leaf className="w-5 h-5 text-[#495c27]" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#4d4231] mt-2.5 uppercase font-sans">
                PROTECT
              </span>
            </motion.div>

            <div className="h-10 w-[1px] bg-[#d9cdba]" />

            {/* Glow */}
            <motion.div {...cardHoverProps} className="flex flex-col items-center cursor-pointer">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#b2a48f] bg-[#faf5ec]/80 flex items-center justify-center text-[#554734] shadow-xs">
                <Sparkles className="w-5 h-5 text-[#495c27]" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#4d4231] mt-2.5 uppercase font-sans">
                GLOW
              </span>
            </motion.div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={fadeUpVariants} className="pt-2">
            <button
              id="btn-get-started"
              onClick={() => setActivePage('scan')}
              className="group bg-[#495c27] hover:bg-[#3d4c20] text-white px-8 py-3.5 rounded-full text-xs md:text-sm font-semibold tracking-[0.15em] shadow-[0_6px_20px_rgba(73,92,39,0.25)] transition-all flex items-center gap-3 hover:scale-[1.015] active:scale-[0.985] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
            >
              <span>BEGIN SKIN SCAN</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>

        {/* Right Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 flex justify-center lg:justify-end items-center relative"
        >
          <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
            {/* Soft glowing ambient circle */}
            <div className="absolute inset-0 bg-[#ebe1ce]/60 rounded-full filter blur-3xl -z-10 transform scale-90" />

            <img
              src={IMAGES.mortarHerbs}
              alt="Ayurvedic herbs and fresh amla in wooden mortar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-3xl drop-shadow-[0_20px_35px_rgba(80,70,50,0.16)] transition-transform duration-700 hover:scale-[1.015]"
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Floating 4-Pillars Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-5xl mx-auto w-full mt-6"
      >
        <div className="bg-[#faf6ee]/90 backdrop-blur-md border border-[#e8dfce] rounded-2xl py-3.5 px-4 sm:px-8 shadow-[0_4px_20px_rgba(95,80,55,0.05)] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-2 items-center font-sans">
          {/* Pillar 1 */}
          <div className="flex items-center gap-3 justify-center md:border-r border-[#ded2be] pr-2">
            <div className="w-8 h-8 rounded-full bg-[#eee5d3] flex items-center justify-center text-[#495c27]">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#4d4231] uppercase">
              AYURVEDIC WISDOM
            </span>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-center gap-3 justify-center md:border-r border-[#ded2be] pr-2">
            <div className="w-8 h-8 rounded-full bg-[#eee5d3] flex items-center justify-center text-[#495c27]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M12 2v6m-4-2l4 4 4-4M4 11h16a8 8 0 0 1-16 0z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#4d4231] uppercase">
              NATURAL BOTANICALS
            </span>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-center gap-3 justify-center md:border-r border-[#ded2be] pr-2">
            <div className="w-8 h-8 rounded-full bg-[#eee5d3] flex items-center justify-center text-[#495c27]">
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
            <div className="w-8 h-8 rounded-full bg-[#eee5d3] flex items-center justify-center text-[#495c27]">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#4d4231] uppercase">
              SAFE &amp; EFFECTIVE
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
