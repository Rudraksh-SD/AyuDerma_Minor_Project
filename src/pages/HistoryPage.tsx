import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, Leaf, ChevronRight, ShieldCheck, Trash2, Loader2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fadeUpVariants, cardHoverProps } from '../utils/animations';

export const HistoryPage: React.FC = () => {
  const { scans, setSelectedScan, deleteScan, historyLoading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredScans = scans.filter((scan) => {
    const matchesSearch =
      scan.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.skinType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.primaryConcern.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scan.symptoms && scan.symptoms.toLowerCase().includes(searchQuery.toLowerCase())) ||
      scan.concerns.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      scan.recommendedRoutine.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'All') return true;
    if (filterType === 'Combination') return scan.skinType === 'Combination';
    if (filterType === 'Oily') return scan.skinType === 'Oily';
    if (filterType === 'Good Score') return scan.skinScore >= 75;
    return true;
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this scan record from your history?')) {
      await deleteScan(id);
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between px-6 md:px-14 py-6 md:py-8 font-sans text-[#2c2823]">
      {/* Background shadow leaf */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none opacity-20 select-none -z-10">
        <svg viewBox="0 0 200 200" fill="#4d5f2a" className="w-full h-full filter blur-[1px]">
          <path d="M20,10 Q60,40 40,90 Q80,70 110,120 Q60,110 30,150 Q70,160 50,200 Q20,130 10,80 Z" opacity="0.6" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Top Header Row with Search & Filter */}
        <motion.div variants={fadeUpVariants} initial="initial" animate="animate" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-widest text-[#495c27] uppercase block">SUPABASE DISEASE SEARCHES</span>
            <h1 className="font-serif-title font-bold text-4xl sm:text-5xl text-[#2c3817] leading-tight select-none mt-0.5">
              Skin Scan History
            </h1>
            <p className="text-xs sm:text-sm text-[#665a48] mt-1">
              Review historical skin disease searches, detected symptoms, and herbal prescriptions.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-[#8a7d69]" />
              <input
                id="input-search-history"
                type="text"
                placeholder="Search by disease, symptoms, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#faf5ec]/90 backdrop-blur-md border border-[#e5dcce] rounded-full pl-10 pr-4 py-2 text-xs text-[#3d3424] placeholder-[#958874] w-60 sm:w-72 shadow-xs focus:outline-none focus:ring-1 focus:ring-[#495c27]"
              />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                id="btn-filter-history"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="bg-[#faf5ec]/90 backdrop-blur-md border border-[#e5dcce] rounded-full px-4 py-2 text-xs font-semibold text-[#4d4231] flex items-center gap-1.5 shadow-xs hover:bg-[#f3eadc] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
              >
                <Filter className="w-3.5 h-3.5 text-[#495c27]" />
                <span>Filter: {filterType}</span>
                <span className="text-[10px]">⌵</span>
              </button>

              <AnimatePresence>
                {showFilterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 w-44 bg-[#faf5ec] border border-[#d8cdbd] rounded-2xl p-2 shadow-xl z-20 space-y-1 text-xs"
                  >
                    {['All', 'Combination', 'Oily', 'Good Score'].map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setFilterType(t);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl font-sans transition-colors ${
                          filterType === t
                            ? 'bg-[#495c27] text-white font-semibold'
                            : 'text-[#4c412f] hover:bg-[#eee3d1]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-10 space-y-4">
          {/* Vertical Timeline Guide Line */}
          <div className="absolute left-2.5 sm:left-4 top-4 bottom-4 w-[2px] bg-[#d9cdba]" />

          {historyLoading ? (
            <div className="bg-[#faf5ec]/80 rounded-3xl p-10 text-center border border-[#e8ded0] flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#495c27]" />
              <p className="text-xs font-sans font-semibold text-[#495c27]">
                Retrieving patient disease search history from Supabase...
              </p>
            </div>
          ) : filteredScans.length === 0 ? (
            <div className="bg-[#faf5ec]/80 rounded-3xl p-10 text-center border border-[#e8ded0]">
              <p className="text-sm font-sans text-[#786c59]">
                No skin scan history records found.
              </p>
            </div>
          ) : (
            filteredScans.map((scan) => {
              const dateParts = scan.date ? scan.date.split(' ') : ['01', 'Jan', '2024'];
              const day = dateParts[0] || '01';
              const month = dateParts[1] || 'Jan';
              const year = dateParts[2] || '2024';

              return (
                <div key={scan.id} className="relative flex items-center">
                  {/* Timeline Circle Node */}
                  <div className="absolute -left-6 sm:-left-10 w-5 h-5 rounded-full border-2 border-[#495c27] bg-[#faf5ec] flex items-center justify-center z-10 shadow-xs">
                    <div className="w-2 h-2 rounded-full bg-[#495c27]" />
                  </div>

                  {/* Timeline Card */}
                  <motion.div
                    {...cardHoverProps}
                    onClick={() => setSelectedScan(scan)}
                    className="w-full bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-all cursor-pointer group"
                  >
                    {/* Date Block */}
                    <div className="md:col-span-2 flex items-center md:flex-col md:items-start border-b md:border-b-0 md:border-r border-[#e8ded0] pb-2 md:pb-0 md:pr-4">
                      <span className="font-sans text-3xl sm:text-4xl font-extrabold text-[#2c3817] leading-none">
                        {day}
                      </span>
                      <div className="ml-3 md:ml-0 md:mt-1">
                        <div className="text-xs font-semibold text-[#5c503d]">
                          {month} {year}
                        </div>
                        <div className="text-[10px] text-[#8c7f6d]">{scan.time}</div>
                      </div>
                    </div>

                    {/* Skin Thumbnail */}
                    <div className="md:col-span-2 flex justify-start md:justify-center">
                      <img
                        src={scan.thumbnailUrl}
                        alt="Uploaded skin scan"
                        referrerPolicy="no-referrer"
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#d8cdbc] shadow-2xs group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Predicted Disease & Symptoms */}
                    <div className="md:col-span-3 space-y-1">
                      <div className="text-[10px] text-[#867a68] uppercase tracking-wider font-semibold">
                        Predicted Disease
                      </div>
                      <h4 className="font-serif-title text-base font-bold text-[#2c3817] leading-tight">
                        {scan.primaryConcern}
                      </h4>

                      {scan.symptoms && (
                        <p className="text-[11px] text-[#635644] line-clamp-2 font-sans">
                          <span className="font-semibold">Symptoms:</span> {scan.symptoms}
                        </p>
                      )}
                    </div>

                    {/* Confidence & Severity */}
                    <div className="md:col-span-2 flex flex-col items-center text-center">
                      <div className="text-[10px] text-[#867a68] uppercase tracking-wider font-semibold mb-0.5">
                        Confidence
                      </div>
                      <div className="text-base font-bold text-[#2c3817]">
                        {scan.confidence}
                      </div>
                      <span className="text-[10px] font-semibold text-[#495c27] mt-0.5">
                        {scan.accuracy}
                      </span>
                    </div>

                    {/* Ayurvedic & Diet Recommendation */}
                    <div className="md:col-span-3 flex items-center justify-between gap-3 border-t md:border-t-0 md:border-l border-[#e8ded0] pt-2 md:pt-0 md:pl-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[10px] text-[#867a68] uppercase tracking-wider font-semibold">
                          <Leaf className="w-3 h-3 text-[#495c27]" />
                          <span>Ayurvedic Prescription</span>
                        </div>
                        <p className="text-[11px] text-[#554937] leading-snug line-clamp-2 font-sans">
                          {scan.ayurvedic_remedy || scan.recommendedRoutine.join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => handleDelete(e, scan.id)}
                          title="Delete record"
                          className="p-1.5 rounded-full text-red-700/60 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setSelectedScan(scan)}
                          className="px-3 py-1.5 rounded-full border border-[#495c27] text-[#495c27] hover:bg-[#495c27] hover:text-white text-xs font-semibold flex items-center gap-0.5 transition-all focus:outline-none"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#faf5ec]/90 backdrop-blur-md border border-[#e8ded0] rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-full bg-[#eee2cf] flex items-center justify-center text-[#495c27] flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#495c27]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2c3817] tracking-wide uppercase font-sans">
              Encrypted Supabase Patient Records
            </h4>
            <p className="text-xs text-[#635745] mt-0.5 leading-relaxed font-sans flex items-center gap-1">
              <span>All skin searches are protected by Row Level Security (RLS) linked to your authenticated user identity.</span>
              <span className="text-xs text-[#495c27]">🌿</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
