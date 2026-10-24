import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CheckCircle2, XCircle, Clock, FileCode, Sparkles, BrainCircuit, ShieldCheck } from 'lucide-react';

export default function SubmissionHistoryModal({ isOpen, onClose, submission }) {
  if (!isOpen || !submission) return null;

  const { problemTitle, attemptNumber, timestamp, stars = 5, score = 95, passed, logicText, explainWhy, feedback = [] } = submission;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#141414] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-luxury text-left overflow-hidden space-y-4 max-h-[88vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#2D2D2D] shrink-0">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  passed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {passed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
                    Historical Attempt Inspection
                  </span>
                  {attemptNumber && (
                    <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-mono font-bold border border-[#D4AF37]/30">
                      Attempt #{attemptNumber}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold font-display text-white">{problemTitle}</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1F1F1F] text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Submission Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#161616] border border-[#2D2D2D] shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>Timestamp: {new Date(timestamp).toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {passed ? 'PASSED' : 'REFINEMENT REQUIRED'}
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= (stars || 5) ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-700'
                    }`}
                  />
                ))}
                <span className="text-xs font-mono font-bold text-[#D4AF37] ml-1">
                  ({score}%)
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Details */}
          <div className="overflow-y-auto pr-1 space-y-4 flex-1">
            
            {/* Submitted Logic Pseudocode Block */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-[#D4AF37]" /> Submitted Reasoning Pseudocode:
              </h4>
              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#2D2D2D] text-xs font-mono text-gray-200 overflow-y-auto max-h-40">
                <pre className="whitespace-pre-wrap leading-relaxed">{logicText}</pre>
              </div>
            </div>

            {/* AI Explain Why Section if present */}
            {explainWhy && (
              <div className="p-4 rounded-2xl bg-[#181510] border border-amber-500/40 text-xs font-sans space-y-2">
                <div className="flex items-center gap-1.5 text-[#D4AF37] font-mono font-bold uppercase tracking-wider text-[11px]">
                  <BrainCircuit className="w-4 h-4 text-[#D4AF37]" />
                  <span>AI Diagnostic Explanation (Attempt #{attemptNumber || 1}):</span>
                </div>
                <div className="space-y-1.5 text-gray-200">
                  <p><strong className="text-amber-400 font-mono text-[10px] uppercase">Skipped:</strong> {explainWhy.missing}</p>
                  <p><strong className="text-amber-400 font-mono text-[10px] uppercase">Failure Cause:</strong> {explainWhy.impact}</p>
                  <p><strong className="text-emerald-400 font-mono text-[10px] uppercase">Guidance:</strong> {explainWhy.guidance}</p>
                </div>
              </div>
            )}

            {/* AI Step Breakdown */}
            {feedback && feedback.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#2D2D2D]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400">
                  AI Evaluation Step Breakdown:
                </h4>
                <div className="space-y-1.5">
                  {feedback.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#101010] border border-white/5 text-xs font-mono flex items-start gap-2 text-gray-300"
                    >
                      <span className="text-[#D4AF37] font-bold">[{item.step}]:</span>
                      <span>{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-[#2D2D2D] flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218]"
            >
              Close Attempt Record
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
