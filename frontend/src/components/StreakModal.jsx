import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Calendar,
  Sparkles,
  X,
  Target,
  Trophy
} from 'lucide-react';

export default function StreakModal({
  isOpen,
  onClose,
  streak = 0,
  lastSolvedDate
}) {
  const consistencyGoal = 7;
  const progressPercent = Math.min(100, Math.round(((streak || 0) / consistencyGoal) * 100));

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
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
          className="relative w-full max-w-lg bg-[#141414] border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-luxury text-left overflow-hidden flex flex-col cursor-default"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#2D2D2D]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-950/70 to-amber-950/40 border border-orange-500/50 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-orange-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Live Consistency Tracker
                </span>
                <h3 className="text-xl font-bold font-display text-white">
                  Current Daily Streak
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
              aria-label="Close streak modal"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          {/* Central Hero Streak Showcase */}
          <div className="my-6 text-center py-6 px-4 rounded-2xl bg-gradient-to-b from-orange-950/20 via-[#181818] to-[#121212] border border-orange-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient from-orange-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative inline-flex items-center justify-center mb-3">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/5 border-2 border-orange-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                <Flame className={`w-12 h-12 text-orange-400 ${streak > 0 ? 'animate-bounce' : 'opacity-40'}`} />
              </div>
            </div>

            <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 mb-1">
              Active Daily Streak
            </p>
            <h2 className="text-5xl font-black text-white font-display tracking-tight">
              {streak} <span className="text-2xl font-bold text-orange-400">{streak === 1 ? 'Day' : 'Days'}</span>
            </h2>

            <div className="mt-3 flex items-center justify-center">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border ${
                streak > 0
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]'
                  : 'bg-gray-800 text-gray-400 border-gray-700'
              }`}>
                <Flame className="w-3.5 h-3.5 fill-current" />
                {streak > 0 ? 'STREAK ACTIVE & ON FIRE' : 'NO ACTIVE STREAK (0 DAYS)'}
              </span>
            </div>
          </div>

          {/* Details & Milestone Progress */}
          <div className="space-y-3 mb-6">
            <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#2D2D2D] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-orange-400" /> 7-Day Consistency Milestone
                </span>
                <span className="text-white font-bold">{streak} / {consistencyGoal} Days ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#121212] overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-[#D4AF37] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#181818] border border-[#2D2D2D] flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-400" /> Last Solved Date
              </span>
              <span className="text-white font-bold">{lastSolvedDate || 'Not yet recorded'}</span>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-[#2D2D2D] flex justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto py-2.5 px-8 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-black bg-gradient-to-r from-orange-400 via-amber-400 to-[#D4AF37] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all cursor-pointer"
            >
              Done
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
