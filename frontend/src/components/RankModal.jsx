import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  X,
  Zap,
  Star,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { LOGIC_RANKS, getRankForPoints, getCompletedRanks, getNextRank } from '../data/ranksData';

export default function RankModal({ isOpen, onClose, points }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'COMPLETED' | 'UPCOMING'

  if (!isOpen) return null;

  const currentRank = getRankForPoints(points);
  const completedRanks = getCompletedRanks(points);
  const nextRank = getNextRank(points);

  const pointsToNext = nextRank ? nextRank.minPoints - points : 0;
  const rankSpan = nextRank ? nextRank.minPoints - currentRank.minPoints : 1000;
  const currentProgress = nextRank ? Math.min(100, Math.max(0, Math.round(((points - currentRank.minPoints) / rankSpan) * 100))) : 100;

  const displayedRanks = LOGIC_RANKS.filter((r) => {
    const isCompleted = points >= r.minPoints;
    if (filter === 'COMPLETED') return isCompleted;
    if (filter === 'UPCOMING') return !isCompleted;
    return true;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-[#141414] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-luxury text-left overflow-hidden flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#2D2D2D]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E1E1E] to-[#0E0E0E] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Prestige Rank Progression
                </span>
                <h3 className="text-xl font-bold font-display text-white">
                  Completed & Active Ranks
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1F1F1F] text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Rank Banner & Progress to Next */}
          <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-[#1A1A1A] via-[#161616] to-[#121212] border border-[#D4AF37]/40 shadow-inner">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-0.5">
                  Current Rank Achieved
                </span>
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-extrabold text-white font-display">
                    Level {currentRank.level}: {currentRank.title}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-mono font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> ACTIVE
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-sans mt-0.5">
                  {currentRank.description}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Total Points</p>
                <p className="text-xl font-black text-[#D4AF37] font-display">{points.toLocaleString()} PTS</p>
                <p className="text-[11px] font-mono text-emerald-400">
                  {completedRanks.length} of {LOGIC_RANKS.length} Ranks Completed
                </p>
              </div>
            </div>

            {/* Next Rank Progress Bar */}
            {nextRank ? (
              <div className="mt-3 pt-3 border-t border-[#262626] space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Next: <strong className="text-white">Level {nextRank.level} ({nextRank.title})</strong>
                  </span>
                  <span className="text-[#D4AF37] font-bold">
                    {pointsToNext.toLocaleString()} PTS needed ({currentProgress}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#0E0E0E] rounded-full overflow-hidden border border-[#2D2D2D]">
                  <div
                    className="h-full bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#F5E6AB] rounded-full shadow-[0_0_10px_#D4AF37]"
                    style={{ width: `${currentProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-2 text-xs font-mono text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Maximum Rank Achieved! You are at the pinnacle of Logic Mastery.
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                filter === 'ALL'
                  ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                  : 'bg-[#1A1A1A] text-gray-400 hover:text-white border border-[#2D2D2D]'
              }`}
            >
              All Ranks ({LOGIC_RANKS.length})
            </button>
            <button
              onClick={() => setFilter('COMPLETED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                filter === 'COMPLETED'
                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-[#1A1A1A] text-gray-400 hover:text-white border border-[#2D2D2D]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed Ranks ({completedRanks.length})
            </button>
            <button
              onClick={() => setFilter('UPCOMING')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                filter === 'UPCOMING'
                  ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'bg-[#1A1A1A] text-gray-400 hover:text-white border border-[#2D2D2D]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> Upcoming ({LOGIC_RANKS.length - completedRanks.length})
            </button>
          </div>

          {/* Scrollable Rank Cards List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {displayedRanks.map((rank) => {
              const isCompleted = points >= rank.minPoints;
              const isCurrent = rank.level === currentRank.level;

              return (
                <div
                  key={rank.level}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-[#1B180D] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                      : isCompleted
                      ? 'bg-[#161916] border-emerald-500/30'
                      : 'bg-[#141414] border-[#262626] opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm shrink-0 border ${
                          isCurrent
                            ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                            : isCompleted
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-[#1F1F1F] border-[#333] text-gray-500'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Lock className="w-4 h-4 text-gray-500" />}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-gray-400 uppercase">
                            Level {rank.level}
                          </span>
                          <h5 className="text-base font-bold text-white font-display">
                            {rank.title}
                          </h5>

                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-mono font-bold flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" /> CURRENT RANK
                            </span>
                          )}

                          {isCompleted && !isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> COMPLETED
                            </span>
                          )}

                          {!isCompleted && (
                            <span className="px-2 py-0.5 rounded-full bg-[#262626] border border-[#333] text-gray-400 text-[10px] font-mono flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Locked ({rank.minPoints - points} pts needed)
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 font-sans mt-1">
                          {rank.description}
                        </p>

                        {/* Unlocked Perk Tag */}
                        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-mono">
                          <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isCompleted ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                          <span className={isCompleted ? 'text-gray-300' : 'text-gray-500'}>
                            <strong className={isCompleted ? 'text-[#D4AF37]' : 'text-gray-500'}>Perk: </strong>
                            {rank.perk}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-gray-400 block">
                        {rank.minPoints}+ PTS
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="mt-4 pt-3 border-t border-[#2D2D2D] flex justify-end">
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
            >
              Close
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
