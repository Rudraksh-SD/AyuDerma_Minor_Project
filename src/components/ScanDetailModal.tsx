import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, Activity, CheckCircle, Shield, Droplet } from 'lucide-react';

export const ScanDetailModal: React.FC = () => {
  const { selectedScan, setSelectedScan, setShowRecommendationsModal } = useApp();

  if (!selectedScan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-scan-detail"
        className="bg-[#faf5ec] border border-[#d8cbb8] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative"
      >
        <button
          onClick={() => setSelectedScan(null)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#eee5d3] hover:bg-[#dfd4be] flex items-center justify-center text-[#554b38] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={selectedScan.thumbnailUrl}
            alt="Skin scan capture"
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-2xl object-cover border border-[#d8ccb8] shadow-sm"
          />
          <div>
            <div className="flex items-center gap-3 text-xs text-[#706450]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#516431]" />
                {selectedScan.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#516431]" />
                {selectedScan.time}
              </span>
            </div>
            <h3 className="font-kunstler text-4xl text-[#394a1d]">Scan Report</h3>
            <p className="font-handwriting text-xs text-[#526432]">
              Skin Type: <span className="font-bold">{selectedScan.skinType}</span> &bull; Condition: {selectedScan.scoreLabel}
            </p>
          </div>
        </div>

        {/* Score & Confidence Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 text-center">
          <div className="bg-[#f3eadc] border border-[#ded1bd] rounded-2xl p-3">
            <div className="text-[10px] text-[#716550] uppercase tracking-wider font-semibold">Skin Score</div>
            <div className="font-kunstler text-3xl text-[#3d5021]">{selectedScan.skinScore}/100</div>
            <div className="text-[10px] text-[#4f5f2a] font-handwriting">{selectedScan.scoreLabel}</div>
          </div>
          <div className="bg-[#f3eadc] border border-[#ded1bd] rounded-2xl p-3">
            <div className="text-[10px] text-[#716550] uppercase tracking-wider font-semibold">Concern</div>
            <div className="text-sm font-bold text-[#3d5021] mt-1">{selectedScan.primaryConcern}</div>
            <div className="text-[10px] text-[#716550]">Primary</div>
          </div>
          <div className="bg-[#f3eadc] border border-[#ded1bd] rounded-2xl p-3">
            <div className="text-[10px] text-[#716550] uppercase tracking-wider font-semibold">Severity</div>
            <div className="text-sm font-bold text-[#3d5021] mt-1">{selectedScan.severity}</div>
            <div className="text-[10px] text-[#716550]">{selectedScan.severityLevel}</div>
          </div>
          <div className="bg-[#f3eadc] border border-[#ded1bd] rounded-2xl p-3">
            <div className="text-[10px] text-[#716550] uppercase tracking-wider font-semibold">Confidence</div>
            <div className="text-sm font-bold text-[#3d5021] mt-1">{selectedScan.confidence}</div>
            <div className="text-[10px] text-[#716550]">{selectedScan.accuracy}</div>
          </div>
        </div>

        {/* Factors breakdown */}
        <div className="bg-[#f5ecdd] border border-[#ded1be] rounded-2xl p-4 mb-5">
          <h4 className="text-xs font-semibold text-[#443827] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#4a5e29]" />
            <span>Ayurvedic Skin Health Factors</span>
          </h4>
          <div className="space-y-2.5">
            {Object.entries(selectedScan.factors).map(([factorName, factor]) => {
              const factorData = factor as { score: number; label: string };
              return (
                <div key={factorName} className="text-xs">
                  <div className="flex justify-between text-[#4c4233] mb-1 capitalize">
                    <span>{factorName}</span>
                    <span className="font-semibold text-[#3b4c1f]">
                      {factorData.score}% ({factorData.label})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#e2d5c0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4c5f2b] rounded-full transition-all duration-500"
                      style={{ width: `${factorData.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Routine */}
        <div className="bg-[#f2e7d7] border border-[#dacdb9] rounded-2xl p-4 mb-6">
          <h4 className="text-xs font-semibold text-[#443827] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#4a5e29]" />
            <span>Recommended Herbal Regimen</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedScan.recommendedRoutine.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-[#faf6ef] border border-[#d6c7b2] text-[#423725] px-3 py-1.5 rounded-full text-xs font-medium"
              >
                🌿 {item}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setSelectedScan(null)}
            className="px-5 py-2 rounded-full border border-[#bfae96] text-[#554a36] text-xs font-semibold hover:bg-[#eae0cb] transition-colors"
          >
            Back to History
          </button>
          <button
            onClick={() => {
              setSelectedScan(null);
              setShowRecommendationsModal(true);
            }}
            className="px-6 py-2 rounded-full bg-[#495b28] hover:bg-[#3d4c20] text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>View Full Herbal Recommendations 🌿</span>
          </button>
        </div>
      </div>
    </div>
  );
};
