import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus } from 'lucide-react';
import { IMAGES } from '../data/initialData';
import { motion } from 'motion/react';
import { modalOverlayVariants, modalContentVariants } from '../utils/animations';

export const AddRemedyModal: React.FC = () => {
  const { showAddRemedyModal, setShowAddRemedyModal, addSavedRemedy } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Brightening');
  const [benefit, setBenefit] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAddRemedyModal) {
        setShowAddRemedyModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddRemedyModal, setShowAddRemedyModal]);

  if (!showAddRemedyModal) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addSavedRemedy({
      id: `custom-rem-${Date.now()}`,
      title,
      category,
      benefit: benefit || 'Ayurvedic balance and natural radiance',
      imageUrl: IMAGES.turmeric,
      description: description || 'Handcrafted holistic blend based on Ayurvedic classics.',
      ingredients: ingredients ? ingredients.split(',').map(i => i.trim()) : ['Natural herbal extracts'],
    });

    setShowAddRemedyModal(false);
  };

  return (
    <motion.div
      variants={modalOverlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={() => setShowAddRemedyModal(false)}
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
        aria-labelledby="modal-add-remedy-title"
        id="modal-add-remedy"
        className="bg-[#faf5ec] border border-[#d8cbb8] rounded-3xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative font-sans text-[#332b20]"
      >
        <button
          onClick={() => setShowAddRemedyModal(false)}
          aria-label="Close add remedy modal"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#eee5d3] hover:bg-[#dfd4be] flex items-center justify-center text-[#554b38] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5 text-center">
          <span className="text-xs text-[#495c27] font-semibold tracking-widest uppercase">Custom Formulation</span>
          <h3 id="modal-add-remedy-title" className="font-serif-title font-bold text-2xl text-[#2c3817] mt-0.5">
            Add Ayurvedic Remedy
          </h3>
          <p className="text-xs text-[#706450] mt-1 font-sans">
            Save your favorite traditional herbal formulations to your profile
          </p>
        </div>

        <form onSubmit={handleAdd} className="space-y-3.5 text-xs text-[#4b4130]">
          <div>
            <label className="block font-semibold mb-1 text-[#3b3122]">Remedy Title</label>
            <input
              type="text"
              placeholder="e.g. Saffron & Chandan Glow Paste"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] focus:bg-[#faf5ec]"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-[#3b3122]">Benefit / Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] focus:bg-[#faf5ec]"
            >
              <option value="Brightening">Brightening</option>
              <option value="Pore Cleansing">Pore Cleansing</option>
              <option value="Oil Control">Oil Control</option>
              <option value="Acne Healing">Acne Healing</option>
              <option value="Hydration & Soothing">Hydration & Soothing</option>
              <option value="Strength & Shine">Strength & Shine</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-[#3b3122]">Primary Benefit</label>
            <input
              type="text"
              placeholder="e.g. Soothes redness and restores natural radiance"
              value={benefit}
              onChange={(e) => setBenefit(e.target.value)}
              className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] focus:bg-[#faf5ec]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-[#3b3122]">Key Ingredients (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Sandalwood, Kashmiri Saffron, Raw Milk"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] focus:bg-[#faf5ec]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-[#3b3122]">Preparation &amp; Usage</label>
            <textarea
              rows={3}
              placeholder="How to prepare and apply this remedy..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#495c27] focus:bg-[#faf5ec]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#dfd2be]">
            <button
              type="button"
              onClick={() => setShowAddRemedyModal(false)}
              className="px-5 py-2 rounded-full border border-[#bfae96] text-[#554a36] text-xs font-semibold hover:bg-[#eae0cb] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#495c27] hover:bg-[#3d4c20] text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#495c27]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Remedy</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
