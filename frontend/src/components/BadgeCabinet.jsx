import React from 'react';
import { motion } from 'framer-motion';
import { PRESTIGE_BADGES } from '../data/badgesData';
import { Lock, Sparkles, Award } from 'lucide-react';

export default function BadgeCabinet({ userStreak = 5 }) {
  return (
    <div className="glass-panel rounded-3xl p-6 border border-[#2D2D2D] space-y-6 shadow-luxury">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2D2D2D]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-white">Prestige Badge Cabinet</h3>
            <p className="text-xs text-gray-400 font-sans">
              9-Tier Achievement System • Unlocked by consecutive daily activity streak
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono">
          Current Streak: <strong>{userStreak} Days</strong>
        </div>
      </div>

      {/* Badges Grid (9 Badges) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {PRESTIGE_BADGES.map((badge) => {
          const isUnlocked = userStreak >= badge.requiredDays;
          const daysRemaining = Math.max(0, badge.requiredDays - userStreak);
          const progressPercent = Math.min(100, Math.round((userStreak / badge.requiredDays) * 100));

          return (
            <motion.div
              key={badge.id}
              whileHover={{ y: -4 }}
              className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-gradient-to-b from-[#1C1A14] to-[#121212] border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                  : 'bg-[#141414] border-[#2D2D2D] opacity-60 grayscale'
              }`}
            >
              {/* Badge Icon & Tier Badge */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-[#2E2814] to-[#141414] border border-[#D4AF37] text-[#D4AF37]'
                      : 'bg-[#1E1E1E] border border-white/5 text-gray-500'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex items-center gap-1">
                  {isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400 text-[10px] font-mono flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-4 space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold font-display ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                    {badge.name}
                  </h4>
                  <span className="text-[10px] font-mono text-[#D4AF37]">{badge.requiredDays} Days</span>
                </div>
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Progress Bar for Locked Badges */}
              {!isUnlocked && (
                <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                    <span>Progress: {progressPercent}%</span>
                    <span>{daysRemaining} days left</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D4AF37] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
