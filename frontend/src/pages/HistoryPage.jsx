import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { PROBLEMS_DATA } from '../data/problemsData';
import ThreeCanvas from '../components/ThreeCanvas';
import SubmissionHistoryModal from '../components/SubmissionHistoryModal';
import { History, CheckCircle2, XCircle, Star, Eye, Calendar, Clock, FileCode, Filter, RefreshCw } from 'lucide-react';

export default function HistoryPage() {
  const { submissions } = useGamification();
  const [selectedSub, setSelectedSub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterProblemId, setFilterProblemId] = useState('ALL');

  const safeSubmissions = Array.isArray(submissions) ? submissions : [];

  const handleInspect = (sub) => {
    setSelectedSub(sub);
    setIsModalOpen(true);
  };

  // Filter submissions by selected problem
  const filteredSubmissions = filterProblemId === 'ALL'
    ? safeSubmissions
    : safeSubmissions.filter((s) => s && s.problemId === filterProblemId);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      <ThreeCanvas />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-luxury">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <History className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                Submission History & Progress Log
              </h1>
              <p className="text-xs text-gray-400 font-sans mt-1">
                Inspect every submission attempt (Attempt #1, #2, #3, #4), review AI explanations, and track your reasoning improvements.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#D4AF37] px-4 py-2 rounded-2xl bg-[#141414] border border-[#2D2D2D] font-bold">
              {safeSubmissions.length} Total Saved Attempts
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-panel rounded-2xl p-4 border border-[#2D2D2D] flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-mono text-gray-300 uppercase font-bold">Filter by Problem:</span>
            <select
              value={filterProblemId}
              onChange={(e) => setFilterProblemId(e.target.value)}
              className="bg-[#141414] text-xs font-mono text-[#D4AF37] font-bold p-2 rounded-xl border border-[#2D2D2D] outline-none cursor-pointer"
            >
              <option value="ALL">All Problems ({safeSubmissions.length} Attempts)</option>
              {PROBLEMS_DATA.map((p) => {
                const count = safeSubmissions.filter((s) => s && s.problemId === p.id).length;
                return (
                  <option key={p.id} value={p.id}>
                    #{p.number} {p.title} ({count} Attempts)
                  </option>
                );
              })}
            </select>
          </div>

          <span className="text-xs font-mono text-gray-400">
            Showing <strong className="text-white">{filteredSubmissions.length}</strong> attempts
          </span>
        </div>

        {/* Multi-Attempt History Table */}
        <div className="glass-panel rounded-3xl border border-[#2D2D2D] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#141414]/90 border-b border-[#2D2D2D] text-[11px] font-mono uppercase tracking-wider text-gray-400">
                  <th className="py-4 px-4">Attempt #</th>
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Problem Title</th>
                  <th className="py-4 px-4">Status & Result</th>
                  <th className="py-4 px-4">Score / Rating</th>
                  <th className="py-4 px-6">Submitted Pseudocode Reasoning</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D2D2D]/60 text-xs font-mono">
                {filteredSubmissions.map((sub, idx) => (
                  <tr key={sub.id || idx} className="hover:bg-[#1A1A1A]/80 transition-colors group">
                    
                    {/* Attempt Number Badge */}
                    <td className="py-4 px-4 font-bold">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] border ${
                        sub.passed
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-extrabold'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}>
                        Attempt #{sub.attemptNumber || (filteredSubmissions.length - idx)}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-gray-400">
                      {sub.timestamp ? new Date(sub.timestamp).toLocaleString() : 'Recent'}
                    </td>

                    <td className="py-4 px-6 font-bold text-white font-display group-hover:text-[#D4AF37]">
                      {sub.problemTitle || 'Logic Challenge'}
                    </td>

                    <td className="py-4 px-4">
                      {sub.passed ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" /> PASSED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 w-max">
                          <XCircle className="w-3 h-3" /> REFINEMENT
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#D4AF37]">{sub.score || 90}%</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= (sub.stars || 5) ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-gray-300 max-w-xs truncate">
                      "{sub.logicText ? sub.logicText.split('\n')[0] : 'Pseudocode submission'}"
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleInspect(sub)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 text-xs font-semibold uppercase tracking-wider transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Attempt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSubmissions.length === 0 && (
              <div className="py-12 text-center text-gray-500 font-mono text-xs">
                No attempt records found for this filter.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Inspection Modal */}
      <SubmissionHistoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submission={selectedSub}
      />
    </div>
  );
}
