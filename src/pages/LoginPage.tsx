import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { IMAGES } from '../data/initialData';
import { Droplet, Leaf, Sparkles, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, Calendar, User, MapPin, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeUpVariants, staggerContainer } from '../utils/animations';
import { calculateAgeFromDOB } from '../services/supabaseService';

export const LoginPage: React.FC = () => {
  const { user, login, signUp, updateProfile, setActivePage, showToast } = useApp();
  const [email, setEmail] = useState('ananya.sharma@example.com');
  const [password, setPassword] = useState('ayurveda2024');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('Ananya Sharma');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Multi-step signup/details state
  const [signupStep, setSignupStep] = useState<'account' | 'details'>('account');

  // Personal Details step fields
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth || '');
  const [age, setAge] = useState<number>(user.age || (user.dateOfBirth ? calculateAgeFromDOB(user.dateOfBirth) : 25));
  const [gender, setGender] = useState(user.gender || 'Prefer not to say');
  const [city, setCity] = useState(user.city || '');
  const [country, setCountry] = useState(user.country || 'India');

  // Get today's date formatted as YYYY-MM-DD for max date restriction
  const todayStr = new Date().toISOString().split('T')[0];

  // Pre-fill fields when user state updates
  useEffect(() => {
    if (user.dateOfBirth) setDateOfBirth(user.dateOfBirth);
    if (user.gender) setGender(user.gender);
    if (user.city) setCity(user.city);
    if (user.country) setCountry(user.country);
    if (user.dateOfBirth) {
      setAge(calculateAgeFromDOB(user.dateOfBirth));
    }
  }, [user]);

  // Recalculate age whenever date of birth changes
  const handleDobChange = (dobValue: string) => {
    setDateOfBirth(dobValue);
    if (dobValue) {
      const calculatedAge = calculateAgeFromDOB(dobValue);
      setAge(calculatedAge);
    } else {
      setAge(0);
    }
  };

  // Step 1 Submit (Account creation or Login)
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        const res = await signUp(name, email, password);
        if (res.success) {
          if (res.isProfileComplete) {
            setActivePage('home');
          } else {
            setSignupStep('details');
          }
        } else if (res.error) {
          setErrorMessage(res.error);
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          if (res.isProfileComplete) {
            setActivePage('home');
          } else {
            setSignupStep('details');
          }
        } else if (res.error) {
          setErrorMessage(res.error);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2 Submit (Personal Details step)
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate DOB is not in the future
    if (dateOfBirth && dateOfBirth > todayStr) {
      setErrorMessage('Date of Birth cannot be a future date.');
      return;
    }

    if (!dateOfBirth) {
      setErrorMessage('Please select a valid Date of Birth.');
      return;
    }

    setIsSubmitting(true);

    try {
      const calculatedAge = calculateAgeFromDOB(dateOfBirth);
      const formattedLocation = city && country ? `${city}, ${country}` : city || country || 'India';

      await updateProfile({
        dateOfBirth,
        age: calculatedAge,
        gender,
        city,
        country,
        location: formattedLocation,
      });

      showToast('Profile details saved successfully!');
      setActivePage('home');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving personal details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    showToast('A password reset link has been sent to your email.');
  };

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between px-6 md:px-14 py-6 md:py-8 font-sans text-[#2c2823]">
      {/* Background shadow leaf */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none opacity-20 select-none -z-10">
        <svg viewBox="0 0 200 200" fill="#4d5f2a" className="w-full h-full filter blur-[1px]">
          <path d="M20,10 Q60,40 40,90 Q80,70 110,120 Q60,110 30,150 Q70,160 50,200 Q20,130 10,80 Z" opacity="0.6" />
        </svg>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
        {/* Left Typography & Hero Branding */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="lg:col-span-6 flex flex-col justify-between space-y-6 pt-2"
        >
          <div>
            <span className="text-xs font-semibold tracking-widest text-[#495c27] uppercase block font-sans">
              HOLISTIC SKIN HEALTH PLATFORM
            </span>

            <h1 className="font-serif-title font-extrabold text-5xl sm:text-6xl md:text-7xl text-[#2c3817] leading-tight select-none mt-1">
              AyuDerma
              <span className="inline-block transform translate-y-[-10%] ml-2 text-[#495c27] text-3xl md:text-4xl">🌿</span>
            </h1>

            {/* Star Divider & Subtitle */}
            <div className="mt-4 flex flex-col items-start gap-2">
              <div className="flex items-center gap-3 w-full max-w-md">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b8aa92] to-transparent" />
                <span className="text-[#847558] text-sm select-none">✦</span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b8aa92] to-transparent" />
              </div>
              <h2 className="text-[#514532] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase font-sans">
                Healthy Skin. Confident You.
              </h2>
            </div>

            {/* 3 Icons */}
            <div className="flex items-center gap-6 sm:gap-10 py-5">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#b2a48f] bg-[#faf5ec]/80 flex items-center justify-center text-[#495c27] shadow-2xs">
                  <Droplet className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#4d4231] mt-2 uppercase">
                  NOURISH
                </span>
              </div>

              <div className="h-10 w-[1px] bg-[#d9cdba]" />

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#b2a48f] bg-[#faf5ec]/80 flex items-center justify-center text-[#495c27] shadow-2xs">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#4d4231] mt-2 uppercase">
                  PROTECT
                </span>
              </div>

              <div className="h-10 w-[1px] bg-[#d9cdba]" />

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#b2a48f] bg-[#faf5ec]/80 flex items-center justify-center text-[#495c27] shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#4d4231] mt-2 uppercase">
                  GLOW
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Left Image */}
          <div className="w-64 sm:w-80 max-w-full">
            <img
              src={IMAGES.mortarHerbs}
              alt="Ayurvedic herbs and fresh amla"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain rounded-2xl drop-shadow-md"
            />
          </div>
        </motion.div>

        {/* Right Floating Login/Signup Card */}
        <motion.div
          variants={fadeUpVariants}
          initial="initial"
          animate="animate"
          className="lg:col-span-6 flex justify-center lg:justify-end items-center"
        >
          <div
            id="card-login"
            className="w-full max-w-md bg-[#faf5ec]/95 backdrop-blur-md rounded-[28px] border border-[#e8ddce] p-7 sm:p-9 shadow-[0_16px_40px_rgba(80,68,48,0.09)] transition-all"
          >
            {/* Top Leaf Emblem */}
            <div className="flex justify-center mb-1">
              <span className="text-[#495c27] text-2xl">🌿</span>
            </div>

            {/* Step Indicator when in Personal Details mode */}
            {signupStep === 'details' && (
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-wider text-[#736855] uppercase font-sans mb-1">
                <span>Account</span>
                <span className="text-[#8c7f6c]">&rarr;</span>
                <span className="text-[#495c27] font-bold">Personal Details</span>
              </div>
            )}

            <div className="text-center mb-5">
              <h2 className="font-serif-title text-2xl sm:text-3xl text-[#2c3817] font-bold">
                {signupStep === 'details'
                  ? 'Personal Details'
                  : isRegistering
                  ? 'Create Your Account'
                  : 'Welcome Back'}
              </h2>
              <p className="text-xs text-[#736855] mt-1 font-sans">
                {signupStep === 'details'
                  ? 'Please complete your patient profile details'
                  : isRegistering
                  ? 'Begin your personalized holistic skin wellness journey'
                  : 'Sign in to access your scan history and routines'}
              </p>

              {/* Flourish ornament */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="w-12 h-[1px] bg-[#d4c6b2]" />
                <span className="text-xs text-[#495c27]">🌿</span>
                <div className="w-12 h-[1px] bg-[#d4c6b2]" />
              </div>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-sans">
                {errorMessage}
              </div>
            )}

            {signupStep === 'account' ? (
              /* STEP 1: Account Form */
              <form onSubmit={handleAccountSubmit} className="space-y-4">
                {isRegistering && (
                  <div>
                    <label className="block text-xs font-semibold text-[#4d4231] mb-1 font-sans">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#f6efe2] border border-[#d6c7b0] rounded-xl px-4 py-2.5 text-xs text-[#3d3424] placeholder-[#9a8d79] focus:outline-none focus:ring-1 focus:ring-[#495c27] font-sans"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#4d4231] mb-1 font-sans">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-[#8a7d69]" />
                    <input
                      id="input-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#f6efe2] border border-[#d6c7b0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#3d3424] placeholder-[#9a8d79] focus:outline-none focus:ring-1 focus:ring-[#495c27] font-sans"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4d4231] mb-1 font-sans">
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
                      className="w-full bg-[#f6efe2] border border-[#d6c7b0] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#3d3424] placeholder-[#9a8d79] focus:outline-none focus:ring-1 focus:ring-[#495c27] font-sans"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-[#8a7d69] hover:text-[#495c27] focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {!isRegistering && (
                    <div className="text-right mt-1.5">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs text-[#6e614d] hover:text-[#2c3817] font-sans hover:underline"
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
                    disabled={isSubmitting}
                    className="w-full bg-[#495c27] hover:bg-[#3d4d1f] disabled:opacity-70 text-white py-3 rounded-full font-sans text-sm font-semibold shadow-[0_4px_14px_rgba(73,92,39,0.25)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isRegistering ? 'Creating Account...' : 'Signing In...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isRegistering ? 'Continue' : 'Sign In'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(!isRegistering);
                      setErrorMessage(null);
                    }}
                    className="text-xs text-[#6e614d] hover:text-[#2c3817] font-sans"
                  >
                    {isRegistering ? (
                      <>Already have an account? <span className="underline font-bold">Sign in</span></>
                    ) : (
                      <>New to AyuDerma? <span className="underline font-bold">Create account</span></>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* STEP 2: Personal Details Form */
              <form onSubmit={handleDetailsSubmit} className="space-y-4 font-sans text-xs">
                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-semibold text-[#4d4231] mb-1 font-sans">
                    Date of Birth *
                  </label>
                  <div className="relative flex items-center">
                    <Calendar className="absolute left-3.5 w-4 h-4 text-[#8a7d69]" />
                    <input
                      type="date"
                      max={todayStr}
                      value={dateOfBirth}
                      onChange={(e) => handleDobChange(e.target.value)}
                      className="w-full bg-[#f6efe2] border border-[#d6c7b0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] font-sans"
                      required
                    />
                  </div>
                </div>

                {/* Age (Read-only, calculated automatically) */}
                <div>
                  <label className="block text-xs font-semibold text-[#4d4231] mb-1 font-sans">
                    Age (Calculated Automatically)
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-[#8a7d69]" />
                    <input
                      type="number"
                      value={age || ''}
                      readOnly
                      placeholder="Calculated automatically from Date of Birth"
                      className="w-full bg-[#eee4d4] border border-[#d6c7b0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#5e523f] cursor-not-allowed font-sans font-semibold"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-[#4d4231] mb-1 font-sans">
                    Gender *
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-[#8a7d69]" />
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-[#f6efe2] border border-[#d6c7b0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] font-sans"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-[#4d4231] mb-1 font-sans">
                    City *
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-3.5 w-4 h-4 text-[#8a7d69]" />
                    <input
                      type="text"
                      placeholder="Enter your city (e.g. Mumbai)"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#f6efe2] border border-[#d6c7b0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#3d3424] placeholder-[#9a8d79] focus:outline-none focus:ring-1 focus:ring-[#495c27] font-sans"
                      required
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs font-semibold text-[#4d4231] mb-1 font-sans">
                    Country *
                  </label>
                  <div className="relative flex items-center">
                    <Globe className="absolute left-3.5 w-4 h-4 text-[#8a7d69]" />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#f6efe2] border border-[#d6c7b0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] font-sans"
                      required
                    >
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#495c27] hover:bg-[#3d4d1f] disabled:opacity-70 text-white py-3 rounded-full font-sans text-sm font-semibold shadow-[0_4px_14px_rgba(73,92,39,0.25)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Profile...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Profile</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer Security Note */}
      <div className="max-w-md mx-auto mt-6 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-[#6b5f4c] font-sans">
          <ShieldCheck className="w-4 h-4 text-[#495c27]" />
          <span>Your data is encrypted and private. We adhere to clinical privacy standards.</span>
        </div>
      </div>
    </div>
  );
};
