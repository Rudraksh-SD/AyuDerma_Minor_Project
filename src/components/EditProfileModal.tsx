import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { modalOverlayVariants, modalContentVariants } from '../utils/animations';

export const EditProfileModal: React.FC = () => {
  const { showEditProfileModal, setShowEditProfileModal, user, updateProfile } = useApp();

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    age: user.age,
    location: user.location,
    skinType: user.skinType,
    skinGoals: user.skinGoals,
    sensitivity: user.sensitivity,
    currentCondition: user.currentCondition,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showEditProfileModal) {
        setShowEditProfileModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEditProfileModal, setShowEditProfileModal]);

  if (!showEditProfileModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      email: formData.email,
      age: Number(formData.age),
      location: formData.location,
      skinType: formData.skinType,
      skinGoals: formData.skinGoals,
      sensitivity: formData.sensitivity,
      currentCondition: formData.currentCondition,
    });
    setShowEditProfileModal(false);
  };

  return (
    <motion.div
      variants={modalOverlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={() => setShowEditProfileModal(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
    >
      <motion.div
        variants={modalContentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-edit-profile-title"
        id="modal-edit-profile"
        className="bg-[#faf5ec] border border-[#d8cbb8] rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative font-sans text-[#332b20]"
      >
        <button
          onClick={() => setShowEditProfileModal(false)}
          aria-label="Close edit profile"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#eee5d3] hover:bg-[#dfd4be] flex items-center justify-center text-[#554b38] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6 text-center">
          <span className="text-xs text-[#495c27] font-semibold tracking-widest uppercase">Profile Settings</span>
          <h3 id="modal-edit-profile-title" className="font-serif-title font-bold text-2xl sm:text-3xl text-[#2c3817] mt-0.5">
            Edit Profile Details
          </h3>
          <p className="text-xs text-[#706450] mt-1 font-sans">
            Keep your personalized Ayurvedic skin health parameters up to date
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#4b4130]">
          <div>
            <label className="block font-semibold mb-1 text-[#3b3122]">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] focus:bg-[#faf5ec]"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-[#3b3122]">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] focus:bg-[#faf5ec]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-[#3b3122]">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] focus:bg-[#faf5ec]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#3b3122]">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] focus:bg-[#faf5ec]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-[#3b3122]">Skin Type</label>
              <select
                value={formData.skinType}
                onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] focus:bg-[#faf5ec]"
              >
                <option value="Combination">Combination</option>
                <option value="Oily">Oily</option>
                <option value="Dry">Dry</option>
                <option value="Normal">Normal</option>
                <option value="Sensitive">Sensitive</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#3b3122]">Sensitivity</label>
              <select
                value={formData.sensitivity}
                onChange={(e) => setFormData({ ...formData, sensitivity: e.target.value })}
                className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] focus:bg-[#faf5ec]"
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-[#3b3122]">Skin Goals</label>
            <input
              type="text"
              value={formData.skinGoals}
              onChange={(e) => setFormData({ ...formData, skinGoals: e.target.value })}
              className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] focus:bg-[#faf5ec]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-[#3b3122]">Current Condition</label>
            <input
              type="text"
              value={formData.currentCondition}
              onChange={(e) => setFormData({ ...formData, currentCondition: e.target.value })}
              className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] focus:bg-[#faf5ec]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#dfd2be]">
            <button
              type="button"
              onClick={() => setShowEditProfileModal(false)}
              className="px-5 py-2 rounded-full border border-[#bfae96] text-[#554a36] text-xs font-semibold hover:bg-[#eae0cb] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#495c27] hover:bg-[#3d4c20] text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
