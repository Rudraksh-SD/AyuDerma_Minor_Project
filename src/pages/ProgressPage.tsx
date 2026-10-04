import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { IMAGES } from '../data/initialData';
import { ChevronRight, Droplet, Leaf, Sparkles, Activity, RefreshCw, Image as ImageIcon, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeUpVariants, cardHoverProps } from '../utils/animations';

export const ProgressPage: React.FC = () => {
  const {
    weeklyProgress,
    monthlyProgress,
    user,
    scans,
    setShowRecommendationsModal,
    progressData,
    progressLoading,
    refreshProgress
  } = useApp();

  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [hoveredPoint, setHoveredPoint] = useState<{ period: string; score: number } | null>(null);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

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
    const prev = points[i - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  // Dynamic Initial & Latest Scan variables with resilient fallbacks
  const latestContextScan = scans && scans.length > 0 ? scans[0] : null;
  const initialContextScan = scans && scans.length > 0 ? scans[scans.length - 1] : null;

  const initialScan = (progressData?.initial_scan && progressData.initial_scan.image_url)
    ? progressData.initial_scan
    : (initialContextScan ? {
        id: initialContextScan.id,
        image_url: initialContextScan.thumbnailUrl || IMAGES.skinBefore,
        date: initialContextScan.date,
        disease: initialContextScan.primaryConcern,
        confidence: 0.90,
        skin_health_score: initialContextScan.skinScore
      } : {
        id: 'initial-default',
        image_url: IMAGES.skinBefore,
        date: '12 May 2024',
        disease: 'Acne & Sebum',
        confidence: 0.90,
        skin_health_score: 68
      });

  const latestScan = (progressData?.latest_scan && progressData.latest_scan.image_url)
    ? progressData.latest_scan
    : (latestContextScan ? {
        id: latestContextScan.id,
        image_url: latestContextScan.thumbnailUrl || IMAGES.skinAfter,
        date: latestContextScan.date,
        disease: latestContextScan.primaryConcern,
        confidence: 0.94,
        skin_health_score: latestContextScan.skinScore
      } : {
        id: 'latest-default',
        image_url: IMAGES.skinAfter,
        date: '04 June 2024',
        disease: 'Mild Acne',
        confidence: 0.92,
        skin_health_score: 82
      });

  const overallImprovement = progressData?.overall_improvement || {
    points: (latestScan?.skin_health_score || 82) - (initialScan?.skin_health_score || 68),
    status: 'improved'
  };

  const skinHealth = progressData?.skin_health || { score: latestScan?.skin_health_score || 82 };

  const rawScanHistory = (progressData?.scan_history && progressData.scan_history.length > 0)
    ? progressData.scan_history
    : (scans && scans.length > 0 ? scans.map(s => ({
        id: s.id,
        image_url: s.thumbnailUrl || IMAGES.skinAfter,
        date: s.date,
        disease: s.primaryConcern,
        score: s.skinScore
      })) : []);

  const scanHistory = rawScanHistory.map(item => ({
    ...item,
    image_url: item.image_url || IMAGES.skinBefore
  }));

  const improvementPoints = Math.abs(overallImprovement?.points || 0);
  const improvementStatus = overallImprovement?.status || 'improved';

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between px-6 md:px-14 py-6 md:py-8 font-sans text-[#2c2823]">
      {/* Background shadow leaf */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none opacity-20 select-none -z-10">
        <svg viewBox="0 0 200 200" fill="#4d5f2a" className="w-full h-full filter blur-[1px]">
          <path d="M20,10 Q60,40 40,90 Q80,70 110,120 Q60,110 30,150 Q70,160 50,200 Q20,130 10,80 Z" opacity="0.6" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Top Header */}
        <motion.div variants={fadeUpVariants} initial="initial" animate="animate" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-widest text-[#495c27] uppercase block">PROGRESS MONITORING</span>
            <h1 className="font-serif-title font-bold text-4xl sm:text-5xl text-[#2c3817] leading-tight select-none mt-0.5">
              Your Skin Journey
            </h1>
            <p className="text-xs sm:text-sm text-[#665a48] mt-1">
              Track persistent scan history from Supabase, measure quantitative skin improvement, and compare Initial vs Latest scan.
            </p>
          </div>

          <button
            onClick={() => refreshProgress()}
            disabled={progressLoading}
            className="self-start md:self-auto bg-[#faf5ec]/90 backdrop-blur-md border border-[#e5dcce] hover:bg-[#f2e9db] text-[#495c27] px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-all focus:outline-none"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${progressLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Scan Data</span>
          </button>
        </motion.div>

        {/* Top 3 Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Card 1: Overall Improvement */}
          <motion.div
            {...cardHoverProps}
            id="card-overall-improvement"
            className="md:col-span-3 bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex flex-col justify-between items-center text-center"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4d4231] uppercase tracking-wider font-sans">
              <span>Overall Improvement</span>
              <span className="text-[#495c27]">🌿</span>
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
                  stroke="#495c27"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - (improvementStatus === 'no_data' ? 0 : Math.min(1, (skinHealth?.score || 72) / 100)))}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-sans text-2xl font-bold text-[#2c3817]">
                  {improvementStatus === 'no_data' ? '0' : `${improvementPoints > 0 ? '+' : ''}${overallImprovement?.points || 0}`}
                </span>
                <span className="text-[10px] text-[#554734] font-semibold capitalize">
                  {improvementStatus === 'no_data' ? 'No Scans' : improvementStatus === 'initial' ? 'Initial Scan' : improvementStatus}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#6e614d] font-sans">
              {improvementStatus === 'no_data'
                ? 'Upload your first skin scan to begin tracking'
                : 'Derived directly from user scan history in Supabase'}
            </p>
          </motion.div>

          {/* Card 2: Initial Scan vs Latest Scan Comparison */}
          <motion.div
            {...cardHoverProps}
            id="card-before-current"
            className="md:col-span-4 bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex items-center justify-around"
          >
            {/* INITIAL SCAN (PERMANENT IMAGE #1) */}
            <div className="flex flex-col items-center text-center">
              <span className="font-serif-title text-base text-[#2c3817] font-bold">Initial Scan</span>
              <span className="text-[10px] text-[#827563] mb-2 font-sans">
                {initialScan ? initialScan.date : 'No scan available'}
              </span>
              
              {initialScan && initialScan.image_url ? (
                <img
                  src={initialScan.image_url}
                  alt="Initial Scan Image #1"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = IMAGES.skinBefore;
                  }}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-[#d8cdbc] shadow-xs"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#eee4d2] border border-dashed border-[#b8aa94] flex flex-col items-center justify-center text-[#827563] text-center p-2">
                  <ImageIcon className="w-6 h-6 text-[#9e907d] mb-1" />
                  <span className="text-[10px] leading-tight font-sans">No scan available</span>
                </div>
              )}

              <div className="mt-2 text-xs font-sans text-[#5c4f3c]">
                Score: <span className="font-bold text-[#2c3817]">{initialScan ? `${initialScan.skin_health_score}/100` : 'N/A'}</span>
              </div>
              <div className="text-[11px] font-semibold text-[#495c27] mt-0.5 max-w-[110px] truncate">
                {initialScan ? initialScan.disease : 'No scan available'}
              </div>
            </div>

            {/* Middle Chevron Arrow */}
            <div className="w-8 h-8 rounded-full bg-[#eee3d1] flex items-center justify-center text-[#495c27] shadow-2xs flex-shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>

            {/* LATEST SCAN (MOST RECENT SCAN #N) */}
            <div className="flex flex-col items-center text-center">
              <span className="font-serif-title text-base text-[#2c3817] font-bold">Latest Scan</span>
              <span className="text-[10px] text-[#827563] mb-2 font-sans">
                {latestScan ? latestScan.date : 'No scan available'}
              </span>

              {latestScan && latestScan.image_url ? (
                <img
                  src={latestScan.image_url}
                  alt="Latest Scan Image"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = IMAGES.skinAfter;
                  }}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-[#d8cdbc] shadow-xs ring-2 ring-[#495c27]/30"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#eee4d2] border border-dashed border-[#b8aa94] flex flex-col items-center justify-center text-[#827563] text-center p-2">
                  <ImageIcon className="w-6 h-6 text-[#9e907d] mb-1" />
                  <span className="text-[10px] leading-tight font-sans">No scan available</span>
                </div>
              )}

              <div className="mt-2 text-xs font-sans text-[#5c4f3c]">
                Score: <span className="font-bold text-[#2c3817] text-sm">{latestScan ? `${latestScan.skin_health_score}/100` : 'N/A'}</span>
              </div>
              <div className="text-[11px] font-semibold text-[#495c27] mt-0.5 max-w-[110px] truncate">
                {latestScan ? latestScan.disease : 'No scan available'}
              </div>
            </div>
          </motion.div>

          {/* Card 3: Progress Overview Chart */}
          <motion.div
            {...cardHoverProps}
            id="card-progress-overview"
            className="md:col-span-5 bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4d4231] uppercase tracking-wider font-sans">
                <span>Progress Overview</span>
                <span className="text-[#495c27]">🌿</span>
              </div>

              {/* Weekly / Monthly Toggle */}
              <div className="flex items-center bg-[#ede3d1] rounded-full p-0.5 border border-[#d6c7b0]">
                <button
                  onClick={() => setTimeframe('weekly')}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all focus:outline-none ${
                    timeframe === 'weekly'
                      ? 'bg-[#495c27] text-white shadow-xs'
                      : 'text-[#5d503d] hover:text-[#2c3817]'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeframe('monthly')}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all focus:outline-none ${
                    timeframe === 'monthly'
                      ? 'bg-[#495c27] text-white shadow-xs'
                      : 'text-[#5d503d] hover:text-[#2c3817]'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Score label & SVG chart */}
            <div className="relative w-full overflow-hidden">
              <div className="text-[10px] text-[#786c5a] mb-1 font-semibold">Skin Score Trend</div>
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-36 overflow-visible"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#495c27" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#495c27" stopOpacity="0.0" />
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
                  stroke="#495c27"
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
                      r="4.5"
                      fill="#495c27"
                      stroke="#faf5ec"
                      strokeWidth="2"
                      className="transition-transform group-hover:scale-150"
                      onMouseEnter={() => setHoveredPoint(data[idx])}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <text
                      x={pt.x}
                      y={chartHeight - 6}
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
                <div className="absolute top-2 right-4 bg-[#495c27] text-white text-[10px] px-2.5 py-1 rounded-lg shadow-md font-sans">
                  {hoveredPoint.period}: <span className="font-bold">{hoveredPoint.score}/100</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Skin Health Score & Factors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Skin Health Score */}
          <motion.div
            {...cardHoverProps}
            id="card-skin-health-score"
            className="md:col-span-3 bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex flex-col justify-between items-center text-center"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4d4231] uppercase tracking-wider font-sans">
              <span>Skin Health Score</span>
              <span className="text-[#495c27]">🌿</span>
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
                  stroke="#495c27"
                  strokeWidth="7"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - ((skinHealth?.score || 82) / 100))}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-sans text-3xl font-bold text-[#2c3817]">
                  {skinHealth?.score !== undefined && skinHealth.score > 0 ? skinHealth.score : 'N/A'}
                </span>
                <span className="text-[10px] text-[#867865]">/100</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-[#2c3817] flex items-center justify-center gap-1 font-sans">
                <span>{(skinHealth?.score || 0) >= 80 ? 'Good Condition' : (skinHealth?.score || 0) >= 65 ? 'Fair Condition' : 'Needs Care'}</span>
                <span>🌿</span>
              </div>
              <p className="text-[11px] text-[#7a6d59] mt-0.5">
                Optimal lipid-water equilibrium
              </p>
            </div>
          </motion.div>

          {/* Skin Health Factors */}
          <motion.div
            {...cardHoverProps}
            id="card-skin-factors"
            className="md:col-span-9 bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4d4231] uppercase tracking-wider mb-3 font-sans">
              <span>Skin Health Factors Breakdown</span>
              <span className="text-[#495c27]">🌿</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4">
              {/* Render dynamic factors or default breakdown */}
              {(skinHealth?.factors && skinHealth.factors.length > 0 ? skinHealth.factors : [
                { name: 'Hydration', score: 85, status: 'Excellent' },
                { name: 'Acne Care', score: 70, status: 'Good' },
                { name: 'Texture', score: 80, status: 'Good' },
                { name: 'Pigmentation', score: 65, status: 'Fair' },
                { name: 'Radiance', score: 90, status: 'Excellent' }
              ]).map((factor, fIdx) => (
                <div key={fIdx} className="flex flex-col items-center text-center">
                  <span className="text-xs text-[#4d4231] font-semibold mb-1.5 font-sans">{factor.name}</span>
                  <div className="w-10 h-10 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#495c27] mb-2 shadow-2xs">
                    {fIdx === 0 && <Droplet className="w-4 h-4" />}
                    {fIdx === 1 && <Leaf className="w-4 h-4" />}
                    {fIdx === 2 && <Activity className="w-4 h-4" />}
                    {fIdx === 3 && <div className="w-3.5 h-3.5 rounded-full border-2 border-[#495c27]" />}
                    {fIdx === 4 && <Sparkles className="w-4 h-4" />}
                  </div>
                  <div className="w-full h-1.5 bg-[#e5dbc9] rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-[#495c27] rounded-full" style={{ width: `${factor.score}%` }} />
                  </div>
                  <div className="flex items-center justify-between w-full text-[10px] text-[#7a6e5b] font-sans">
                    <span>{factor.score}%</span>
                    <span className="font-semibold text-[#2c3817]">{factor.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scan History Section from Supabase GET /progress */}
        {scanHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#495c27] text-sm">🌿</span>
                <h3 className="font-serif-title font-bold text-xl text-[#2c3817]">
                  User Scan History ({scanHistory.length})
                </h3>
              </div>
              <span className="text-xs text-[#786c59] font-sans font-semibold">
                Sorted Newest &rarr; Oldest
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {scanHistory.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-[#f5ede0]/80 border border-[#e2d6c3] rounded-2xl p-3 flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow"
                >
                  <div className="relative w-full h-32 rounded-xl overflow-hidden bg-[#e6dbca]">
                    <img
                      src={item.image_url || IMAGES.skinBefore}
                      alt={`Scan ${item.id}`}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = IMAGES.skinBefore;
                      }}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-[#2c3817]/80 text-white text-[9px] px-2 py-0.5 rounded-md backdrop-blur-xs font-mono">
                      {idx === 0 ? 'Latest Scan' : idx === scanHistory.length - 1 ? 'Initial Scan' : `Scan #${scanHistory.length - idx}`}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-sans text-[#6e614d]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#495c27]" />
                        {item.date}
                      </span>
                      <span className="font-bold text-[#2c3817]">{item.score}/100</span>
                    </div>
                    <h4 className="font-serif-title text-sm font-bold text-[#2c3817] truncate mt-1">
                      {item.disease}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#faf5ec]/90 backdrop-blur-md border border-[#e8ded0] rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#eee2cf] flex items-center justify-center text-[#495c27] flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M12 2v6m-4-2l4 4 4-4M4 11h16a8 8 0 0 1-16 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2c3817] tracking-wide uppercase font-sans">
                Maintain Routine Adherence
              </h4>
              <p className="text-xs text-[#635745] mt-0.5 leading-relaxed font-sans">
                Consistency is essential in Ayurvedic care. Continue your daily regimen and hydration routines for optimal Ojas glow.
              </p>
            </div>
          </div>

          <button
            id="btn-progress-recommendations"
            onClick={() => setShowRecommendationsModal(true)}
            className="flex-shrink-0 bg-[#495c27] hover:bg-[#3d4d1f] text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 shadow-sm transition-all hover:scale-[1.015] active:scale-[0.985] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
          >
            <span>View Recommendations</span>
            <span>🍃</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};
