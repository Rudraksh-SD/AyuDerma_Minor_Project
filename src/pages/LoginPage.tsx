import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IMAGES } from '../data/initialData';
import { Droplet, Leaf, Sparkles, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setActivePage, showToast, user } = useApp();
  const [email, setEmail] = useState('ananya.sharma@example.com');
  const [password, setPassword] = useState('ayurveda2024');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('Ananya Sharma');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  const handleGoogleLogin = () => {
    login('ananya.sharma@example.com');
  };

  const handleForgotPassword = () => {
    showToast('A password reset link has been sent to your email.');
  };

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between px-6 md:px-14 py-6 md:py-8">
      {/* Background shadow leaf */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none opacity-20 select-none -z-10">
        <svg viewBox="0 0 200 200" fill="#4d5f2a" className="w-full h-full filter blur-[1px]">
          <path d="M20,10 Q60,40 40,90 Q80,70 110,120 Q60,110 30,150 Q70,160 50,200 Q20,130 10,80 Z" opacity="0.6" />
        </svg>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
        {/* Left Typography & Hero Branding */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 pt-2">
          <div>
            <h1 className="font-kunstler text-7xl sm:text-8xl md:text-9xl text-[#394a1d] leading-none tracking-tight select-none">
              AyuDerma
              <span className="inline-block transform translate-y-[-15%] -ml-1 text-[#485926] text-3xl md:text-4xl">🌿</span>
            </h1>

            <div className="mt-4 flex flex-col items-start gap-2">
              <div className="flex items-center gap-3 w-full max-w-md">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b8aa92] to-transparent" />
                <span className="text-[#847558] text-base select-none">✦</span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b8aa92] to-transparent" />
              </div>
              <h2 className="text-[#514532] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase font-sans">
                HEALTHY SKIN. CONFIDENT YOU.
              </h2>
            </div>

            {/* 3 Icons */}
            <div className="flex items-center gap-6 sm:gap-10 py-5">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#b2a48f] bg-[#faf5ec]/60 flex items-center justify-center text-[#554734]">
                  <Droplet className="w-5 h-5 text-[#5e4f3a]" />
                </div>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#554734] mt-2 uppercase">
                  NOURISH
                </span>
              </div>

              <div className="h-10 w-[1px] bg-[#d9cdba]" />

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#b2a48f] bg-[#faf5ec]/60 flex items-center justify-center text-[#554734]">
                  <Leaf className="w-5 h-5 text-[#5e4f3a]" />
                </div>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#554734] mt-2 uppercase">
                  PROTECT
                </span>
              </div>

              <div className="h-10 w-[1px] bg-[#d9cdba]" />

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#b2a48f] bg-[#faf5ec]/60 flex items-center justify-center text-[#554734]">
                  <Sparkles className="w-5 h-5 text-[#5e4f3a]" />
                </div>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#554734] mt-2 uppercase">
                  GLOW
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Left: Mortar & Herbs image */}
          <div className="w-64 sm:w-80 max-w-full">
            <img
              src={IMAGES.mortarHerbs}
              alt="Ayurvedic herbs and fresh amla"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain rounded-2xl drop-shadow-md"
            />
          </div>
        </div>

        {/* Right Floating Login Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end items-center">
          <div
            id="card-login"
            className="w-full max-w-md bg-[#faf5ec]/95 backdrop-blur-md rounded-[28px] border border-[#e8ddce] p-7 sm:p-9 shadow-[0_16px_40px_rgba(80,68,48,0.09)] transition-all"
          >
            {/* Top Leaf Emblem */}
            <div className="flex justify-center mb-1">
              <span className="text-[#495c27] text-2xl">🌿</span>
            </div>

            <div className="text-center mb-4">
              <h2 className="font-handwriting text-3xl sm:text-4xl text-[#394a1d] font-bold">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="font-handwriting text-xs text-[#736855] mt-0.5">
                {isRegistering ? 'Begin your personalized holistic skin journey' : 'Login to continue your skin journey'}
              </p>

              {/* Flourish ornament */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-12 h-[1px] bg-[#d4c6b2]" />
                <span className="text-xs text-[#526430]">🌿</span>
                <div className="w-12 h-[1px] bg-[#d4c6b2]" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <div>
                  <label className="block text-xs font-semibold text-[#504533] mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#f6efe2] border border-[#d6c7b0] rounded-xl px-4 py-2.5 text-xs text-[#403626] placeholder-[#9a8d79] focus:outline-none focus:ring-1 focus:ring-[#4a5e29]"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#504533] mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-[#8a7d69]" />
                  <input
                    id="input-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#f6efe2] border border-[#d6c7b0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#403626] placeholder-[#9a8d79] focus:outline-none focus:ring-1 focus:ring-[#4a5e29]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#504533] mb-1">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-[#8a7d69]" />
                  <input
                    id="input-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#f6efe2] border border-[#d6c7b0] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#403626] placeholder-[#9a8d79] focus:outline-none focus:ring-1 focus:ring-[#4a5e29]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#8a7d69] hover:text-[#4a5e29] focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {!isRegistering && (
                  <div className="text-right mt-1.5">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="font-handwriting text-xs text-[#6e614d] hover:text-[#384a1d] italic"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <button
                  id="btn-submit-login"
                  type="submit"
                  className="w-full bg-[#495c27] hover:bg-[#3d4d1f] text-white py-3 rounded-full font-handwriting text-lg sm:text-xl font-medium shadow-[0_4px_14px_rgba(73,92,39,0.25)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>{isRegistering ? 'Create Account' : 'Login'}</span>
                  <span>🍃</span>
                </button>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-[1px] flex-1 bg-[#d9cdba]" />
                <span className="text-[10px] font-semibold text-[#8a7d68] tracking-widest uppercase">OR</span>
                <div className="h-[1px] flex-1 bg-[#d9cdba]" />
              </div>

              {/* Continue with Google */}
              <button
                id="btn-login-google"
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-[#faf5eb] hover:bg-[#f1e8d9] border border-[#d6c7af] text-[#4d4231] py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2.5 shadow-sm transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="font-handwriting text-xs text-[#6e614d] hover:text-[#384a1d]"
                >
                  {isRegistering ? (
                    <>Already have an account? <span className="underline font-bold">Login here</span></>
                  ) : (
                    <>New to AyuDerma? <span className="underline font-bold">Create an account</span></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Security Note */}
      <div className="max-w-md mx-auto mt-6 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-[#6b5f4c]">
          <ShieldCheck className="w-4 h-4 text-[#4a5e29]" />
          <span>Your data is safe with us. We respect your privacy.</span>
          <span className="text-xs text-[#4a5e29]">🌿</span>
        </div>
      </div>
    </div>
  );
};
