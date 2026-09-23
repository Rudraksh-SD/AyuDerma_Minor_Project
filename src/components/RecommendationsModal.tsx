import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, CheckCircle2, Droplets, Leaf } from 'lucide-react';

export const RecommendationsModal: React.FC = () => {
  const { showRecommendationsModal, setShowRecommendationsModal, user, showToast, setActivePage } = useApp();

  if (!showRecommendationsModal) return null;

  const handleApplyToRoutine = () => {
    showToast('Your daily routine has been synchronized with these recommendations!');
    setShowRecommendationsModal(false);
    setActivePage('profile');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-recommendations"
        className="bg-[#faf5ec] border border-[#d8cbb8] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowRecommendationsModal(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#eee5d3] hover:bg-[#dfd4be] flex items-center justify-center text-[#554b38] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#526532] font-semibold tracking-widest uppercase mb-1">
            <Leaf className="w-3.5 h-3.5" />
            <span>Ayurvedic Botanical Prescription</span>
            <Leaf className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-kunstler text-4xl text-[#394a1d]">Tailored For Your Skin</h3>
          <p className="font-handwriting text-sm text-[#706450] mt-1">
            Custom Pitta-Kapha pacifying regimen designed for {user.skinType} skin &amp; mild acne recovery.
          </p>
        </div>

        {/* Regimen Cards */}
        <div className="space-y-3.5 mb-6">
          <div className="bg-[#f5ede0] border border-[#e2d6c1] rounded-2xl p-3.5 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-[#4a5e29] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold font-handwriting">
              01
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-[#384a1d]">Cleanse: Neem &amp; Tulsi Face Wash</h4>
                <span className="text-[10px] bg-[#e7dbca] text-[#4f4333] px-2 py-0.5 rounded-full font-medium">Twice Daily</span>
              </div>
              <p className="text-xs text-[#695d49] mt-0.5 leading-relaxed">
                Antiseptic action clears clogged sebum, inhibits acne-causing bacteria without stripping the lipid mantle.
              </p>
            </div>
          </div>

          <div className="bg-[#f5ede0] border border-[#e2d6c1] rounded-2xl p-3.5 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-[#4a5e29] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold font-handwriting">
              02
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-[#384a1d]">Tone: Damask Rose Water Mist</h4>
                <span className="text-[10px] bg-[#e7dbca] text-[#4f4333] px-2 py-0.5 rounded-full font-medium">Morning &amp; Evening</span>
              </div>
              <p className="text-xs text-[#695d49] mt-0.5 leading-relaxed">
                Cooling hydrosol calms inflammation, tightens open pores, and restores delicate skin barrier pH balance.
              </p>
            </div>
          </div>

          <div className="bg-[#f5ede0] border border-[#e2d6c1] rounded-2xl p-3.5 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-[#4a5e29] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold font-handwriting">
              03
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-[#384a1d]">Treat: Holy Basil (Tulsi) Acne Gel</h4>
                <span className="text-[10px] bg-[#e7dbca] text-[#4f4333] px-2 py-0.5 rounded-full font-medium">Target Spot Care</span>
              </div>
              <p className="text-xs text-[#695d49] mt-0.5 leading-relaxed">
                Potent adaptogenic actives penetrate blemish clusters, soothing erythema and preventing hyperpigmentation.
              </p>
            </div>
          </div>

          <div className="bg-[#f5ede0] border border-[#e2d6c1] rounded-2xl p-3.5 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-[#4a5e29] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold font-handwriting">
              04
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-[#384a1d]">Moisturize: Cold-Pressed Pure Aloe Vera</h4>
                <span className="text-[10px] bg-[#e7dbca] text-[#4f4333] px-2 py-0.5 rounded-full font-medium">Hydration Shield</span>
              </div>
              <p className="text-xs text-[#695d49] mt-0.5 leading-relaxed">
                Non-comedogenic natural gel feeds thirsty epidermal layers without adding heaviness to the T-zone.
              </p>
            </div>
          </div>

          <div className="bg-[#f5ede0] border border-[#e2d6c1] rounded-2xl p-3.5 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-[#4a5e29] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold font-handwriting">
              05
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-[#384a1d]">Nourish: Manjistha &amp; Kumkumadi Night Nectar</h4>
                <span className="text-[10px] bg-[#e7dbca] text-[#4f4333] px-2 py-0.5 rounded-full font-medium">Night Repair</span>
              </div>
              <p className="text-xs text-[#695d49] mt-0.5 leading-relaxed">
                Warm 2 drops in palms and press gently into skin. Helps fade post-acne marks and restores radiant Ojas.
              </p>
            </div>
          </div>
        </div>

        {/* Dietary & Lifestyle Harmony */}
        <div className="bg-[#efe5d3] border border-[#ded1ba] rounded-2xl p-4 mb-6 text-xs text-[#554b38]">
          <div className="font-semibold flex items-center gap-1.5 text-[#3b4b1e] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ayurvedic Lifestyle Prescription</span>
          </div>
          <p className="leading-relaxed">
            Drink lukewarm CCF tea (Cumin, Coriander, Fennel seeds) daily. Sip copper-infused water in the morning. Minimize fermented and sour foods while prioritizing amla, cucumber, and fresh leafy greens.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
          <button
            onClick={() => setShowRecommendationsModal(false)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#b8a994] text-[#5b4f3b] text-xs font-semibold hover:bg-[#ebe0cb] transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleApplyToRoutine}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#495b28] hover:bg-[#3d4c20] text-white text-xs font-semibold tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply to My Active Routine 🌿</span>
          </button>
        </div>
      </div>
    </div>
  );
};
