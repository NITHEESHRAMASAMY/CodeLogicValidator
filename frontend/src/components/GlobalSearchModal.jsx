import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { PROBLEMS_DATA } from '../data/problemsData';
import { Search, X, BookOpen, CheckCircle2, ArrowRight, Tag, Command } from 'lucide-react';

export default function GlobalSearchModal() {
  const { isSearchOpen, setIsSearchOpen, submissions } = useGamification();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const searchQuery = query.toLowerCase().trim();

  // Search results matching problems
  const matchedProblems = PROBLEMS_DATA.filter((p) => {
    if (!searchQuery) return true;
    return (
      p.title.toLowerCase().includes(searchQuery) ||
      p.number.toString().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery))
    );
  }).slice(0, 5);

  // Search results matching submission history
  const matchedSubmissions = submissions.filter((s) => {
    if (!searchQuery) return false;
    return (
      s.problemTitle.toLowerCase().includes(searchQuery) ||
      s.logicText.toLowerCase().includes(searchQuery)
    );
  }).slice(0, 3);

  const handleSelectProblem = (probId) => {
    setIsSearchOpen(false);
    navigate(`/problem/${probId}`);
  };

  return (
    <AnimatePresence>
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md cursor-pointer"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-2xl bg-[#141414] border border-[#D4AF37]/50 rounded-3xl p-6 shadow-luxury text-left overflow-hidden space-y-4 cursor-default"
        >
          {/* Top Search Input Bar */}
          <div className="relative flex items-center border-b border-[#2D2D2D] pb-3">
            <Search className="w-5 h-5 text-[#D4AF37] shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              placeholder="Search problems, tags, categories, or submissions... (Ctrl+K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-white text-base outline-none font-sans placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSearchOpen(false);
              }}
              className="p-2 rounded-xl bg-[#222222] hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/40 transition-all cursor-pointer group"
              title="Cancel and close (Esc)"
              aria-label="Cancel and close search"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          {/* Results Container */}
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
            
            {/* Matching Problems */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Logic Problems ({matchedProblems.length})
              </span>
              <div className="space-y-1.5">
                {matchedProblems.map((prob) => (
                  <div
                    key={prob.id}
                    onClick={() => handleSelectProblem(prob.id)}
                    className="p-3 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-[#2D2D2D] hover:border-[#D4AF37]/50 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#D4AF37] font-bold">#{prob.number}</span>
                      <span className="text-sm font-semibold text-white group-hover:text-[#D4AF37] font-display">
                        {prob.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#121212] text-[10px] font-mono text-gray-400">
                        {prob.difficulty}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matching Submissions */}
            {matchedSubmissions.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#2D2D2D]">
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Historical Submissions ({matchedSubmissions.length})
                </span>
                <div className="space-y-1.5">
                  {matchedSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => handleSelectProblem(sub.problemId)}
                      className="p-3 rounded-xl bg-[#121814] hover:bg-[#18221B] border border-emerald-500/30 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div>
                        <p className="text-xs font-bold text-white font-display">{sub.problemTitle}</p>
                        <p className="text-[11px] font-mono text-emerald-400/90 truncate max-w-md">
                          "{sub.logicText.split('\n')[0]}"
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">
                        {new Date(sub.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {matchedProblems.length === 0 && matchedSubmissions.length === 0 && (
              <div className="py-8 text-center text-gray-500 font-mono text-xs">
                No matching logic problems or submissions found.
              </div>
            )}

          </div>

          {/* Footer Shortcut Tip */}
          <div className="pt-3 border-t border-[#2D2D2D] flex items-center justify-between text-[11px] font-mono text-gray-500">
            <span>Press <kbd className="px-1.5 py-0.5 bg-[#222] rounded border border-white/10 text-gray-300">Esc</kbd> to close</span>
            <span className="flex items-center gap-1">
              <Command className="w-3 h-3 text-[#D4AF37]" /> Global Search Active
            </span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
