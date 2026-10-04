import React, { useEffect } from 'react';
import { X, Sun, Moon, Clock, Leaf, AlertTriangle, Utensils, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { modalOverlayVariants, modalContentVariants } from '../utils/animations';

interface RemediesModalProps {
  isOpen: boolean;
  onClose: () => void;
  condition: string;
  remedyText?: string;
  dietText?: string;
  remediesArray?: any[];
  dietArray?: any[];
}

export interface RemedyCardItem {
  id: string;
  name: string;
  category?: string;
  description?: string;
  morningDosage: string;
  nightDosage: string;
  duration: string;
}

export const RemediesModal: React.FC<RemediesModalProps> = ({
  isOpen,
  onClose,
  condition,
  remedyText,
  dietText,
  remediesArray,
  dietArray,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Parse remedy items
  const parseRemedies = (): RemedyCardItem[] => {
    if (Array.isArray(remediesArray) && remediesArray.length > 0) {
      return remediesArray.map((rec, idx) => ({
        id: `rec-arr-${idx}`,
        name: rec.medicine_name || rec.name || rec.remedy || `Remedy #${idx + 1}`,
        category: rec.category || 'Ayurvedic Treatment',
        description: rec.description || rec.usage || rec.precautions,
        morningDosage: rec.morning_dosage || rec.morning || '1 Dose / Application',
        nightDosage: rec.night_dosage || rec.night || '1 Dose / Application',
        duration: rec.duration || 'Up to 15 Days max',
      }));
    }

    if (!remedyText || typeof remedyText !== 'string' || remedyText.trim() === '') {
      return [
        {
          id: 'rec-def-1',
          name: 'Neem & Tulsi Herbal Formulation',
          category: 'Topical Application',
          description: 'Natural antibacterial paste to purify skin glands and soothe inflammation.',
          morningDosage: '1 Dose / Application',
          nightDosage: '1 Dose / Application',
          duration: 'Up to 15 Days max',
        },
      ];
    }

    // Split raw string by |, ;, or newlines
    const parts = remedyText
      .split(/\||;|\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    const list = parts.length > 0 ? parts : [remedyText];

    return list.map((part, idx) => {
      let name = part;
      let desc = '';
      const colonIdx = part.indexOf(':');
      if (colonIdx > 0) {
        name = part.substring(0, colonIdx).trim();
        desc = part.substring(colonIdx + 1).trim();
      }
      return {
        id: `rec-str-${idx}`,
        name: name || `Ayurvedic Remedy #${idx + 1}`,
        category: 'Ayurvedic Botanical Prescription',
        description: desc || 'Herbal formulation recommended for natural skin restoration.',
        morningDosage: '1 Dose / Application',
        nightDosage: '1 Dose / Application',
        duration: 'Up to 15 Days max',
      };
    });
  };

  // Parse diet items
  const parseDiet = (): string[] => {
    if (Array.isArray(dietArray) && dietArray.length > 0) {
      return dietArray.map(
        (d) => `${d.food || d.item || 'Dietary Item'}${d.description ? `: ${d.description}` : ''}`
      );
    }

    if (!dietText || typeof dietText !== 'string' || dietText.trim() === '') {
      return [
        'Favor cooling Pitta-pacifying foods: fresh amla, coconut water, and cucumber.',
        'Maintain adequate hydration with lukewarm water throughout the day.',
        'Avoid excessively spicy, deep-fried, or fermented food items.',
      ];
    }

    const items = dietText
      .split(/\. |\n|\||;/)
      .map((s) => s.trim().replace(/^[-•*]\s*/, ''))
      .filter((s) => s.length > 3);

    return items.length > 0 ? items : [dietText];
  };

  const remedyItems = parseRemedies();
  const dietItems = parseDiet();

  return (
    <AnimatePresence>
      <motion.div
        variants={modalOverlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={onClose}
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
          aria-labelledby="modal-remedies-title"
          id="modal-remedies"
          className="bg-[#faf5ec] border border-[#d8cbb8] rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative font-sans text-[#332b20]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close remedies modal"
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#eee5d3] hover:bg-[#dfd4be] flex items-center justify-center text-[#554b38] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#495c27] font-semibold tracking-widest uppercase mb-1 bg-[#eef4e3] px-3 py-1 rounded-full border border-[#cbe0b2]">
              <Pill className="w-3.5 h-3.5 text-[#495c27]" />
              <span>Ayurvedic Remedies &amp; Medicines</span>
            </div>
            <h3 id="modal-remedies-title" className="font-serif-title font-bold text-2xl sm:text-3xl text-[#2c3817] mt-1">
              Treatment Plan for {condition}
            </h3>
            <p className="text-xs sm:text-sm text-[#706450] mt-1 font-sans">
              Tailored dosage guidelines and dietary recommendations from backend evaluation.
            </p>
          </div>

          {/* Remedies List */}
          <div className="space-y-4 mb-6">
            <h4 className="text-xs font-bold text-[#495c27] uppercase tracking-wider flex items-center gap-1.5">
              <Leaf className="w-4 h-4" />
              <span>Recommended Medicines &amp; Treatments ({remedyItems.length})</span>
            </h4>

            {remedyItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#f5ede0] border border-[#e2d6c1] rounded-2xl p-4 sm:p-5 shadow-xs transition-all hover:border-[#c9b89e]"
              >
                {/* Item Name & Category */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#495c27] text-white flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-serif-title font-bold text-base text-[#2c3817] leading-tight">
                        {item.name}
                      </h5>
                      <span className="text-[10px] text-[#786c5a] font-semibold uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Duration Tag */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8a5314] bg-[#fcf2e3] border border-[#e8ceaa] px-3 py-1 rounded-full shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-[#b86e14]" />
                    <span>Up to 15 Days max</span>
                  </div>
                </div>

                {/* Description if present */}
                {item.description && (
                  <p className="text-xs text-[#5e5240] mt-2 leading-relaxed bg-[#ede2d1]/50 p-2.5 rounded-xl border border-[#ded2be]/60">
                    {item.description}
                  </p>
                )}

                {/* Dosage Breakdown (Structured Badges/Columns) */}
                <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-[#ebf3e6] border border-[#cbe0b2] rounded-xl p-2.5 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#d4e7c5] flex items-center justify-center text-amber-600 flex-shrink-0">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#495c27] tracking-wider block">
                        ☀️ Morning Dosage
                      </span>
                      <span className="text-xs font-semibold text-[#2c3817]">
                        {item.morningDosage}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#eef2f8] border border-[#cbd8eb] rounded-xl p-2.5 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#d5e2f3] flex items-center justify-center text-indigo-700 flex-shrink-0">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-900 tracking-wider block">
                        🌙 Night Dosage
                      </span>
                      <span className="text-xs font-semibold text-[#2c3817]">
                        {item.nightDosage}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dietary Recommendations Section */}
          <div className="bg-[#efe5d3] border border-[#ded1ba] rounded-2xl p-4 sm:p-5 mb-6 shadow-xs">
            <h4 className="text-xs font-bold text-[#2c3817] uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#495c27]" />
              <span>Dietary &amp; Lifestyle Recommendations</span>
            </h4>
            <div className="space-y-2">
              {dietItems.map((point, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#524634]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#495c27] mt-1.5 flex-shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Disclaimer Box (Footer) */}
          <div className="bg-[#fff8eb] border border-[#ecd299] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#7c5b16] shadow-xs mb-6">
            <AlertTriangle className="w-5 h-5 text-[#c2840e] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans font-medium">
              <span className="font-bold text-[#946109]">⚠️ Disclaimer:</span> This is an AI-generated suggestion. Please consult a certified dermatologist before taking any medication.
            </p>
          </div>

          {/* Footer Action */}
          <div className="flex justify-end pt-2 border-t border-[#e5d8c5]">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#495c27] hover:bg-[#3d4c20] text-white text-xs font-semibold tracking-wider transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
            >
              Close Plan
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
