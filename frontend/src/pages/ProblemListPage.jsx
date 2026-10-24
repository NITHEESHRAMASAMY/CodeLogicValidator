import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLogic } from '../context/LogicContext';
import { PROBLEMS_DATA } from '../data/problemsData';
import ThreeCanvas from '../components/ThreeCanvas';
import RankModal from '../components/RankModal';
import StreakModal from '../components/StreakModal';
import ProblemRequestModal from '../components/ProblemRequestModal';
import API from '../services/api';
import {
  Search,
  CheckCircle2,
  Circle,
  Flame,
  Zap,
  Award,
  BookOpen,
  Filter,
  Sparkles,
  ArrowRight,
  Code2,
  Mail,
  ShieldAlert
} from 'lucide-react';

export default function ProblemListPage() {
  const {
    streak,
    lastSolvedDate,
    points,
    badge,
    currentRank,
    completedProblems
  } = useLogic();
  const { isAdmin } = useAuth();

  const [allProblems, setAllProblems] = useState(() => {
    const custom = localStorage.getItem('clv_custom_problems');
    if (custom) {
      try {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return PROBLEMS_DATA;
  });

  useEffect(() => {
    const fetchBackendProblems = async () => {
      try {
        const res = await API.get('/problems');
        if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setAllProblems(res.data.data);
        }
      } catch (err) {
        console.warn('Backend problems fetch offline, using fallback list');
      }
    };
    fetchBackendProblems();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showRankModal, setShowRankModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showProblemRequestModal, setShowProblemRequestModal] = useState(false);

  // Filter problems by search query and difficulty
  const filteredProblems = useMemo(() => {
    return allProblems.filter((problem) => {
      const matchesDifficulty =
        selectedDifficulty === 'All' || problem.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        problem.title.toLowerCase().includes(query) ||
        problem.number.toString().includes(query) ||
        problem.category.toLowerCase().includes(query) ||
        problem.tags.some((t) => t.toLowerCase().includes(query));

      return matchesDifficulty && matchesSearch;
    });
  }, [allProblems, searchQuery, selectedDifficulty]);

  const totalProblems = allProblems.length;
  const solvedCount = completedProblems.length;
  const progressPercent = Math.round((solvedCount / totalProblems) * 100);

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-[#D4AF37]/15 text-[#F5E6AB] border-[#D4AF37]/40';
      case 'Hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      <ThreeCanvas />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* User Stats & Streaks Luxury Header */}
        <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 shadow-luxury">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* User Badge / Current Rank Card */}
            <div
              onClick={() => setShowRankModal(true)}
              className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-[#2D2D2D] pb-4 md:pb-0 pr-0 md:pr-4 cursor-pointer group hover:bg-white/[0.03] p-2 rounded-2xl transition-all"
              title="Click to view all completed ranks & progression"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E1E1E] to-[#0E0E0E] border border-[#D4AF37]/50 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)] group-hover:scale-105 group-hover:border-[#D4AF37] transition-all">
                <Award className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-gray-400">Current Rank</p>
                <h3 className="text-lg font-bold text-white font-display leading-tight group-hover:text-[#D4AF37] transition-colors">{badge}</h3>
                <span className="text-[11px] text-[#D4AF37] font-mono flex items-center gap-1">
                  Level {currentRank?.level || 4} • View All Ranks →
                </span>
              </div>
            </div>

            {/* Daily Streak Card */}
            <div
              onClick={() => setShowStreakModal(true)}
              className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-[#2D2D2D] pb-4 md:pb-0 pr-0 md:pr-4 cursor-pointer group hover:bg-white/[0.03] p-2 rounded-2xl transition-all"
              title="Click to view current daily streak"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-950/40 to-amber-950/20 border border-orange-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.25)] group-hover:scale-105 group-hover:border-orange-500 transition-all">
                <Flame className={`w-7 h-7 text-orange-400 ${streak > 0 ? 'animate-pulse' : 'opacity-60'}`} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-gray-400">Daily Streak</p>
                <h3 className="text-xl font-extrabold text-white font-display leading-tight">{streak} {streak === 1 ? 'Day' : 'Days'}</h3>
                <span className="text-[11px] text-orange-400 font-mono flex items-center gap-1">
                  {streak > 0 ? '🔥 Active Streak' : '⚡ Broken (0 Days)'} • View Streak →
                </span>
              </div>
            </div>

            {/* Total Points */}
            <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-[#2D2D2D] pb-4 md:pb-0 pr-0 md:pr-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-yellow-950/20 border border-[#D4AF37]/40 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                <Zap className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-gray-400">Accumulated Points</p>
                <h3 className="text-xl font-extrabold text-white font-display leading-tight">{points.toLocaleString()} PTS</h3>
                <span className="text-[11px] text-[#D4AF37] font-mono">+150 PTS today</span>
              </div>
            </div>

            {/* Solved Problems Progress */}
            <div className="flex flex-col justify-center space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-400">Logic Mastery Progress</span>
                <span className="text-white font-bold">{solvedCount}/{totalProblems} ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2 bg-[#141414] rounded-full overflow-hidden border border-[#2D2D2D]">
                <div
                  className="h-full bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#F5E6AB] shadow-[0_0_12px_#D4AF37]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Global Search Bar & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Input Box */}
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <input
              type="text"
              placeholder="Search by title, #101, tag, or difficulty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414]/90 text-white text-sm rounded-xl py-3 pl-10 pr-4 border border-[#2D2D2D] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none shadow-inner placeholder:text-gray-500"
            />
          </div>

          {/* Difficulty Filter Tabs & Request Problem Button */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 p-1 bg-[#141414] rounded-xl border border-[#2D2D2D]">
              {['All', 'Easy', 'Intermediate', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold font-display transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] text-black shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Admin Questions Manager - Only clickable by Admin account */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-[#D4AF37] text-xs font-mono font-bold text-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.35)] transition-all cursor-pointer"
                title="Admin Management Portal: Upload and synchronize questions"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Admin: Upload Questions</span>
              </Link>
            )}

            <button
              onClick={() => setShowProblemRequestModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#D4AF37]/40 text-xs font-mono text-[#D4AF37] hover:border-[#D4AF37] transition-all shadow-sm"
              title="Mail a problem proposal and test cases to Admin (nitheesh25bls@gmail.com)"
            >
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Request Problem</span>
            </button>
          </div>

        </div>

        {/* Problem Bank Table */}
        <div className="glass-panel rounded-3xl border border-[#2D2D2D] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#141414]/90 border-b border-[#2D2D2D] text-[11px] font-mono uppercase tracking-wider text-gray-400">
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-4">#</th>
                  <th className="py-4 px-6">Problem Title</th>
                  <th className="py-4 px-4">Difficulty</th>
                  <th className="py-4 px-6">Category & Tags</th>
                  <th className="py-4 px-4">Acceptance</th>
                  <th className="py-4 px-4">Reward</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D2D2D]/60 text-xs">
                {filteredProblems.map((problem) => {
                  const isSolved = completedProblems.includes(problem.id);
                  return (
                    <tr
                      key={problem.id}
                      className="hover:bg-[#1A1A1A]/80 transition-colors group"
                    >
                      {/* Solved Status */}
                      <td className="py-4 px-6">
                        {isSolved ? (
                          <div className="flex items-center gap-1.5 text-emerald-400" title="Completed">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-gray-600" title="Unsolved">
                            <Circle className="w-4 h-4 stroke-[1.5]" />
                          </div>
                        )}
                      </td>

                      {/* Problem Number */}
                      <td className="py-4 px-4 font-mono font-semibold text-gray-400 group-hover:text-[#D4AF37]">
                        #{problem.number}
                      </td>

                      {/* Title */}
                      <td className="py-4 px-6">
                        <Link
                          to={`/problem/${problem.id}`}
                          className="font-bold text-white group-hover:text-[#D4AF37] font-display transition-colors text-sm"
                        >
                          {problem.title}
                        </Link>
                      </td>

                      {/* Difficulty Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono border font-semibold ${getDifficultyBadge(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>

                      {/* Tags */}
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1.5">
                          {problem.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-[#181818] border border-white/5 text-[10px] text-gray-300 font-mono"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Acceptance Rate */}
                      <td className="py-4 px-4 font-mono text-gray-400">
                        {problem.acceptanceRate}
                      </td>

                      {/* Points */}
                      <td className="py-4 px-4 font-mono font-semibold text-[#D4AF37]">
                        +{problem.points} PTS
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/problem/${problem.id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-semibold uppercase tracking-wider font-display transition-all duration-200"
                        >
                          <span>Solve</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredProblems.length === 0 && (
              <div className="py-12 text-center text-gray-400 space-y-3">
                <BookOpen className="w-8 h-8 text-[#D4AF37] mx-auto" />
                <p className="text-sm font-sans">No logic problems match your search criteria.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Rank Progression & Completed Ranks Modal */}
      <RankModal
        isOpen={showRankModal}
        onClose={() => setShowRankModal(false)}
        points={points}
      />

      {/* Daily Streak Details Modal */}
      <StreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        streak={streak}
        lastSolvedDate={lastSolvedDate}
      />

      {/* Problem Request Modal */}
      <ProblemRequestModal
        isOpen={showProblemRequestModal}
        onClose={() => setShowProblemRequestModal(false)}
      />
    </div>
  );
}
