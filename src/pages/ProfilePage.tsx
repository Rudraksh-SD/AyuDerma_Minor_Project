import React from 'react';
import { useApp } from '../context/AppContext';
import { IMAGES } from '../data/initialData';
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
            Your Profile
          </h1>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-[#847558] text-xs">✦</span>
            <p className="font-handwriting text-xs sm:text-sm text-[#665a48] flex items-center gap-1.5">
              <span>Your skin. Your journey. Your best self.</span>
              <span className="text-[#495b28]">🌿</span>
            </p>
          </div>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Column 1: Profile Information Card */}
          <div
            id="card-user-profile-info"
            className="lg:col-span-3 bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] flex flex-col items-center text-center space-y-4"
          >
            {/* Avatar with edit badge */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#d8cdbc] shadow-sm">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#495c27] text-white flex items-center justify-center shadow-md hover:bg-[#3d4d1f] transition-all"
                title="Edit avatar"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>

            {/* Name & Email */}
            <div>
              <h3 className="font-handwriting text-2xl text-[#384a1d] font-bold">
                {user.name}
              </h3>
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#706451] mt-0.5">
                <Mail className="w-3 h-3 text-[#526430]" />
                <span>{user.email}</span>
              </div>
            </div>

            {/* Details List */}
            <div className="w-full space-y-2.5 pt-2 text-xs text-left border-t border-[#e8ded0]">
              <div className="flex items-center justify-between">
                <span className="text-[#786c59] flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[#526430]" /> Skin Type
                </span>
                <span className="font-semibold text-[#403423]">{user.skinType}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#786c59] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#526430]" /> Skin Goals
                </span>
                <span className="font-semibold text-[#403423] text-right text-[11px] max-w-[130px] truncate">
                  {user.skinGoals}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#786c59] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#526430]" /> Age
                </span>
                <span className="font-semibold text-[#403423]">{user.age}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#786c59] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#526430]" /> Location
                </span>
                <span className="font-semibold text-[#403423]">{user.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#786c59] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#526430]" /> Member Since
                </span>
                <span className="font-semibold text-[#403423]">{user.memberSince}</span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              id="btn-edit-profile"
              onClick={() => setShowEditProfileModal(true)}
              className="w-full bg-[#495c27] hover:bg-[#3d4d1f] text-white py-2.5 rounded-full text-xs font-semibold tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Edit Profile</span>
              <Pencil className="w-3 h-3" />
            </button>
          </div>

          {/* Column 2: Middle Section (Skin Info, Ayurvedic Routine, Saved Remedies) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Card 1: Skin Information */}
            <div
              id="card-skin-information"
              className="bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)]"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#524634] mb-3">
                <span>Skin Information</span>
                <span className="text-[#495b28]">🌿</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {/* Skin Type */}
                <div className="bg-[#f5ecde] border border-[#e2d5c0] rounded-2xl p-3 flex flex-col items-center justify-between">
                  <div className="text-[10px] text-[#716450] uppercase font-semibold">Skin Type</div>
                  <div className="w-7 h-7 rounded-full bg-[#eee2ce] flex items-center justify-center text-[#495b28] my-1">
                    <Leaf className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-handwriting text-sm font-bold text-[#384a1d]">
                      {user.skinType}
                    </div>
                    <p className="text-[9px] text-[#756854] mt-0.5 leading-tight">
                      Balanced oily T-zone with normal to dry cheeks.
                    </p>
                  </div>
                </div>

                {/* Primary Concerns */}
                <div className="bg-[#f5ecde] border border-[#e2d5c0] rounded-2xl p-3 flex flex-col items-center justify-between">
                  <div className="text-[10px] text-[#716450] uppercase font-semibold">Primary Concerns</div>
                  <div className="w-7 h-7 rounded-full bg-[#eee2ce] flex items-center justify-center text-[#495b28] my-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[#495b28]">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  </div>
                  <div className="text-left w-full pl-1">
                    <ul className="text-[9px] text-[#695c48] space-y-0.5">
                      {user.primaryConcerns.map((concern, idx) => (
                        <li key={idx}>&bull; {concern}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sensitivity */}
                <div className="bg-[#f5ecde] border border-[#e2d5c0] rounded-2xl p-3 flex flex-col items-center justify-between">
                  <div className="text-[10px] text-[#716450] uppercase font-semibold">Sensitivity</div>
                  <div className="w-7 h-7 rounded-full bg-[#eee2ce] flex items-center justify-center text-[#495b28] my-1">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-handwriting text-sm font-bold text-[#384a1d]">
                      {user.sensitivity}
                    </div>
                    <p className="text-[9px] text-[#756854] mt-0.5 leading-tight">
                      {user.sensitivityDescription}
                    </p>
                  </div>
                </div>

                {/* Current Condition */}
                <div className="bg-[#f5ecde] border border-[#e2d5c0] rounded-2xl p-3 flex flex-col items-center justify-between">
                  <div className="text-[10px] text-[#716450] uppercase font-semibold">Current Condition</div>
                  <div className="w-7 h-7 rounded-full bg-[#eee2ce] flex items-center justify-center text-[#495b28] my-1">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-handwriting text-sm font-bold text-[#384a1d]">
                      {user.currentCondition}
                    </div>
                    <p className="text-[9px] text-[#756854] mt-0.5 leading-tight">
                      {user.conditionDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Your Current Ayurvedic Routine */}
            <div
              id="card-ayurvedic-routine"
              className="bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)]"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#524634] mb-3">
                <span>Your Current Ayurvedic Routine</span>
                <span className="text-[#495b28]">🌿</span>
              </div>

              {/* 5-step horizontal flow with arrows */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
                {/* Cleanse */}
                <div className="flex flex-col items-center text-center min-w-[70px]">
                  <span className="text-[10px] text-[#716450] mb-1">Cleanse</span>
                  <div className="w-8 h-8 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#495b28] mb-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#495b28]">
                      <path d="M12 2v6m-4-2l4 4 4-4M4 11h16a8 8 0 0 1-16 0z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold text-[#403423] leading-tight">
                    {user.routine.cleanse}
                  </span>
                </div>

                <span className="text-[#8c7e6c] font-sans text-xs">&rarr;</span>

                {/* Tone */}
                <div className="flex flex-col items-center text-center min-w-[70px]">
                  <span className="text-[10px] text-[#716450] mb-1">Tone</span>
                  <div className="w-8 h-8 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#495b28] mb-1">
                    <Droplet className="w-4 h-4 text-[#495b28]" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#403423] leading-tight">
                    {user.routine.tone}
                  </span>
                </div>

                <span className="text-[#8c7e6c] font-sans text-xs">&rarr;</span>

                {/* Treat */}
                <div className="flex flex-col items-center text-center min-w-[70px]">
                  <span className="text-[10px] text-[#716450] mb-1">Treat</span>
                  <div className="w-8 h-8 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#495b28] mb-1">
                    <Leaf className="w-4 h-4 text-[#495b28]" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#403423] leading-tight">
                    {user.routine.treat}
                  </span>
                </div>

                <span className="text-[#8c7e6c] font-sans text-xs">&rarr;</span>

                {/* Moisturize */}
                <div className="flex flex-col items-center text-center min-w-[70px]">
                  <span className="text-[10px] text-[#716450] mb-1">Moisturize</span>
                  <div className="w-8 h-8 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#495b28] mb-1">
                    <Sparkles className="w-4 h-4 text-[#495b28]" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#403423] leading-tight">
                    {user.routine.moisturize}
                  </span>
                </div>

                <span className="text-[#8c7e6c] font-sans text-xs">&rarr;</span>

                {/* Nourish */}
                <div className="flex flex-col items-center text-center min-w-[70px]">
                  <span className="text-[10px] text-[#716450] mb-1">Nourish</span>
                  <div className="w-8 h-8 rounded-full border border-[#d6c7b0] bg-[#f5ede0] flex items-center justify-center text-[#495b28] mb-1">
                    <Leaf className="w-4 h-4 text-[#495b28]" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#403423] leading-tight">
                    {user.routine.nourish}
                  </span>
                </div>
              </div>

              {/* Update Skin Information Button */}
              <div className="mt-3 text-center">
                <button
                  id="btn-update-skin-info"
                  onClick={() => setShowEditProfileModal(true)}
                  className="px-6 py-2 rounded-full border border-[#495c27] text-[#495c27] hover:bg-[#495c27] hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto transition-all shadow-xs"
                >
                  <span>Update Skin Information</span>
                  <Leaf className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Saved Remedies */}
            <div
              id="card-saved-remedies"
              className="bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#524634]">
                  <span>Saved Remedies</span>
                  <span className="text-[#495b28]">🌿</span>
                </div>
                <button
                  onClick={() => setShowAddRemedyModal(true)}
                  className="text-[11px] text-[#495b28] font-semibold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3 h-3" /> Add Custom
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {user.savedRemedies.map((remedy) => (
                  <div
                    key={remedy.id}
                    className="group relative bg-[#f5ecde] border border-[#e2d5c0] rounded-2xl p-2.5 flex flex-col items-center text-center justify-between transition-transform hover:scale-[1.02]"
                  >
                    <div>
                      <div className="font-semibold text-[10px] text-[#3d3222] leading-tight">
                        {remedy.title}
                      </div>
                      <span className="text-[9px] text-[#6d604e] font-handwriting">
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
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 text-red-700/60 hover:text-red-700"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}

                {/* Add More card */}
                <button
                  id="btn-add-more-remedy"
                  onClick={() => setShowAddRemedyModal(true)}
                  className="border-2 border-dashed border-[#cdbeaa] rounded-2xl p-2.5 flex flex-col items-center justify-center text-center hover:bg-[#eee3d1]/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#eae0cd] flex items-center justify-center text-[#554734] mb-1">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#554734]">Add More</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 3: Progress Summary & Settings */}
          <div className="lg:col-span-3 space-y-4">
            {/* Card 1: Progress Summary */}
            <div
              id="card-progress-summary"
              className="bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)]"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#524634] mb-2">
                <span>Progress Summary</span>
                <span className="text-[#495b28]">🌿</span>
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
                      stroke="#495b28"
                      strokeWidth="3.5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={2 * Math.PI * 16 * (1 - user.stats.overallProgress / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute font-sans text-xs font-bold text-[#384a1d]">
                    {user.stats.overallProgress}%
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#384a1d]">Great job!</h4>
                  <p className="text-[10px] text-[#6d604e] leading-tight mt-0.5">
                    Your skin health is improving beautifully.
                  </p>
                  <button
                    onClick={() => setActivePage('progress')}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#495b28] hover:underline mt-1"
                  >
                    <span>View Progress</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Mini 3 stats row */}
              <div className="grid grid-cols-3 gap-1 pt-3 border-t border-[#e8ded0] text-center">
                <div>
                  <div className="font-sans text-sm font-bold text-[#384a1d]">
                    {user.stats.scansCompleted}
                  </div>
                  <div className="text-[9px] text-[#716552]">Scans Completed</div>
                </div>
                <div>
                  <div className="font-sans text-sm font-bold text-[#384a1d]">
                    {user.stats.weeksConsistent}
                  </div>
                  <div className="text-[9px] text-[#716552]">Weeks Consistent</div>
                </div>
                <div>
                  <div className="font-sans text-sm font-bold text-[#384a1d]">
                    {user.stats.improvementScore}%
                  </div>
                  <div className="text-[9px] text-[#716552]">Improvement Score</div>
                </div>
              </div>
            </div>

            {/* Card 2: Settings & Preferences */}
            <div
              id="card-settings-preferences"
              className="bg-[#faf5ec]/95 backdrop-blur-md border border-[#e8ded0] rounded-3xl p-5 shadow-[0_4px_16px_rgba(90,75,50,0.04)] space-y-3"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#524634]">
                <span>Settings &amp; Preferences</span>
                <span className="text-[#495b28]">🌿</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {/* Notifications */}
                <button
                  onClick={() => showToast('Notification preferences updated.')}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#f3eadb] transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-3.5 h-3.5 text-[#554734]" />
                    <div>
                      <div className="font-medium text-[#3b3122]">Manage Notifications</div>
                      <div className="text-[10px] text-[#786b58]">Customize alerts and reminders</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8c7e6c]" />
                </button>

                {/* Privacy */}
                <button
                  onClick={() => showToast('Privacy settings are securely managed.')}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#f3eadb] transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-3.5 h-3.5 text-[#554734]" />
                    <div>
                      <div className="font-medium text-[#3b3122]">Privacy &amp; Security</div>
                      <div className="text-[10px] text-[#786b58]">Manage your privacy and data</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8c7e6c]" />
                </button>

                {/* Help */}
                <button
                  onClick={() => showToast('Connecting to AyuDerma Support Specialist...')}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#f3eadb] transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#554734]" />
                    <div>
                      <div className="font-medium text-[#3b3122]">Help &amp; Support</div>
                      <div className="text-[10px] text-[#786b58]">Get help and contact support</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8c7e6c]" />
                </button>

                {/* Language */}
                <button
                  onClick={() => showToast('Languages: English (active), Sanskrit, Hindi.')}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#f3eadb] transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-3.5 h-3.5 text-[#554734]" />
                    <div>
                      <div className="font-medium text-[#3b3122]">Language</div>
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
                  className="w-full py-2 rounded-full border border-[#bfae96] text-[#554937] hover:bg-[#eee1ce] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
