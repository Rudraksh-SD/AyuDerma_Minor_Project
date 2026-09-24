import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, Activity, CheckCircle, Trash2, Leaf, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { modalOverlayVariants, modalContentVariants } from '../utils/animations';

export const ScanDetailModal: React.FC = () => {
  const { selectedScan, setSelectedScan, setShowRecommendationsModal, deleteScan } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedScan) {
        setSelectedScan(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedScan, setSelectedScan]);

  if (!selectedScan) return null;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this scan record from your history?')) {
      await deleteScan(selectedScan.id);
      setSelectedScan(null);
    }
  };

  return (
    <motion.div
      variants={modalOverlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={() => setSelectedScan(null)}
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
        aria-labelledby="modal-scan-detail-title"
        id="modal-scan-detail"
        className="bg-[#faf5ec] border border-[#d8cbb8] rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative font-sans text-[#332b20]"
      >
        <button
          onClick={() => setSelectedScan(null)}
          aria-label="Close scan report"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#eee5d3] hover:bg-[#dfd4be] flex items-center justify-center text-[#554b38] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={selectedScan.thumbnailUrl}
            alt="Skin scan capture"
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-2xl object-cover border border-[#d8ccb8] shadow-xs flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-3 text-xs text-[#706450]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#495c27]" />
                {selectedScan.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#495c27]" />
                {selectedScan.time}
              </span>
            </div>
            <h3 id="modal-scan-detail-title" className="font-serif-title font-bold text-2xl text-[#2c3817] mt-0.5">
              Skin Analysis Report
            </h3>
            <p className="text-xs text-[#526432] mt-0.5 font-sans">
              Disease: <span className="font-bold">{selectedScan.primaryConcern}</span> &bull; Confidence: {selectedScan.confidence}
            </p>
          </div>
        </div>

        {/* Score & Confidence Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 text-center">
          <div className="bg-[#f3eadc] border border-[#ded1bd] rounded-2xl p-3 shadow-xs">
            <div className="text-[10px] text-[#716550] uppercase tracking-wider font-semibold">Skin Score</div>
            <div className="font-serif-title font-bold text-2xl text-[#2c3817] mt-1">{selectedScan.skinScore}/100</div>
            <div className="text-[10px] text-[#495c27] font-semibold">{selectedScan.scoreLabel}</div>
          </div>
          <div className="bg-[#f3eadc] border border-[#ded1bd] rounded-2xl p-3 shadow-xs">
            <div className="text-[10px] text-[#716550] uppercase tracking-wider font-semibold">Predicted Disease</div>
            <div className="text-xs font-bold text-[#2c3817] mt-1 truncate">{selectedScan.primaryConcern}</div>
            <div className="text-[10px] text-[#716550]">Diagnosis</div>
          </div>
          <div className="bg-[#f3eadc] border border-[#ded1bd] rounded-2xl p-3 shadow-xs">
            <div className="text-[10px] text-[#716550] uppercase tracking-wider font-semibold">Severity</div>
            <div className="text-xs font-bold text-[#2c3817] mt-1">{selectedScan.severity}</div>
            <div className="text-[10px] text-[#716550]">{selectedScan.severityLevel}</div>
          </div>
          <div className="bg-[#f3eadc] border border-[#ded1bd] rounded-2xl p-3 shadow-xs">
            <div className="text-[10px] text-[#716550] uppercase tracking-wider font-semibold">Confidence</div>
            <div className="text-xs font-bold text-[#2c3817] mt-1">{selectedScan.confidence}</div>
            <div className="text-[10px] text-[#716550]">{selectedScan.accuracy}</div>
          </div>
        </div>

        {/* Symptoms & Causes Section */}
        {(selectedScan.symptoms || selectedScan.probable_cause) && (
          <div className="bg-[#f5ecdd] border border-[#ded1be] rounded-2xl p-4 mb-4 shadow-xs space-y-2 text-xs">
            {selectedScan.symptoms && (
              <div>
                <span className="font-bold text-[#2c3817] uppercase tracking-wider text-[10px] block">Detected Symptoms:</span>
                <p className="text-[#554a37] mt-0.5">{selectedScan.symptoms}</p>
              </div>
            )}
            {selectedScan.probable_cause && (
              <div>
                <span className="font-bold text-[#2c3817] uppercase tracking-wider text-[10px] block">Probable Cause (Dosha):</span>
                <p className="text-[#554a37] mt-0.5">{selectedScan.probable_cause}</p>
              </div>
            )}
          </div>
        )}

        {/* Ayurvedic & Diet Recommendations */}
        <div className="bg-[#f2e7d7] border border-[#dacdb9] rounded-2xl p-4 mb-5 shadow-xs space-y-3">
          <div>
            <h4 className="text-xs font-semibold text-[#443827] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#495c27]" />
              <span>Ayurvedic Herbal Recommendation</span>
            </h4>
            <p className="text-xs text-[#3d3324]">
              {selectedScan.ayurvedic_remedy || selectedScan.recommendedRoutine.join(', ')}
            </p>
          </div>

          {selectedScan.diet_recommendation && (
            <div className="pt-2 border-t border-[#e2d5c1]">
              <h4 className="text-xs font-semibold text-[#443827] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#495c27]" />
                <span>Dietary Recommendation</span>
              </h4>
              <p className="text-xs text-[#3d3324]">{selectedScan.diet_recommendation}</p>
            </div>
          )}
        </div>

        {/* Factors breakdown */}
        {selectedScan.factors && (
          <div className="bg-[#f5ecdd] border border-[#ded1be] rounded-2xl p-4 mb-5 shadow-xs">
            <h4 className="text-xs font-semibold text-[#443827] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#495c27]" />
              <span>Ayurvedic Skin Health Factors</span>
            </h4>
            <div className="space-y-2.5">
              {Object.entries(selectedScan.factors).map(([factorName, factor]) => {
                const factorData = factor as { score: number; label: string };
                return (
                  <div key={factorName} className="text-xs">
                    <div className="flex justify-between text-[#4c4233] mb-1 capitalize font-medium">
                      <span>{factorName}</span>
                      <span className="font-semibold text-[#2c3817]">
                        {factorData.score}% ({factorData.label})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#e2d5c0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#495c27] rounded-full transition-all duration-500"
                        style={{ width: `${factorData.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-[#e5d8c5]">
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-full border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors focus:outline-none"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Record</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedScan(null)}
              className="px-4 py-2 rounded-full border border-[#bfae96] text-[#554a36] text-xs font-semibold hover:bg-[#eae0cb] transition-colors focus:outline-none"
            >
              Back
            </button>
            <button
              onClick={() => {
                setSelectedScan(null);
                setShowRecommendationsModal(true);
              }}
              className="px-5 py-2 rounded-full bg-[#495c27] hover:bg-[#3d4c20] text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-sm transition-all focus:outline-none"
            >
              <span>Full Regimen 🌿</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
