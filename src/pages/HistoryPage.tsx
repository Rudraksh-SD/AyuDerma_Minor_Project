import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, Leaf, ChevronRight, ShieldCheck } from 'lucide-react';
import { SkinScan } from '../types';

export const HistoryPage: React.FC = () => {
  const { scans, setSelectedScan } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredScans = scans.filter((scan) => {
    const matchesSearch =
      scan.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.skinType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.concerns.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      scan.recommendedRoutine.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'All') return true;
    if (filterType === 'Combination') return scan.skinType === 'Combination';
    if (filterType === 'Oily') return scan.skinType === 'Oily';
    if (filterType === 'Good Score') return scan.skinScore >= 75;
    return true;
  });

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between px-6 md:px-14 py-6 md:py-8">
      {/* Background shadow leaf */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none opacity-20 select-none -z-10">
        <svg viewBox="0 0 200 200" fill="#4d5f2a" className="w-full h-full filter blur-[1px]">
          <path d="M20,10 Q60,40 40,90 Q80,70 110,120 Q60,110 30,150 Q70,160 50,200 Q20,130 10,80 Z" opacity="0.6" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Top Header Row with Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-kunstler text-6xl sm:text-7xl text-[#394a1d] leading-none tracking-tight select-none">
              Your Skin History
            </h1>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-[#847558] text-xs">✦</span>
              <p className="font-handwriting text-xs sm:text-sm text-[#665a48] flex items-center gap-1.5">
                <span>Track your past scans and skin journey.</span>
                <span className="text-[#495b28]">🌿</span>
              </p>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-[#8a7d69]" />
              <input
                id="input-search-history"
                type="text"
                placeholder="Search by date or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#faf5ec]/90 backdrop-blur-md border border-[#e5dcce] rounded-full pl-10 pr-4 py-2 text-xs text-[#403626] placeholder-[#958874] w-60 sm:w-72 shadow-xs focus:outline-none focus:ring-1 focus:ring-[#495b28]"
              />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                id="btn-filter-history"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="bg-[#faf5ec]/90 backdrop-blur-md border border-[#e5dcce] rounded-full px-4 py-2 text-xs font-semibold text-[#504533] flex items-center gap-1.5 shadow-xs hover:bg-[#f3eadc] transition-colors"
              >
                <Filter className="w-3.5 h-3.5 text-[#554734]" />
                <span>Filter: {filterType}</span>
                <span className="text-[10px]">⌵</span>
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-[#faf5ec] border border-[#d8cdbd] rounded-2xl p-2 shadow-xl z-20 space-y-1 text-xs">
                  {['All', 'Combination', 'Oily', 'Good Score'].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setFilterType(t);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors ${
                        filterType === t
                          ? 'bg-[#495b28] text-white font-medium'
                          : 'text-[#4c412f] hover:bg-[#eee3d1]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-10 space-y-4">
          {/* Vertical Timeline Guide Line */}
          <div className="absolute left-2.5 sm:left-4 top-4 bottom-4 w-[2px] bg-[#d9cdba]" />

          {filteredScans.length === 0 ? (
            <div className="bg-[#faf5ec]/80 rounded-3xl p-10 text-center border border-[#e8ded0]">
              <p className="font-handwriting text-base text-[#786c59]">
                No skin scans match your search query.
              </p>
            </div>
          ) : (
            filteredScans.map((scan) => {
              const [day, month, year] = scan.date.split(' ');
              return (
                <div key={scan.id} className="relative flex items-center">
                  {/* Timeline Circle Node */}
                  <div className="absolute -left-6 sm:-left-10 w-5 h-5 rounded-full border-2 border-[#495b28] bg-[#faf5ec] flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-[#495b28]" />
                  </div>

                  {/* Timeline Card */}
                  <div className="w-full bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-all hover:shadow-[0_6px_22px_rgba(90,75,50,0.08)]">
                    {/* Date Block */}
                    <div className="md:col-span-2 flex items-center md:flex-col md:items-start border-b md:border-b-0 md:border-r border-[#e8ded0] pb-2 md:pb-0 md:pr-4">
                      <span className="font-sans text-3xl sm:text-4xl font-bold text-[#384a1d] leading-none">
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
                        alt="Skin thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#d8cdbc] shadow-xs"
                      />
                    </div>

                    {/* Skin Type & Concerns */}
                    <div className="md:col-span-3 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-[#786c59]">Skin Type:</span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#384a1d]">
                          <Leaf className="w-3 h-3 text-[#495b28]" />
                          {scan.skinType}
                        </span>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#867a68] uppercase tracking-wider font-semibold">
                          Detected Concerns:
                        </div>
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5 text-xs text-[#504432]">
                          {scan.concerns.map((c, i) => (
                            <span key={i} className="flex items-center gap-1">
                              &bull; {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Skin Score Meter */}
                    <div className="md:col-span-2 flex flex-col items-center text-center">
                      <div className="text-[10px] text-[#867a68] uppercase tracking-wider font-semibold mb-1">
                        Skin Score
                      </div>
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                          <circle cx="20" cy="20" r="16" stroke="#e6dccb" strokeWidth="3" fill="transparent" />
                          <circle
                            cx="20"
                            cy="20"
                            r="16"
                            stroke="#495b28"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 16}
                            strokeDashoffset={2 * Math.PI * 16 * (1 - scan.skinScore / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute font-sans text-xs font-bold text-[#384a1d]">
                          {scan.skinScore}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#445524] mt-0.5 flex items-center gap-0.5">
                        {scan.scoreLabel} <span className="text-[10px]">🌿</span>
                      </span>
                    </div>

                    {/* Recommended Routine & Details Button */}
                    <div className="md:col-span-3 flex items-center justify-between gap-3 border-t md:border-t-0 md:border-l border-[#e8ded0] pt-2 md:pt-0 md:pl-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[10px] text-[#867a68] uppercase tracking-wider font-semibold">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-[#495b28]">
                            <path d="M12 2v6m-4-2l4 4 4-4M4 11h16a8 8 0 0 1-16 0z" />
                          </svg>
                          <span>Recommended Routine</span>
                        </div>
                        <p className="text-[11px] text-[#554937] leading-snug line-clamp-2">
                          {scan.recommendedRoutine.join(', ')}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedScan(scan)}
                        className="flex-shrink-0 px-3.5 py-1.5 rounded-full border border-[#495b28] text-[#495b28] hover:bg-[#495b28] hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#faf5ec]/90 backdrop-blur-md border border-[#e8ded0] rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#eee2cf] flex items-center justify-center text-[#495b28] flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#495b28]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#384a1d] tracking-wide uppercase">
              Your journey matters.
            </h4>
            <p className="text-xs text-[#635745] mt-0.5 leading-relaxed font-sans flex items-center gap-1">
              <span>Consistent care leads to lasting results. Keep glowing naturally!</span>
              <span className="text-xs text-[#495b28]">🌿</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
