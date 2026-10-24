import React from 'react';
import { useLogic } from '../context/LogicContext';
import { useGamification } from '../context/GamificationContext';
import ThreeCanvas from '../components/ThreeCanvas';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { BarChart3, TrendingUp, Target, Award, Sparkles, ShieldCheck } from 'lucide-react';

export default function AnalyticsPage() {
  const { streak, points, badge } = useLogic();
  const { accuracy, difficultyProgress } = useGamification();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      <ThreeCanvas />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-luxury">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-mono uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" /> Performance Analytics
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                Learning Analytics Dashboard
              </h1>
              <p className="text-xs text-gray-400 font-sans">
                Real-time metrics on reasoning accuracy, weekly growth, and difficulty distribution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] uppercase font-mono tracking-widest text-gray-400">Consistency Index</p>
              <p className="text-xl font-extrabold font-display text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> 98.4% Optimal
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Interactive Charts */}
        <AnalyticsCharts accuracy={accuracy} difficultyProgress={difficultyProgress} />

      </div>
    </div>
  );
}
