import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, CheckCircle2, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { modalOverlayVariants, modalContentVariants } from '../utils/animations';

export const RecommendationsModal: React.FC = () => {
  const { showRecommendationsModal, setShowRecommendationsModal, user, showToast, setActivePage } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showRecommendationsModal) {
        setShowRecommendationsModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showRecommendationsModal, setShowRecommendationsModal]);

  if (!showRecommendationsModal) return null;

  const handleApplyToRoutine = () => {
    showToast('Your daily routine has been synchronized with these recommendations!');
    setShowRecommendationsModal(false);
    setActivePage('profile');
  };

  return (
    <motion.div
      variants={modalOverlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={() => setShowRecommendationsModal(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
    >
      <motion.div
        variants={modalContentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-rec-title"
        id="modal-recommendations"
        className="bg-[#faf5ec] border border-[#d8cbb8] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative font-sans text-[#332b20]"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowRecommendationsModal(false)}
          aria-label="Close recommendations"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#eee5d3] hover:bg-[#dfd4be] flex items-center justify-center text-[#554b38] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#495c27] font-semibold tracking-widest uppercase mb-1">
            <Leaf className="w-3.5 h-3.5" />
            <span>Ayurvedic Botanical Prescription</span>
            <Leaf className="w-3.5 h-3.5" />
          </div>
          <h3 id="modal-rec-title" className="font-serif-title font-bold text-2xl sm:text-3xl text-[#2c3817]">
            Tailored For Your Skin
          </h3>
          <p className="text-xs sm:text-sm text-[#706450] mt-1 font-sans">
            Custom Pitta-Kapha pacifying regimen designed for <span className="font-semibold text-[#2c3817]">{user.skinType}</span> skin &amp; mild acne recovery.
          </p>
        </div>

        {/* Regimen Cards */}
        <div className="space-y-3 mb-6">
          <div className="bg-[#f5ede0] border border-[#e2d6c1] rounded-2xl p-4 flex items-start gap-3.5 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#495c27] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold font-sans">
              01
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-sm text-[#2c3817]">Cleanse: Neem &amp; Tulsi Face Wash</h4>
                <span className="text-[10px] bg-[#e7dbca] text-[#4f4333] px-2 py-0.5 rounded-full font-semibold">Twice Daily</span>
              </div>
              <p className="text-xs text-[#695d49] mt-1 leading-relaxed">
                Antiseptic action clears clogged sebum, inhibits acne-causing bacteria without stripping the lipid mantle.
              </p>
            </div>
          </div>

          <div className="bg-[#f5ede0] border border-[#e2d6c1] rounded-2xl p-4 flex items-start gap-3.5 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#495c27] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold font-sans">
              02
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-sm text-[#2c3817]">Tone: Damask Rose Water Mist</h4>
                <span className="text-[10px] bg-[#e7dbca] text-[#4f4333] px-2 py-0.5 rounded-full font-semibold">Morning &amp; Evening</span>
              </div>
              <p className="text-xs text-[#695d49] mt-1 leading-relaxed">
                Cooling hydrosol calms inflammation, tightens open pores, and restores delicate skin barrier pH balance.
              </p>
            </div>
          </div>

          <div className="bg-[#f5ede0] border border-[#e2d6c1] rounded-2xl p-4 flex items-start gap-3.5 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#495c27] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold font-sans">
              03
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-sm text-[#2c3817]">Treat: Holy Basil (Tulsi) Acne Gel</h4>
                <span className="text-[10px] bg-[#e7dbca] text-[#4f4333] px-2 py-0.5 rounded-full font-semibold">Target Spot Care</span>
              </div>
              <p className="text-xs text-[#695d49] mt-1 leading-relaxed">
                Potent adaptogenic actives penetrate blemish clusters, soothing erythema and preventing hyperpigmentation.
              </p>
            </div>
          </div>

          <div className="bg-[#f5ede0] border border-[#e2d6c1] rounded-2xl p-4 flex items-start gap-3.5 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#495c27] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold font-sans">
              04
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-sm text-[#2c3817]">Moisturize: Cold-Pressed Pure Aloe Vera</h4>
                <span className="text-[10px] bg-[#e7dbca] text-[#4f4333] px-2 py-0.5 rounded-full font-semibold">Hydration Shield</span>
              </div>
              <p className="text-xs text-[#695d49] mt-1 leading-relaxed">
                Non-comedogenic natural gel feeds thirsty epidermal layers without adding heaviness to the T-zone.
              </p>
            </div>
          </div>

          <div className="bg-[#f5ede0] border border-[#e2d6c1] rounded-2xl p-4 flex items-start gap-3.5 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#495c27] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold font-sans">
              05
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-sm text-[#2c3817]">Nourish: Manjistha &amp; Kumkumadi Night Nectar</h4>
                <span className="text-[10px] bg-[#e7dbca] text-[#4f4333] px-2 py-0.5 rounded-full font-semibold">Night Repair</span>
              </div>
              <p className="text-xs text-[#695d49] mt-1 leading-relaxed">
                Warm 2 drops in palms and press gently into skin. Helps fade post-acne marks and restores radiant Ojas.
              </p>
            </div>
          </div>
        </div>

        {/* Dietary & Lifestyle Harmony */}
        <div className="bg-[#efe5d3] border border-[#ded1ba] rounded-2xl p-4 mb-6 text-xs text-[#554b38] shadow-xs">
          <div className="font-semibold flex items-center gap-1.5 text-[#2c3817] mb-1">
            <Sparkles className="w-4 h-4 text-[#495c27]" />
            <span>Ayurvedic Lifestyle &amp; Dietary Guidance</span>
          </div>
          <p className="leading-relaxed text-[#5a4e3d]">
            Drink lukewarm CCF tea (Cumin, Coriander, Fennel seeds) daily. Sip copper-infused water in the morning. Minimize fermented and sour foods while prioritizing amla, cucumber, and fresh leafy greens.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-end pt-2 border-t border-[#e5d8c5]">
          <button
            onClick={() => setShowRecommendationsModal(false)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#b8a994] text-[#5b4f3b] text-xs font-semibold hover:bg-[#ebe0cb] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
          >
            Close
          </button>
          <button
            onClick={handleApplyToRoutine}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#495c27] hover:bg-[#3d4c20] text-white text-xs font-semibold tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply to My Active Routine 🌿</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
