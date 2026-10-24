import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, CheckCircle, BarChart3, PieChart, Zap } from 'lucide-react';

export default function AnalyticsCharts({ accuracy, difficultyProgress }) {
  const weeklyActivity = [
    { day: 'Mon', count: 3, points: 150 },
    { day: 'Tue', count: 5, points: 250 },
    { day: 'Wed', count: 4, points: 200 },
    { day: 'Thu', count: 6, points: 300 },
    { day: 'Fri', count: 2, points: 100 },
    { day: 'Sat', count: 7, points: 350 },
    { day: 'Sun', count: 5, points: 250 },
  ];

  const maxWeeklyPoints = 400;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Chart 1: Logic Accuracy & Difficulty Breakdown */}
      <div className="glass-panel rounded-3xl p-6 border border-[#2D2D2D] space-y-6 shadow-luxury">
        <div className="flex items-center justify-between pb-4 border-b border-[#2D2D2D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">Logic Evaluation Accuracy</h3>
              <p className="text-xs text-gray-400 font-sans">Pass rate on first submission attempt</p>
            </div>
          </div>
          <span className="text-2xl font-extrabold font-display text-[#D4AF37]">{accuracy}%</span>
        </div>

        {/* Difficulty Completion Bars */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400">
            Completion Rate by Difficulty:
          </h4>

          {/* Easy */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-emerald-400 font-semibold">Easy Problems</span>
              <span className="text-white">{difficultyProgress.easy.solved}/{difficultyProgress.easy.total} ({difficultyProgress.easy.percent}%)</span>
            </div>
            <div className="w-full h-2 bg-[#141414] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-[0_0_8px_#10B981]"
                style={{ width: `${difficultyProgress.easy.percent}%` }}
              />
            </div>
          </div>

          {/* Intermediate */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#D4AF37] font-semibold">Intermediate Problems</span>
              <span className="text-white">{difficultyProgress.intermediate.solved}/{difficultyProgress.intermediate.total} ({difficultyProgress.intermediate.percent}%)</span>
            </div>
            <div className="w-full h-2 bg-[#141414] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-[#D4AF37] rounded-full transition-all duration-500 shadow-[0_0_8px_#D4AF37]"
                style={{ width: `${difficultyProgress.intermediate.percent}%` }}
              />
            </div>
          </div>

          {/* Hard */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-rose-400 font-semibold">Hard Problems</span>
              <span className="text-white">{difficultyProgress.hard.solved}/{difficultyProgress.hard.total} ({difficultyProgress.hard.percent}%)</span>
            </div>
            <div className="w-full h-2 bg-[#141414] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500 shadow-[0_0_8px_#F43F5E]"
                style={{ width: `${difficultyProgress.hard.percent}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Chart 2: Weekly Progress & Points Growth */}
      <div className="glass-panel rounded-3xl p-6 border border-[#2D2D2D] space-y-6 shadow-luxury">
        <div className="flex items-center justify-between pb-4 border-b border-[#2D2D2D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">Weekly Solved Submissions</h3>
              <p className="text-xs text-gray-400 font-sans">Points accumulated per day</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +1,600 PTS
          </span>
        </div>

        {/* Weekly Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-44 pt-4 px-2">
          {weeklyActivity.map((item, idx) => {
            const heightPercent = Math.round((item.points / maxWeeklyPoints) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-mono text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
                  +{item.points}
                </div>
                <div className="w-full bg-[#181818] rounded-xl overflow-hidden flex flex-col justify-end h-full p-1 border border-white/5">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="w-full bg-gradient-to-t from-[#AA7C11] via-[#D4AF37] to-[#F5E6AB] rounded-lg shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                  />
                </div>
                <span className="text-xs font-mono text-gray-400 group-hover:text-white transition-colors">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
