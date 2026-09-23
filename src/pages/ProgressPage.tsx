import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IMAGES } from '../data/initialData';
import { ChevronRight, Droplet, Leaf, Sparkles, Activity } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { weeklyProgress, monthlyProgress, user, setShowRecommendationsModal } = useApp();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [hoveredPoint, setHoveredPoint] = useState<{ period: string; score: number } | null>(null);

  const data = timeframe === 'weekly' ? weeklyProgress : monthlyProgress;

  // Chart dimensions & math
  const chartWidth = 500;
  const chartHeight = 160;
  const paddingX = 40;
  const paddingY = 25;

  const getCoordinates = (index: number, score: number) => {
    const totalPoints = data.length;
    const x = paddingX + (index / (totalPoints - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (score / 100) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const points = data.map((d, i) => getCoordinates(i, d.score));

  const pathD = points.reduce((acc, curr, i) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    // Smooth bezier curve
    const prev = points[i - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between px-6 md:px-14 py-6 md:py-8">
      {/* Background shadow leaf */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none opacity-20 select-none -z-10">
        <svg viewBox="0 0 200 200" fill="#4d5f2a" className="w-full h-full filter blur-[1px]">
          <path d="M20,10 Q60,40 40,90 Q80,70 110,120 Q60,110 30,150 Q70,160 50,200 Q20,130 10,80 Z" opacity="0.6" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Top Header */}
        <div className="flex flex-col items-start">
          <h1 className="font-kunstler text-6xl sm:text-7xl text-[#394a1d] leading-none tracking-tight select-none">
            Your Skin Journey
          </h1>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-[#847558] text-xs">✦</span>
            <p className="font-handwriting text-xs sm:text-sm text-[#665a48]">
              Track your progress. Celebrate your glow.
            </p>
          </div>
        </div>

        {/* Top 3 Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Card 1: Overall Improvement */}
          <div
            id="card-overall-improvement"
            className="md:col-span-3 bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex flex-col justify-between items-center text-center"
          >
            <div className="flex items-center gap-1 text-xs font-semibold text-[#524634]">
              <span>Overall Improvement</span>
              <span className="text-[#495b28]">🌿</span>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-32 h-32 my-3 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e6dccb"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#495b28"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - 0.72)}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-sans text-2xl font-bold text-[#384a1d]">
                  72%
                </span>
                <span className="text-[10px] text-[#554734] font-medium">Improved</span>
                <span className="text-[11px] text-[#495b28] -mt-0.5">🌿</span>
              </div>
            </div>

            <p className="font-handwriting text-xs text-[#6e614d]">
              You're on the right path!
            </p>
          </div>

          {/* Card 2: Before & Current Comparison */}
          <div
            id="card-before-current"
            className="md:col-span-4 bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex items-center justify-around"
          >
            {/* Before */}
            <div className="flex flex-col items-center text-center">
              <span className="font-handwriting text-base text-[#384a1d] font-bold">Before</span>
              <span className="text-[10px] text-[#827563] mb-2">12 May 2024</span>
              <img
                src={IMAGES.skinBefore}
                alt="Skin Before Treatment"
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-[#d8cdbc] shadow-sm"
              />
              <div className="mt-2 text-xs font-handwriting text-[#5c4f3c]">
                Skin Score <span className="font-bold text-[#445524]">56</span>
                <span className="text-[10px] text-[#827563]">/100</span>
              </div>
            </div>

            {/* Middle Chevron Arrow */}
            <div className="w-7 h-7 rounded-full bg-[#eee3d1] flex items-center justify-center text-[#554733] shadow-xs">
              <ChevronRight className="w-4 h-4" />
            </div>

            {/* Current */}
            <div className="flex flex-col items-center text-center">
              <span className="font-handwriting text-base text-[#384a1d] font-bold">Current</span>
              <span className="text-[10px] text-[#827563] mb-2">04 June 2024</span>
              <img
                src={IMAGES.skinAfter}
                alt="Skin Current Result"
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-[#d8cdbc] shadow-sm ring-2 ring-[#495b28]/30"
              />
              <div className="mt-2 text-xs font-handwriting text-[#5c4f3c]">
                Skin Score <span className="font-bold text-[#445524] text-sm">82</span>
                <span className="text-[10px] text-[#827563]">/100</span>
              </div>
            </div>
          </div>

          {/* Card 3: Progress Overview Chart */}
          <div
            id="card-progress-overview"
            className="md:col-span-5 bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#524634]">
                <span>Progress Overview</span>
                <span className="text-[#495b28]">🌿</span>
              </div>

              {/* Weekly / Monthly Toggle */}
              <div className="flex items-center bg-[#ede3d1] rounded-full p-0.5 border border-[#d6c7b0]">
                <button
                  onClick={() => setTimeframe('weekly')}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    timeframe === 'weekly'
                      ? 'bg-[#495b28] text-white shadow-xs'
                      : 'text-[#5d503d] hover:text-[#384a1d]'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeframe('monthly')}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    timeframe === 'monthly'
                      ? 'bg-[#495b28] text-white shadow-xs'
                      : 'text-[#5d503d] hover:text-[#384a1d]'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Score label & SVG chart */}
            <div className="relative w-full overflow-hidden">
              <div className="text-[10px] text-[#786c5a] mb-1 font-semibold">Score</div>
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-36 overflow-visible"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#87aa55" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#87aa55" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-axis grid lines */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = chartHeight - paddingY - (val / 100) * (chartHeight - paddingY * 2);
                  return (
                    <g key={val}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={chartWidth - paddingX}
                        y2={y}
                        stroke="#e5dbca"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 3}
                        fontSize="9"
                        fill="#8c7f6d"
                        textAnchor="end"
                        fontFamily="sans-serif"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Gradient Fill under the curve */}
                <path d={areaD} fill="url(#chartGradient)" />

                {/* Main line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#495b28"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Circular Data Nodes */}
                {points.map((pt, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4"
                      fill="#495b28"
                      stroke="#faf5ec"
                      strokeWidth="2"
                      className="transition-transform group-hover:scale-150"
                      onMouseEnter={() => setHoveredPoint(data[idx])}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <text
                      x={pt.x}
                      y={chartHeight - 8}
                      fontSize="9"
                      fill="#8c7f6d"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {data[idx].period}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Tooltip */}
              {hoveredPoint && (
                <div className="absolute top-2 right-4 bg-[#495b28] text-white text-[10px] px-2.5 py-1 rounded-lg shadow-md font-sans">
                  {hoveredPoint.period}: <span className="font-bold">{hoveredPoint.score}/100</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Skin Health Score & Factors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Skin Health Score */}
          <div
            id="card-skin-health-score"
            className="md:col-span-3 bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex flex-col justify-between items-center text-center"
          >
            <div className="flex items-center gap-1 text-xs font-semibold text-[#524634]">
              <span>Skin Health Score</span>
              <span className="text-[#495b28]">🌿</span>
            </div>

            {/* Circular score gauge */}
            <div className="relative w-28 h-28 my-2 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#e6dccb"
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#495b28"
                  strokeWidth="7"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - 0.82)}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-sans text-3xl font-bold text-[#384a1d]">82</span>
                <span className="text-[10px] text-[#867865]">/100</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-[#425422] flex items-center justify-center gap-1 font-handwriting">
                <span>Good</span>
                <span>🌿</span>
              </div>
              <p className="text-[11px] text-[#7a6d59] mt-0.5">
                Keep following your routine!
              </p>
            </div>
          </div>

          {/* Skin Health Factors */}
          <div
            id="card-skin-factors"
            className="md:col-span-9 bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#524634] mb-3">
              <span>Skin Health Factors</span>
              <span className="text-[#495b28]">🌿</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4">
              {/* Factor 1: Hydration */}
              <div className="flex flex-col items-center text-center">
                <span className="text-xs text-[#524532] font-medium mb-1.5">Hydration</span>
                <div className="w-10 h-10 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#554734] mb-2">
                  <Droplet className="w-4 h-4 text-[#5e4f3a]" />
                </div>
                <div className="w-full h-1.5 bg-[#e5dbc9] rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-[#495b28] rounded-full" style={{ width: '85%' }} />
                </div>
                <div className="flex items-center justify-between w-full text-[10px] text-[#7a6e5b] font-sans">
                  <span>85%</span>
                  <span className="font-semibold text-[#3b4c1f]">Excellent</span>
                </div>
              </div>

              {/* Factor 2: Acne */}
              <div className="flex flex-col items-center text-center">
                <span className="text-xs text-[#524532] font-medium mb-1.5">Acne</span>
                <div className="w-10 h-10 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#554734] mb-2">
                  <Leaf className="w-4 h-4 text-[#5e4f3a]" />
                </div>
                <div className="w-full h-1.5 bg-[#e5dbc9] rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-[#495b28] rounded-full" style={{ width: '70%' }} />
                </div>
                <div className="flex items-center justify-between w-full text-[10px] text-[#7a6e5b] font-sans">
                  <span>70%</span>
                  <span className="font-semibold text-[#3b4c1f]">Good</span>
                </div>
              </div>

              {/* Factor 3: Texture */}
              <div className="flex flex-col items-center text-center">
                <span className="text-xs text-[#524532] font-medium mb-1.5">Texture</span>
                <div className="w-10 h-10 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#554734] mb-2">
                  <Activity className="w-4 h-4 text-[#5e4f3a]" />
                </div>
                <div className="w-full h-1.5 bg-[#e5dbc9] rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-[#495b28] rounded-full" style={{ width: '80%' }} />
                </div>
                <div className="flex items-center justify-between w-full text-[10px] text-[#7a6e5b] font-sans">
                  <span>80%</span>
                  <span className="font-semibold text-[#3b4c1f]">Good</span>
                </div>
              </div>

              {/* Factor 4: Pigmentation */}
              <div className="flex flex-col items-center text-center">
                <span className="text-xs text-[#524532] font-medium mb-1.5">Pigmentation</span>
                <div className="w-10 h-10 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#554734] mb-2">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#5e4f3a]" />
                </div>
                <div className="w-full h-1.5 bg-[#e5dbc9] rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-[#495b28] rounded-full" style={{ width: '65%' }} />
                </div>
                <div className="flex items-center justify-between w-full text-[10px] text-[#7a6e5b] font-sans">
                  <span>65%</span>
                  <span className="font-semibold text-[#5c4f3c]">Fair</span>
                </div>
              </div>

              {/* Factor 5: Glow */}
              <div className="flex flex-col items-center text-center">
                <span className="text-xs text-[#524532] font-medium mb-1.5">Glow</span>
                <div className="w-10 h-10 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#554734] mb-2">
                  <Sparkles className="w-4 h-4 text-[#5e4f3a]" />
                </div>
                <div className="w-full h-1.5 bg-[#e5dbc9] rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-[#495b28] rounded-full" style={{ width: '90%' }} />
                </div>
                <div className="flex items-center justify-between w-full text-[10px] text-[#7a6e5b] font-sans">
                  <span>90%</span>
                  <span className="font-semibold text-[#3b4c1f]">Excellent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#faf5ec]/90 backdrop-blur-md border border-[#e8ded0] rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#eee2cf] flex items-center justify-center text-[#495b28] flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M12 2v6m-4-2l4 4 4-4M4 11h16a8 8 0 0 1-16 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#384a1d] tracking-wide uppercase">
                Stay Consistent
              </h4>
              <p className="text-xs text-[#635745] mt-0.5 leading-relaxed font-sans">
                Consistency is the key to glowing skin. Follow your Ayurvedic routine, eat right, stay hydrated and keep shining!
              </p>
            </div>
          </div>

          <button
            id="btn-progress-recommendations"
            onClick={() => setShowRecommendationsModal(true)}
            className="flex-shrink-0 bg-[#495c27] hover:bg-[#3d4d1f] text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>View Recommendations</span>
            <span>🍃</span>
          </button>
        </div>
      </div>
    </div>
  );
};
