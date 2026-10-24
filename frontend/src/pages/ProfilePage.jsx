import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLogic } from '../context/LogicContext';
import { useGamification } from '../context/GamificationContext';
import ThreeCanvas from '../components/ThreeCanvas';
import ActivityHeatmap from '../components/ActivityHeatmap';
import BadgeCabinet from '../components/BadgeCabinet';
import RankModal from '../components/RankModal';
import {
  User,
  Plus,
  Mail,
  Award,
  Flame,
  Zap,
  Target,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateAvatar } = useAuth();
  const { streak, points, badge, completedProblems } = useLogic();
  const { heatmapData, accuracy, difficultyProgress } = useGamification();
  const [showRankModal, setShowRankModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        updateAvatar(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      <ThreeCanvas />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* User Profile Header Card */}
        <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-luxury">
          
          <div className="flex items-center gap-6">
            {/* Avatar Container with Person Icon & + Browse Button */}
            <div className="relative group">
              {user?.avatarUrl && !user.avatarUrl.includes('ui-avatars.com') && !user.avatarUrl.includes('images.unsplash.com') ? (
                <img
                  src={user.avatarUrl}
                  alt="Profile Avatar"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-2 border-[#D4AF37] object-cover shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#1d1b14] via-[#141414] to-[#0a0a0a] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.35)]">
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4AF37]" />
                </div>
              )}

              {/* + Icon at the right bottom to browse the image from the system */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F5E6AB] text-black font-extrabold flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.7)] hover:scale-115 active:scale-95 transition-all cursor-pointer border-2 border-[#0e0e0e]"
                title="Browse and upload image from your computer"
                aria-label="Upload profile image"
              >
                <Plus className="w-4 h-4 text-black stroke-[3]" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRankModal(true)}
                  className="px-3 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/25 hover:border-[#D4AF37] text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                  title="Click to view all completed ranks & progression"
                >
                  <Sparkles className="w-3 h-3" /> {badge} • View Ranks →
                </button>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                  VERIFIED LOGICIAN
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                {user?.fullName || 'Alexander Wright'}
              </h1>
              <p className="text-xs text-gray-400 font-mono flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                {user?.email || 'developer@clv.io'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-4 border-t md:border-t-0 md:border-l border-[#2D2D2D] pt-4 md:pt-0 pl-0 md:pl-6 w-full md:w-auto justify-between md:justify-start">
            <div className="text-left">
              <p className="text-[10px] uppercase font-mono tracking-widest text-gray-400">Total Solved</p>
              <p className="text-2xl font-extrabold text-white font-display">{completedProblems.length}</p>
            </div>

            <div className="text-left">
              <p className="text-[10px] uppercase font-mono tracking-widest text-gray-400">Accuracy</p>
              <p className="text-2xl font-extrabold text-[#D4AF37] font-display">{accuracy}%</p>
            </div>

            <div className="text-left">
              <p className="text-[10px] uppercase font-mono tracking-widest text-gray-400">Points</p>
              <p className="text-2xl font-extrabold text-white font-display">{points.toLocaleString()} PTS</p>
            </div>
          </div>

        </div>

        {/* Difficulty Breakdown & Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Easy Progress Card */}
          <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 font-mono">EASY PROBLEMS</span>
              <span className="text-xs font-mono text-white font-bold">{difficultyProgress.easy.solved}/{difficultyProgress.easy.total}</span>
            </div>
            <div className="w-full h-2 bg-[#121212] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${difficultyProgress.easy.percent}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400 font-mono text-right">{difficultyProgress.easy.percent}% Mastery</p>
          </div>

          {/* Intermediate Progress Card */}
          <div className="glass-panel rounded-2xl p-5 border border-[#D4AF37]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D4AF37] font-mono">INTERMEDIATE PROBLEMS</span>
              <span className="text-xs font-mono text-white font-bold">{difficultyProgress.intermediate.solved}/{difficultyProgress.intermediate.total}</span>
            </div>
            <div className="w-full h-2 bg-[#121212] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
                style={{ width: `${difficultyProgress.intermediate.percent}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400 font-mono text-right">{difficultyProgress.intermediate.percent}% Mastery</p>
          </div>

          {/* Hard Progress Card */}
          <div className="glass-panel rounded-2xl p-5 border border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 font-mono">HARD PROBLEMS</span>
              <span className="text-xs font-mono text-white font-bold">{difficultyProgress.hard.solved}/{difficultyProgress.hard.total}</span>
            </div>
            <div className="w-full h-2 bg-[#121212] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${difficultyProgress.hard.percent}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400 font-mono text-right">{difficultyProgress.hard.percent}% Mastery</p>
          </div>

        </div>

        {/* GitHub-Style Daily Activity Heatmap */}
        <ActivityHeatmap heatmapData={heatmapData} />

        {/* 9-Tier Prestige Badge Cabinet */}
        <BadgeCabinet userStreak={streak} />

      </div>

      {/* Rank Progression & Completed Ranks Modal */}
      <RankModal
        isOpen={showRankModal}
        onClose={() => setShowRankModal(false)}
        points={points}
      />
    </div>
  );
}
