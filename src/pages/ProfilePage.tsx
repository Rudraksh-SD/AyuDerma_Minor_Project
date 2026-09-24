import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail,
  User,
  MapPin,
  Calendar,
  Sparkles,
  Leaf,
  Droplet,
  ChevronRight,
  Bell,
  Lock,
  HelpCircle,
  Globe,
  LogOut,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { fadeUpVariants, cardHoverProps } from '../utils/animations';

export const ProfilePage: React.FC = () => {
  const {
    user,
    logout,
    setActivePage,
    setShowEditProfileModal,
    setShowAddRemedyModal,
    removeSavedRemedy,
    showToast,
  } = useApp();

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
        <motion.div variants={fadeUpVariants} initial="initial" animate="animate" className="flex flex-col items-start">
          <span className="text-xs font-semibold tracking-widest text-[#495c27] uppercase block">USER DASHBOARD</span>
          <h1 className="font-serif-title font-bold text-4xl sm:text-5xl text-[#2c3817] leading-tight select-none mt-0.5">
            Your Profile &amp; Routine
          </h1>
          <p className="text-xs sm:text-sm text-[#665a48] mt-1">
            Manage your personal profile, active Ayurvedic routines, and saved formulations.
          </p>
        </motion.div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Column 1: Profile Information Card */}
          <motion.div
            {...cardHoverProps}
            id="card-user-profile-info"
            className="lg:col-span-3 bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex flex-col items-center text-center space-y-4"
          >
            {/* Avatar with edit badge */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#d8cdbc] shadow-xs">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#495c27] text-white flex items-center justify-center shadow-md hover:bg-[#3d4d1f] transition-all focus:outline-none"
                title="Edit avatar"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>

            {/* Name & Email */}
            <div>
              <h3 className="font-serif-title font-bold text-xl text-[#2c3817]">
                {user.name}
              </h3>
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#706451] mt-0.5 font-sans">
                <Mail className="w-3.5 h-3.5 text-[#495c27]" />
                <span>{user.email}</span>
              </div>
            </div>

            {/* Details List */}
            <div className="w-full space-y-2.5 pt-2 text-xs text-left border-t border-[#e8ded0]">
              <div className="flex items-center justify-between">
                <span className="text-[#786c59] flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[#495c27]" /> Skin Type
                </span>
                <span className="font-semibold text-[#2c3817]">{user.skinType}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#786c59] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#495c27]" /> Skin Goals
                </span>
                <span className="font-semibold text-[#2c3817] text-right text-[11px] max-w-[130px] truncate">
                  {user.skinGoals}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#786c59] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#495c27]" /> Age / Gender
                </span>
                <span className="font-semibold text-[#2c3817]">{user.age} {user.gender ? `(${user.gender})` : ''}</span>
              </div>

              {user.dateOfBirth && (
                <div className="flex items-center justify-between">
                  <span className="text-[#786c59] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#495c27]" /> DOB
                  </span>
                  <span className="font-semibold text-[#2c3817]">{user.dateOfBirth}</span>
                </div>
              )}

              {user.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-[#786c59] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#495c27]" /> Phone
                  </span>
                  <span className="font-semibold text-[#2c3817]">{user.phone}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[#786c59] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#495c27]" /> Location
                </span>
                <span className="font-semibold text-[#2c3817]">{user.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#786c59] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#495c27]" /> Member Since
                </span>
                <span className="font-semibold text-[#2c3817]">{user.memberSince}</span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              id="btn-edit-profile"
              onClick={() => setShowEditProfileModal(true)}
              className="w-full bg-[#495c27] hover:bg-[#3d4d1f] text-white py-2.5 rounded-full text-xs font-semibold tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
            >
              <span>Edit Profile</span>
              <Pencil className="w-3 h-3" />
            </button>
          </motion.div>

          {/* Column 2: Middle Section (Skin Info, Ayurvedic Routine, Saved Remedies) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Card 1: Skin Information */}
            <motion.div
              {...cardHoverProps}
              id="card-skin-information"
              className="bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)]"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4d4231] uppercase tracking-wider mb-3 font-sans">
                <span>Skin Profile Parameters</span>
                <span className="text-[#495c27]">🌿</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {/* Skin Type */}
                <div className="bg-[#f5ecde] border border-[#e2d5c0] rounded-2xl p-3 flex flex-col items-center justify-between shadow-2xs">
                  <div className="text-[10px] text-[#716450] uppercase font-semibold">Skin Type</div>
                  <div className="w-7 h-7 rounded-full bg-[#eee2ce] flex items-center justify-center text-[#495c27] my-1">
                    <Leaf className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-sans text-xs font-bold text-[#2c3817]">
                      {user.skinType}
                    </div>
                    <p className="text-[9px] text-[#756854] mt-0.5 leading-tight">
                      Balanced lipid T-zone.
                    </p>
                  </div>
                </div>

                {/* Primary Concerns */}
                <div className="bg-[#f5ecde] border border-[#e2d5c0] rounded-2xl p-3 flex flex-col items-center justify-between shadow-2xs">
                  <div className="text-[10px] text-[#716450] uppercase font-semibold">Concerns</div>
                  <div className="w-7 h-7 rounded-full bg-[#eee2ce] flex items-center justify-center text-[#495c27] my-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[#495c27]">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  </div>
                  <div className="text-left w-full pl-1">
                    <ul className="text-[9px] text-[#695c48] space-y-0.5 font-medium">
                      {(user.primaryConcerns || []).map((concern, idx) => (
                        <li key={idx}>&bull; {concern}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sensitivity */}
                <div className="bg-[#f5ecde] border border-[#e2d5c0] rounded-2xl p-3 flex flex-col items-center justify-between shadow-2xs">
                  <div className="text-[10px] text-[#716450] uppercase font-semibold">Sensitivity</div>
                  <div className="w-7 h-7 rounded-full bg-[#eee2ce] flex items-center justify-center text-[#495c27] my-1">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-sans text-xs font-bold text-[#2c3817]">
                      {user.sensitivity}
                    </div>
                    <p className="text-[9px] text-[#756854] mt-0.5 leading-tight">
                      {user.sensitivityDescription}
                    </p>
                  </div>
                </div>

                {/* Current Condition */}
                <div className="bg-[#f5ecde] border border-[#e2d5c0] rounded-2xl p-3 flex flex-col items-center justify-between shadow-2xs">
                  <div className="text-[10px] text-[#716450] uppercase font-semibold">Condition</div>
                  <div className="w-7 h-7 rounded-full bg-[#eee2ce] flex items-center justify-center text-[#495c27] my-1">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-sans text-xs font-bold text-[#2c3817]">
                      {user.currentCondition}
                    </div>
                    <p className="text-[9px] text-[#756854] mt-0.5 leading-tight">
                      {user.conditionDescription}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Your Current Ayurvedic Routine */}
            <motion.div
              {...cardHoverProps}
              id="card-ayurvedic-routine"
              className="bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)]"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4d4231] uppercase tracking-wider mb-3 font-sans">
                <span>Active Daily Regimen</span>
                <span className="text-[#495c27]">🌿</span>
              </div>

              {/* 5-step horizontal flow */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
                {/* Cleanse */}
                <div className="flex flex-col items-center text-center min-w-[70px]">
                  <span className="text-[10px] text-[#716450] mb-1 font-semibold">Cleanse</span>
                  <div className="w-8 h-8 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#495c27] mb-1 shadow-2xs">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M12 2v6m-4-2l4 4 4-4M4 11h16a8 8 0 0 1-16 0z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold text-[#2c3817] leading-tight font-sans">
                    {user.routine?.cleanse || 'Neem Face Wash'}
                  </span>
                </div>

                <span className="text-[#8c7e6c] font-sans text-xs">&rarr;</span>

                {/* Tone */}
                <div className="flex flex-col items-center text-center min-w-[70px]">
                  <span className="text-[10px] text-[#716450] mb-1 font-semibold">Tone</span>
                  <div className="w-8 h-8 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#495c27] mb-1 shadow-2xs">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#2c3817] leading-tight font-sans">
                    {user.routine?.tone || 'Rose Water'}
                  </span>
                </div>

                <span className="text-[#8c7e6c] font-sans text-xs">&rarr;</span>

                {/* Treat */}
                <div className="flex flex-col items-center text-center min-w-[70px]">
                  <span className="text-[10px] text-[#716450] mb-1 font-semibold">Treat</span>
                  <div className="w-8 h-8 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#495c27] mb-1 shadow-2xs">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#2c3817] leading-tight font-sans">
                    {user.routine?.treat || 'Kumkumadi Oil'}
                  </span>
                </div>

                <span className="text-[#8c7e6c] font-sans text-xs">&rarr;</span>

                {/* Moisturize */}
                <div className="flex flex-col items-center text-center min-w-[70px]">
                  <span className="text-[10px] text-[#716450] mb-1 font-semibold">Moisturize</span>
                  <div className="w-8 h-8 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#495c27] mb-1 shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#2c3817] leading-tight font-sans">
                    {user.routine?.moisturize || 'Aloe Vera Gel'}
                  </span>
                </div>

                <span className="text-[#8c7e6c] font-sans text-xs">&rarr;</span>

                {/* Nourish */}
                <div className="flex flex-col items-center text-center min-w-[70px]">
                  <span className="text-[10px] text-[#716450] mb-1 font-semibold">Nourish</span>
                  <div className="w-8 h-8 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#495c27] mb-1 shadow-2xs">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#2c3817] leading-tight font-sans">
                    {user.routine?.nourish || 'Night Serum'}
                  </span>
                </div>
              </div>

              {/* Update Button */}
              <div className="mt-3 text-center">
                <button
                  id="btn-update-skin-info"
                  onClick={() => setShowEditProfileModal(true)}
                  className="px-6 py-2 rounded-full border border-[#495c27] text-[#495c27] hover:bg-[#495c27] hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
                >
                  <span>Update Skin Parameters</span>
                  <Leaf className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* Card 3: Saved Remedies */}
            <motion.div
              {...cardHoverProps}
              id="card-saved-remedies"
              className="bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4d4231] uppercase tracking-wider font-sans">
                  <span>Saved Botanical Remedies</span>
                  <span className="text-[#495c27]">🌿</span>
                </div>
                <button
                  onClick={() => setShowAddRemedyModal(true)}
                  className="text-[11px] text-[#495c27] font-semibold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3 h-3" /> Add Custom
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {(user.savedRemedies || []).map((remedy) => (
                  <div
                    key={remedy.id}
                    className="group relative bg-[#f5ecde] border border-[#e2d5c0] rounded-2xl p-2.5 flex flex-col items-center text-center justify-between transition-transform hover:scale-[1.02]"
                  >
                    <div>
                      <div className="font-semibold text-[11px] text-[#2c3817] leading-tight font-sans">
                        {remedy.title}
                      </div>
                      <span className="text-[9px] text-[#6d604e] font-sans">
                        {remedy.category}
                      </span>
                    </div>

                    <div className="w-12 h-12 my-1 rounded-xl overflow-hidden border border-[#d8ccb8]">
                      <img
                        src={remedy.imageUrl}
                        alt={remedy.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <button
                      onClick={() => removeSavedRemedy(remedy.id)}
                      title="Remove from saved"
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 text-red-700/70 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Add More card */}
                <button
                  id="btn-add-more-remedy"
                  onClick={() => setShowAddRemedyModal(true)}
                  className="border-2 border-dashed border-[#cdbeaa] rounded-2xl p-2.5 flex flex-col items-center justify-center text-center hover:bg-[#eee3d1]/50 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-[#eae0cd] flex items-center justify-center text-[#495c27] mb-1">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#4d4231] font-sans">Add Custom</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Column 3: Progress Summary & Settings */}
          <div className="lg:col-span-3 space-y-4">
            {/* Card 1: Progress Summary */}
            <motion.div
              {...cardHoverProps}
              id="card-progress-summary"
              className="bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)]"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4d4231] uppercase tracking-wider mb-2 font-sans">
                <span>Progress Metrics</span>
                <span className="text-[#495c27]">🌿</span>
              </div>

              <div className="flex items-center gap-3 my-2">
                {/* Circular Gauge */}
                <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" stroke="#e6dccb" strokeWidth="3.5" fill="transparent" />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="#495c27"
                      strokeWidth="3.5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={2 * Math.PI * 16 * (1 - (user.stats?.overallProgress || 0) / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute font-sans text-xs font-bold text-[#2c3817]">
                    {user.stats?.overallProgress || 0}%
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#2c3817]">Adherence Score</h4>
                  <p className="text-[10px] text-[#6d604e] leading-tight mt-0.5 font-sans">
                    Routine adherence &amp; stability
                  </p>
                  <button
                    onClick={() => setActivePage('progress')}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#495c27] hover:underline mt-1"
                  >
                    <span>View Progress</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Mini 3 stats row */}
              <div className="grid grid-cols-3 gap-1 pt-3 border-t border-[#e8ded0] text-center font-sans">
                <div>
                  <div className="text-sm font-bold text-[#2c3817]">
                    {user.stats?.scansCompleted || 0}
                  </div>
                  <div className="text-[9px] text-[#716552]">Scans</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2c3817]">
                    {user.stats?.weeksConsistent || 0}
                  </div>
                  <div className="text-[9px] text-[#716552]">Weeks</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2c3817]">
                    {user.stats?.improvementScore || 0}%
                  </div>
                  <div className="text-[9px] text-[#716552]">Improvement</div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Settings & Preferences */}
            <motion.div
              {...cardHoverProps}
              id="card-settings-preferences"
              className="bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] space-y-3"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4d4231] uppercase tracking-wider font-sans">
                <span>Account Settings</span>
                <span className="text-[#495c27]">🌿</span>
              </div>

              <div className="space-y-1.5 text-xs font-sans">
                {/* Notifications */}
                <button
                  onClick={() => showToast('Notification preferences updated.')}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#f3eadb] transition-colors text-left focus:outline-none"
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-3.5 h-3.5 text-[#495c27]" />
                    <div>
                      <div className="font-semibold text-[#2c3817]">Notifications</div>
                      <div className="text-[10px] text-[#786b58]">Alerts &amp; reminders</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8c7e6c]" />
                </button>

                {/* Privacy */}
                <button
                  onClick={() => showToast('Privacy settings are securely managed.')}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#f3eadb] transition-colors text-left focus:outline-none"
                >
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-3.5 h-3.5 text-[#495c27]" />
                    <div>
                      <div className="font-semibold text-[#2c3817]">Privacy &amp; Data</div>
                      <div className="text-[10px] text-[#786b58]">Data control</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8c7e6c]" />
                </button>

                {/* Help */}
                <button
                  onClick={() => showToast('Connecting to AyuDerma Support Specialist...')}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#f3eadb] transition-colors text-left focus:outline-none"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#495c27]" />
                    <div>
                      <div className="font-semibold text-[#2c3817]">Support</div>
                      <div className="text-[10px] text-[#786b58]">Contact specialist</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8c7e6c]" />
                </button>

                {/* Language */}
                <button
                  onClick={() => showToast('Languages: English (active), Sanskrit, Hindi.')}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#f3eadb] transition-colors text-left focus:outline-none"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-3.5 h-3.5 text-[#495c27]" />
                    <div>
                      <div className="font-semibold text-[#2c3817]">Language</div>
                      <div className="text-[10px] text-[#786b58]">English</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8c7e6c]" />
                </button>
              </div>

              {/* Logout Button */}
              <div className="pt-2 border-t border-[#e8ded0]">
                <button
                  id="btn-logout"
                  onClick={logout}
                  className="w-full py-2.5 rounded-full border border-[#bfae96] text-[#554a36] hover:bg-[#eee1ce] text-xs font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout Account</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
