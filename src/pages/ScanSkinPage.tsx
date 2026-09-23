import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { IMAGES } from '../data/initialData';
import { Camera, Upload, Shield, Leaf, Scan, CheckCircle, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fadeUpVariants, cardHoverProps } from '../utils/animations';

export const ScanSkinPage: React.FC = () => {
  const { addScan, setShowRecommendationsModal, showToast } = useApp();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [analysisText, setAnalysisText] = useState('Analyzing image...');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis result state
  const [analysisResult, setAnalysisResult] = useState({
    skinType: 'Combination',
    skinTypeConfidence: 92,
    skinConcern: 'Mild Acne',
    concernConfidence: 89,
    severity: 'Mild',
    severityLevel: 'Level: Low to Moderate',
    severityPercent: 35,
    confidence: '92%',
    accuracyLabel: 'High Accuracy',
    accuracyPercent: 92,
  });

  // Handle webcam
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access not granted, using simulated camera frame:', err);
      showToast('Camera simulation active. Click capture to analyze!', 'info');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.videoWidth) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setPreviewImage(dataUrl);
        stopCamera();
        runSkinAnalysis(dataUrl);
        return;
      }
    }

    setPreviewImage(IMAGES.skinAfter);
    stopCamera();
    runSkinAnalysis(IMAGES.skinAfter);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Image size exceeds 10MB limit.', 'info');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        stopCamera();
        runSkinAnalysis(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run skin analysis flow with clinical wording steps
  const runSkinAnalysis = (imgSrc: string) => {
    setIsScanning(true);
    setScanStep('scanning');
    setAnalysisText('Analyzing skin parameters...');

    setTimeout(() => {
      setAnalysisText('Evaluating Pitta-Kapha dosha markers...');
    }, 900);

    setTimeout(() => {
      setAnalysisText('Preparing your Ayurvedic wellness guidance...');
    }, 1700);

    setTimeout(() => {
      setIsScanning(false);
      setScanStep('complete');

      const updatedResults = {
        skinType: 'Combination',
        skinTypeConfidence: 94,
        skinConcern: 'Mild Acne',
        concernConfidence: 91,
        severity: 'Mild',
        severityLevel: 'Level: Low to Moderate',
        severityPercent: 30,
        confidence: '94%',
        accuracyLabel: 'High Accuracy',
        accuracyPercent: 94,
      };

      setAnalysisResult(updatedResults);

      addScan({
        skinScore: 84,
        skinType: 'Combination',
        primaryConcern: 'Mild Acne',
        concerns: ['Mild Acne', 'Open Pores', 'Sebum Regulation'],
        severity: 'Mild',
        severityLevel: 'Level: Low to Moderate',
        confidence: '94%',
        accuracy: 'High Accuracy',
        thumbnailUrl: imgSrc,
      });
    }, 2500);
  };

  const handleResetScan = () => {
    stopCamera();
    setPreviewImage(null);
    setScanStep('idle');
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between px-6 md:px-14 py-6 md:py-8 font-sans text-[#2c2823]">
      {/* Background shadow leaf */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none opacity-20 select-none -z-10">
        <svg viewBox="0 0 200 200" fill="#4d5f2a" className="w-full h-full filter blur-[1px]">
          <path d="M20,10 Q60,40 40,90 Q80,70 110,120 Q60,110 30,150 Q70,160 50,200 Q20,130 10,80 Z" opacity="0.6" />
        </svg>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
        {/* Left Column: Title & Feature Pillars */}
        <motion.div variants={fadeUpVariants} initial="initial" animate="animate" className="lg:col-span-3 flex flex-col justify-center space-y-6">
          <div>
            <span className="text-xs font-semibold tracking-widest text-[#495c27] uppercase block">STEP 1: CAPTURE SKIN IMAGE</span>
            <h1 className="font-serif-title font-bold text-4xl sm:text-5xl text-[#2c3817] leading-tight select-none mt-1">
              Skin Analysis
            </h1>
            <p className="text-xs sm:text-sm text-[#665a48] mt-2 leading-relaxed">
              Capture or upload a facial image to receive image-based parameter evaluation and tailored botanical routines.
            </p>
          </div>

          {/* 3 Bullet Features */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#b8ab96] bg-[#faf5ec]/80 flex items-center justify-center text-[#495c27] flex-shrink-0 shadow-2xs">
                <Scan className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold tracking-wider text-[#4d4231] uppercase leading-tight">
                SKIN IMAGE<br />ANALYSIS
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#b8ab96] bg-[#faf5ec]/80 flex items-center justify-center text-[#495c27] flex-shrink-0 shadow-2xs">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold tracking-wider text-[#4d4231] uppercase leading-tight">
                AYURVEDIC<br />DOSHA INSIGHTS
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#b8ab96] bg-[#faf5ec]/80 flex items-center justify-center text-[#495c27] flex-shrink-0 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold tracking-wider text-[#4d4231] uppercase leading-tight">
                BOTANICAL<br />PRESCRIPTION
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center: Interactive Scanner Card */}
        <motion.div variants={fadeUpVariants} initial="initial" animate="animate" className="lg:col-span-4 flex justify-center">
          <div
            id="card-scanner-box"
            className="w-full max-w-sm bg-[#faf5ec]/95 backdrop-blur-md rounded-3xl border border-[#e8ddcd] p-6 shadow-[0_12px_36px_rgba(80,68,48,0.08)] flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Dashed circular area / preview / video */}
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full border-2 border-dashed border-[#bfae95] bg-[#f4ecdf]/70 flex flex-col items-center justify-center p-4 overflow-hidden mb-4 shadow-inner">
              {isCameraActive ? (
                <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                  <div className="absolute inset-0 border-2 border-[#495c27] rounded-full pointer-events-none animate-pulse" />
                  <button
                    onClick={capturePhoto}
                    className="absolute bottom-3 bg-[#495c27] text-white text-[11px] px-3.5 py-1.5 rounded-full font-semibold shadow-md flex items-center gap-1.5 hover:bg-[#3b4b1f] focus:outline-none"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Capture Photo</span>
                  </button>
                </div>
              ) : previewImage ? (
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <img
                    src={previewImage}
                    alt="Facial scan preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Animated scanning line */}
                  {isScanning && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#495c27] to-transparent shadow-[0_0_12px_#495c27] animate-[scan_1.5s_ease-in-out_infinite]" />
                  )}
                  {scanStep === 'complete' && (
                    <div className="absolute bottom-2 inset-x-0 flex justify-center">
                      <span className="bg-[#495c27]/90 text-white text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 font-semibold">
                        <CheckCircle className="w-3 h-3" /> Complete
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="relative mb-2">
                    <div className="w-12 h-12 rounded-full bg-[#eee3d1] flex items-center justify-center text-[#554733]">
                      <Camera className="w-6 h-6 text-[#495c27]" />
                    </div>
                    <span className="absolute -top-1 -right-1 text-sm">🌿</span>
                  </div>
                  <h4 className="font-serif-title text-base text-[#2c3817] font-bold">
                    Scan Facial Image
                  </h4>
                  <p className="text-xs text-[#786c59] mt-0.5 leading-tight px-3 font-sans">
                    Click to upload or use live camera
                  </p>
                </div>
              )}
            </div>

            {/* Scanning Status message */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-sans font-semibold text-[#495c27] flex items-center gap-2 mb-3 bg-[#eef4e3] px-3.5 py-1.5 rounded-full border border-[#cbe0b2]"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#495c27]" />
                  <span>{analysisText}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* OR Divider */}
            <div className="w-full flex items-center gap-3 my-2">
              <div className="h-[1px] flex-1 bg-[#ded0bd]" />
              <span className="text-[10px] font-semibold text-[#8b7e6a] uppercase">OR</span>
              <div className="h-[1px] flex-1 bg-[#ded0bd]" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full mt-1">
              <button
                id="btn-open-camera"
                onClick={isCameraActive ? capturePhoto : startCamera}
                className="flex-1 bg-[#495c27] hover:bg-[#3d4d1f] text-white py-2.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isCameraActive ? 'Capture' : 'Open Camera'}</span>
              </button>

              <button
                id="btn-upload-image"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-[#faf6ee] hover:bg-[#f2e9db] border border-[#495c27] text-[#495c27] py-2.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Image</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {previewImage && !isCameraActive && (
              <button
                onClick={handleResetScan}
                className="mt-3 text-xs text-[#716551] hover:text-[#2c3817] flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> New Photo Scan
              </button>
            )}

            <span className="text-[10px] text-[#867966] mt-3 font-sans">
              Supports JPG, PNG (Max. 10MB)
            </span>
          </div>
        </motion.div>

        {/* Right Column: Predicted Condition & Guidance 2x2 Grid */}
        <motion.div variants={fadeUpVariants} initial="initial" animate="animate" className="lg:col-span-5 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-6 bg-[#cfbeaa]" />
            <span className="text-[#495c27] text-sm">🌿</span>
            <h3 className="font-serif-title text-xl sm:text-2xl text-[#2c3817] font-bold">
              Analysis Results &amp; Guidance
            </h3>
            <span className="text-[#495c27] text-sm">🌿</span>
            <div className="h-[1px] w-6 bg-[#cfbeaa]" />
          </div>

          {/* 2x2 Grid of result cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Card 1: Skin Type */}
            <motion.div {...cardHoverProps} className="bg-[#faf5eb]/95 backdrop-blur-sm border border-[#e5dcce] rounded-2xl p-4 shadow-[0_2px_12px_rgba(90,75,50,0.04)] flex flex-col justify-between">
              <div className="text-[10px] sm:text-xs font-semibold text-[#665a48] uppercase tracking-wider font-sans">
                Predicted Skin Type
              </div>
              <div className="my-2 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#eee4d2] flex items-center justify-center text-[#495c27] mb-1">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="font-serif-title text-lg sm:text-xl text-[#2c3817] font-bold">
                  {analysisResult.skinType}
                </span>
              </div>
              <div>
                <div className="w-full h-1.5 bg-[#e5dbc9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#495c27] rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult.skinTypeConfidence}%` }}
                  />
                </div>
                <div className="text-[10px] text-[#7a6f5e] mt-1 text-center font-sans">
                  Confidence: {analysisResult.skinTypeConfidence}%
                </div>
              </div>
            </motion.div>

            {/* Card 2: Primary Concern */}
            <motion.div {...cardHoverProps} className="bg-[#faf5eb]/95 backdrop-blur-sm border border-[#e5dcce] rounded-2xl p-4 shadow-[0_2px_12px_rgba(90,75,50,0.04)] flex flex-col justify-between">
              <div className="text-[10px] sm:text-xs font-semibold text-[#665a48] uppercase tracking-wider font-sans">
                Primary Concern
              </div>
              <div className="my-2 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#eee4d2] flex items-center justify-center text-[#495c27] mb-1">
                  <Scan className="w-4 h-4" />
                </div>
                <span className="font-serif-title text-lg sm:text-xl text-[#2c3817] font-bold">
                  {analysisResult.skinConcern}
                </span>
              </div>
              <div>
                <div className="w-full h-1.5 bg-[#e5dbc9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#495c27] rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult.concernConfidence}%` }}
                  />
                </div>
                <div className="text-[10px] text-[#7a6f5e] mt-1 text-center font-sans">
                  Confidence: {analysisResult.concernConfidence}%
                </div>
              </div>
            </motion.div>

            {/* Card 3: Severity */}
            <motion.div {...cardHoverProps} className="bg-[#faf5eb]/95 backdrop-blur-sm border border-[#e5dcce] rounded-2xl p-4 shadow-[0_2px_12px_rgba(90,75,50,0.04)] flex flex-col justify-between">
              <div className="text-[10px] sm:text-xs font-semibold text-[#665a48] uppercase tracking-wider font-sans">
                Severity Level
              </div>
              <div className="my-2 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#eee4d2] flex items-center justify-center text-[#495c27] mb-1">
                  <div className="flex items-end gap-0.5 h-3.5">
                    <span className="w-1 h-1.5 bg-[#495c27] rounded-xs" />
                    <span className="w-1 h-2.5 bg-[#495c27] rounded-xs" />
                    <span className="w-1 h-3.5 bg-[#495c27] rounded-xs" />
                  </div>
                </div>
                <span className="font-serif-title text-lg sm:text-xl text-[#2c3817] font-bold">
                  {analysisResult.severity}
                </span>
              </div>
              <div>
                <div className="w-full h-1.5 bg-[#e5dbc9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#495c27] rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult.severityPercent}%` }}
                  />
                </div>
                <div className="text-[10px] text-[#7a6f5e] mt-1 text-center font-sans">
                  {analysisResult.severityLevel}
                </div>
              </div>
            </motion.div>

            {/* Card 4: Model Confidence */}
            <motion.div {...cardHoverProps} className="bg-[#faf5eb]/95 backdrop-blur-sm border border-[#e5dcce] rounded-2xl p-4 shadow-[0_2px_12px_rgba(90,75,50,0.04)] flex flex-col justify-between">
              <div className="text-[10px] sm:text-xs font-semibold text-[#665a48] uppercase tracking-wider font-sans">
                Model Confidence
              </div>
              <div className="my-2 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#eee4d2] flex items-center justify-center text-[#495c27] mb-1">
                  <Shield className="w-4 h-4 text-[#495c27]" />
                </div>
                <span className="font-serif-title text-lg sm:text-xl text-[#2c3817] font-bold">
                  {analysisResult.confidence}
                </span>
              </div>
              <div>
                <div className="w-full h-1.5 bg-[#e5dbc9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#495c27] rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult.accuracyPercent}%` }}
                  />
                </div>
                <div className="text-[10px] text-[#7a6f5e] mt-1 text-center font-sans">
                  {analysisResult.accuracyLabel}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Button: View Ayurvedic Recommendations */}
          <button
            id="btn-view-recommendations"
            onClick={() => setShowRecommendationsModal(true)}
            className="w-full bg-[#495c27] hover:bg-[#3d4d1f] text-white py-3.5 px-6 rounded-full font-sans text-sm sm:text-base font-semibold shadow-[0_4px_14px_rgba(73,92,39,0.25)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
          >
            <span>View Ayurvedic Recommendations</span>
            <span>🍃</span>
          </button>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 text-[11px] text-[#786c5a] pt-1 leading-normal font-sans">
            <Shield className="w-4 h-4 text-[#495c27] flex-shrink-0 mt-0.5" />
            <p>
              Disclaimer: Predictions and recommendations are informational only and should not replace professional medical diagnosis.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
