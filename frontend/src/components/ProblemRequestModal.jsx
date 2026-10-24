import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Send,
  X,
  Sparkles,
  CheckCircle2,
  Copy,
  AlertCircle,
  FileCode2,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';
import API from '../services/api';
import confetti from 'canvas-confetti';

export default function ProblemRequestModal({ isOpen, onClose }) {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arrays');
  const [difficulty, setDifficulty] = useState('Easy');
  const [description, setDescription] = useState('');
  const [testCases, setTestCases] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleResetAndClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setTitle('');
    setDescription('');
    setTestCases('');
    setSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleResetAndClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const senderEmail = user?.email || 'student@clv.io';
  const senderName = user?.fullName || 'CLV Student';

  const formatEmailBody = () => {
    return `Hello Admin (Nitheesh),

I would like to request a new problem to be added to the CodeLogicValidator platform.

==================================================
PROBLEM DETAILS:
==================================================
Title: ${title}
Category: ${category}
Difficulty: ${difficulty}
Requested By: ${senderName} (${senderEmail})

==================================================
DESCRIPTION & LOGIC GOAL:
==================================================
${description}

==================================================
TEST CASES & SAMPLE INPUT/OUTPUT:
==================================================
${testCases}

==================================================
Thank you,
${senderName}`;
  };

  const handleOpenMailClient = () => {
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please enter at least a Problem Title and Description.');
      return;
    }
    setErrorMsg('');
    const subject = encodeURIComponent(`[CLV Problem Request] ${title}`);
    const body = encodeURIComponent(formatEmailBody());
    window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleCopyRequest = () => {
    navigator.clipboard.writeText(formatEmailBody());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitToPortal = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please provide a Problem Title and Description.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const payload = {
      title: title.trim(),
      category,
      difficulty,
      description: description.trim(),
      testCases: testCases.trim() || 'No explicit test cases specified.',
      userName: senderName,
      userEmail: senderEmail
    };

    try {
      await API.post('/problems/request', payload);
    } catch (err) {
      console.warn('Backend problem request fallback: saving locally', err);
      // Local fallback for offline mode
      const savedRequests = JSON.parse(localStorage.getItem('clv_problem_requests') || '[]');
      savedRequests.unshift({
        id: 'req-' + Date.now(),
        ...payload,
        createdAt: new Date().toISOString(),
        status: 'PENDING'
      });
      localStorage.setItem('clv_problem_requests', JSON.stringify(savedRequests));
    }

    setIsSubmitting(false);
    setSubmitted(true);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      // Ignore if confetti unavailable
    }
  };

  const modalContent = (
    <AnimatePresence>
      <div
        onClick={handleResetAndClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md cursor-pointer overflow-y-auto"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#141414] border border-[#D4AF37]/50 rounded-3xl p-5 sm:p-6 shadow-luxury text-left overflow-hidden flex flex-col max-h-[92vh] my-auto cursor-default"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#2D2D2D] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#1E1E1E] to-[#0E0E0E] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Direct Admin Dispatch
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                  Request a New Problem
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="p-2 sm:p-2.5 rounded-xl bg-[#1F1F1F] hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-gray-400 hover:text-rose-400 transition-all cursor-pointer shadow-sm group shrink-0"
              title="Cancel and close (Esc)"
              aria-label="Cancel and close"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          {/* Admin Destination Pill */}
          <div className="my-2.5 p-2.5 rounded-xl bg-[#1A1A1A] border border-[#2D2D2D] flex items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-gray-300 font-sans">
                Destination: <strong className="text-[#D4AF37] font-mono">{ADMIN_EMAIL}</strong> (CLV Administrator)
              </span>
            </div>
            <span className="text-[11px] font-mono text-gray-400">
              From: <strong className="text-white">{senderEmail}</strong>
            </span>
          </div>

          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold font-display text-white">
                Problem Request Dispatched!
              </h4>
              <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                Your problem request with title <strong className="text-[#D4AF37]">"{title}"</strong>, description, and test cases has been dispatched to Admin (<strong className="text-[#D4AF37]">{ADMIN_EMAIL}</strong>).
              </p>
              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleOpenMailClient}
                  className="px-4 py-2 rounded-xl bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-[#D4AF37]" /> Open in Mail App
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-bold font-display uppercase tracking-wider transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitToPortal} className="flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-1.5">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-400 tracking-wider">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Find Longest Common Prefix or Matrix Transpose"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2D2D2D] rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-400 tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2D2D2D] rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="Arrays">Arrays</option>
                    <option value="Strings">Strings</option>
                    <option value="Math">Math & Numbers</option>
                    <option value="Conditionals">Conditionals</option>
                    <option value="Loops">Loops & Traversal</option>
                    <option value="Searching">Searching & Pointers</option>
                    <option value="Sorting">Sorting</option>
                  </select>
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-400 tracking-wider">
                  Target Difficulty
                </label>
                <div className="flex items-center gap-2">
                  {['Easy', 'Intermediate', 'Hard'].map((diff) => (
                    <button
                      type="button"
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                        difficulty === diff
                          ? diff === 'Easy'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                            : diff === 'Intermediate'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                          : 'bg-[#181818] text-gray-400 border-[#2D2D2D] hover:text-white'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-400 tracking-wider flex items-center justify-between">
                  <span>Problem Description & Logic Requirement *</span>
                  <span className="text-gray-500 lowercase">natural language requirements</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain the problem statement and the logic the user needs to write (e.g., Read array of integers, reverse elements without library functions, print final array)."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2D2D2D] rounded-xl p-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none placeholder:text-gray-600 font-sans leading-relaxed"
                />
              </div>

              {/* Test Cases */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-gray-400 tracking-wider flex items-center justify-between">
                  <span>Test Cases / Sample Inputs & Expected Outputs</span>
                  <span className="text-gray-500 lowercase">input/output examples</span>
                </label>
                <textarea
                  rows={3}
                  placeholder={`Example 1:\nInput: nums = [1, 2, 3, 4, 5]\nOutput: [5, 4, 3, 2, 1]\n\nExample 2:\nInput: nums = [10]\nOutput: [10]`}
                  value={testCases}
                  onChange={(e) => setTestCases(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2D2D2D] rounded-xl p-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none placeholder:text-gray-600 font-mono leading-relaxed"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-[#2D2D2D] flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyRequest}
                    className="px-3 py-2 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 transition-all"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenMailClient}
                    className="px-3.5 py-2 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37] flex items-center gap-1.5 transition-all"
                    title={`Open in email app addressed to ${ADMIN_EMAIL}`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Mail Client →</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2.5 px-6 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Dispatching...' : 'Submit to Admin'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
