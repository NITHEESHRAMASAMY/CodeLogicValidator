import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputField from './InputField';
import { X, Plus, Trash2, Save, Sparkles, BookOpen } from 'lucide-react';

export default function AdminProblemModal({ isOpen, onClose, onSave, problemToEdit, problem }) {
  const activeProb = problemToEdit || problem;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    difficulty: 'Easy',
    category: 'Basic Logic',
    tags: 'Variables, Arithmetic',
    points: 50,
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    sampleInput: '',
    sampleOutput: '',
    hints: '',
    expectedKeywords: 'declare, variable, sum, output'
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (activeProb) {
      setFormData({
        title: problemToEdit.title || '',
        slug: problemToEdit.slug || '',
        difficulty: problemToEdit.difficulty || 'Easy',
        category: problemToEdit.category || 'Basic Logic',
        tags: Array.isArray(problemToEdit.tags) ? problemToEdit.tags.join(', ') : '',
        points: problemToEdit.points || 50,
        description: problemToEdit.description || '',
        inputFormat: problemToEdit.inputFormat || '',
        outputFormat: problemToEdit.outputFormat || '',
        constraints: problemToEdit.constraints || '',
        sampleInput: problemToEdit.sampleCases?.[0]?.input || '',
        sampleOutput: problemToEdit.sampleCases?.[0]?.output || '',
        hints: Array.isArray(problemToEdit.hints) ? problemToEdit.hints.join('\n') : '',
        expectedKeywords: Array.isArray(problemToEdit.expectedKeywords) ? problemToEdit.expectedKeywords.join(', ') : ''
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        difficulty: 'Easy',
        category: 'Basic Logic',
        tags: 'Variables, Arithmetic',
        points: 50,
        description: '',
        inputFormat: '',
        outputFormat: '',
        constraints: '',
        sampleInput: '',
        sampleOutput: '',
        hints: '',
        expectedKeywords: 'declare, variable, sum, output'
      });
    }
  }, [problemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const problemPayload = {
      id: problemToEdit ? problemToEdit.id : 'prob-' + Date.now(),
      number: problemToEdit ? problemToEdit.number : Math.floor(100 + Math.random() * 900),
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      difficulty: formData.difficulty,
      category: formData.category,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      points: Number(formData.points) || 50,
      acceptanceRate: problemToEdit ? problemToEdit.acceptanceRate : '85.0%',
      description: formData.description,
      inputFormat: formData.inputFormat,
      outputFormat: formData.outputFormat,
      constraints: formData.constraints,
      sampleCases: [{ input: formData.sampleInput, output: formData.sampleOutput }],
      hints: formData.hints.split('\n').map((h) => h.trim()).filter(Boolean),
      expectedKeywords: formData.expectedKeywords.split(',').map((k) => k.trim()).filter(Boolean)
    };

    onSave(problemPayload);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-[#141414] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-luxury text-left overflow-hidden space-y-4 max-h-[90vh] flex flex-col cursor-default"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#2D2D2D]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
                  Admin Problem Configuration
                </span>
                <h3 className="text-xl font-bold font-display text-white">
                  {activeProb ? 'Edit Logic Problem' : 'Create New Logic Problem'}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-[#1F1F1F] hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-gray-400 hover:text-rose-400 transition-all cursor-pointer shadow-sm group"
              title="Cancel and close (Esc)"
              aria-label="Cancel and close modal"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          {/* Form Controls */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs font-mono">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="title"
                label="Problem Title"
                placeholder="Binary Search Logic"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full bg-[#141414] text-white text-sm rounded-xl py-3 px-4 border border-[#2D2D2D] focus:border-[#D4AF37] outline-none"
                >
                  <option value="Easy">Easy (50 PTS)</option>
                  <option value="Intermediate">Intermediate (120 PTS)</option>
                  <option value="Hard">Hard (250 PTS)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                id="category"
                label="Category"
                placeholder="Searching Algorithms"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />

              <InputField
                id="tags"
                label="Tags (Comma separated)"
                placeholder="Binary Search, Arrays"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                required
              />

              <InputField
                id="points"
                label="Reward Points"
                type="number"
                placeholder="100"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                required
              />
            </div>

            {/* Description Textarea */}
            <div className="space-y-1 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Problem Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Write clear logical requirements..."
                className="w-full bg-[#0E0E0E] text-gray-200 text-xs rounded-xl p-3 border border-[#2D2D2D] focus:border-[#D4AF37] outline-none font-sans"
                required
              />
            </div>

            {/* Formats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="inputFormat"
                label="Input Format"
                placeholder="Sorted array ARR of size N, target T"
                value={formData.inputFormat}
                onChange={(e) => setFormData({ ...formData, inputFormat: e.target.value })}
                required
              />

              <InputField
                id="outputFormat"
                label="Output Format"
                placeholder="Index of T, or -1 if not found"
                value={formData.outputFormat}
                onChange={(e) => setFormData({ ...formData, outputFormat: e.target.value })}
                required
              />
            </div>

            {/* Constraints & Sample */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                id="constraints"
                label="Constraints"
                placeholder="1 <= N <= 10^5"
                value={formData.constraints}
                onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
              />

              <InputField
                id="sampleInput"
                label="Sample Input"
                placeholder="ARR = [2, 5, 8], T = 5"
                value={formData.sampleInput}
                onChange={(e) => setFormData({ ...formData, sampleInput: e.target.value })}
              />

              <InputField
                id="sampleOutput"
                label="Sample Output"
                placeholder="Index 1"
                value={formData.sampleOutput}
                onChange={(e) => setFormData({ ...formData, sampleOutput: e.target.value })}
              />
            </div>

            {/* Hints & Expected Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Hints (One per line)
                </label>
                <textarea
                  value={formData.hints}
                  onChange={(e) => setFormData({ ...formData, hints: e.target.value })}
                  rows={2}
                  placeholder="Set low = 0, high = N - 1&#10;Calculate mid = (low + high) / 2"
                  className="w-full bg-[#0E0E0E] text-gray-200 text-xs rounded-xl p-3 border border-[#2D2D2D] focus:border-[#D4AF37] outline-none font-mono"
                />
              </div>

              <InputField
                id="expectedKeywords"
                label="Expected Keywords (Comma separated)"
                placeholder="low, high, mid, binary search, loop"
                value={formData.expectedKeywords}
                onChange={(e) => setFormData({ ...formData, expectedKeywords: e.target.value })}
              />
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-[#2D2D2D] flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl bg-[#1F1F1F] text-gray-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Problem</span>
              </button>
            </div>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
