import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flame, CheckCircle2, XCircle } from 'lucide-react';

export default function ActivityHeatmap({ heatmapData }) {
  const [viewMode, setViewMode] = useState('yearly'); // 'yearly' | 'monthly'
  const [hoveredDay, setHoveredDay] = useState(null);

  const displayData = viewMode === 'monthly' ? heatmapData.slice(-30) : heatmapData;

  const totalActiveDays = heatmapData.filter((d) => d.isActive).length;
  const totalInactiveDays = heatmapData.length - totalActiveDays;

  return (
    <div className="glass-panel rounded-3xl p-6 border border-[#2D2D2D] space-y-4 shadow-luxury">
      
      {/* Top Header & View Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2D2D2D]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-white">Daily Activity Heatmap</h3>
            <p className="text-xs text-gray-400 font-sans">
              Green = Active Solved Submissions • Red = Inactive Days
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Metrics */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> {totalActiveDays} Active
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1 text-rose-400">
              <XCircle className="w-3.5 h-3.5" /> {totalInactiveDays} Rest
            </span>
          </div>

          <div className="flex items-center p-1 bg-[#141414] rounded-xl border border-[#2D2D2D]">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                viewMode === 'monthly'
                  ? 'bg-[#D4AF37] text-black font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setViewMode('yearly')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                viewMode === 'yearly'
                  ? 'bg-[#D4AF37] text-black font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly (52w)
            </button>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="relative pt-2 pb-1 overflow-x-auto">
        <div className="flex gap-1.5 min-w-[720px] justify-start items-center flex-wrap">
          {displayData.map((day, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.35, zIndex: 20 }}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              className={`w-3.5 h-3.5 rounded-sm transition-colors cursor-pointer relative ${
                day.isActive
                  ? day.count >= 2
                    ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
                    : 'bg-emerald-600/90'
                  : 'bg-rose-950/60 border border-rose-900/40 hover:bg-rose-900/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Tooltip Hover Display */}
      <div className="h-6 flex items-center justify-between text-xs font-mono text-gray-400 pt-2 border-t border-[#2D2D2D]/60">
        <div>
          {hoveredDay ? (
            <span className="text-white">
              <strong className={hoveredDay.isActive ? 'text-emerald-400' : 'text-rose-400'}>
                {hoveredDay.date}
              </strong>
              : {hoveredDay.count} logic submissions {hoveredDay.isActive ? '✅ Solved' : '❌ Inactive'}
            </span>
          ) : (
            <span>Hover over tiles to inspect daily submission intensity</span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px]">
          <span>Inactive</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-950/80 border border-rose-900/60" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
          <span>Active</span>
        </div>
      </div>

    </div>
  );
}
