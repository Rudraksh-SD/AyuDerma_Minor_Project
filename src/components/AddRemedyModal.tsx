import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Sparkles } from 'lucide-react';
import { IMAGES } from '../data/initialData';

export const AddRemedyModal: React.FC = () => {
  const { showAddRemedyModal, setShowAddRemedyModal, addSavedRemedy } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Brightening');
  const [benefit, setBenefit] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-add-remedy"
        className="bg-[#faf5ec] border border-[#d8cbb8] rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative"
      >
        <button
          onClick={() => setShowAddRemedyModal(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#eee5d3] hover:bg-[#dfd4be] flex items-center justify-center text-[#554b38] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5 text-center">
          <span className="text-xs text-[#526532] font-semibold tracking-wider uppercase">Custom Formulation</span>
          <h3 className="font-kunstler text-4xl text-[#394a1d]">Add Ayurvedic Remedy</h3>
          <p className="font-handwriting text-xs text-[#706450]">Save your favorite traditional herb remedies</p>
        </div>

        <form onSubmit={handleAdd} className="space-y-3.5 text-xs text-[#4b4130]">
          <div>
            <label className="block font-semibold mb-1">Remedy Title</label>
            <input
              type="text"
              placeholder="e.g. Saffron & Chandan Glow Paste"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#4a5e29]"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Benefit / Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#4a5e29]"
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
            <label className="block font-semibold mb-1">Primary Benefit</label>
            <input
              type="text"
              placeholder="e.g. Soothes redness and restores natural radiance"
              value={benefit}
              onChange={(e) => setBenefit(e.target.value)}
              className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#4a5e29]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Key Ingredients (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Sandalwood, Kashmiri Saffron, Raw Milk"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#4a5e29]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Preparation & Usage</label>
            <textarea
              rows={3}
              placeholder="How to prepare and apply this remedy..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#f4ecdf] border border-[#d3c4ad] rounded-xl px-3.5 py-2.5 text-xs text-[#3d3424] focus:outline-none focus:ring-1 focus:ring-[#4a5e29]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#dfd2be]">
            <button
              type="button"
              onClick={() => setShowAddRemedyModal(false)}
              className="px-5 py-2 rounded-full border border-[#bfae96] text-[#554a36] text-xs font-semibold hover:bg-[#eae0cb] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#495b28] hover:bg-[#3d4c20] text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Remedy</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
