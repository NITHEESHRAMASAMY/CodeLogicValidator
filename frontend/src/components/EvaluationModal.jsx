import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, AlertTriangle, Lightbulb, Code2, GitCommit, ArrowRight, X, Sparkles, BrainCircuit, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EvaluationModal({ isOpen, onClose, result, onGenerateCodeClick, onGenerateFlowClick }) {
  if (!isOpen || !result) return null;

  const { passed, stars = 5, score = 90, summary, explainWhy, feedback = [], hints = [] } = result;

  if (passed) {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#141414] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-luxury text-left overflow-hidden flex flex-col max-h-[90vh] cursor-default"
        >
          {/* Top Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-5 right-5 p-2.5 rounded-xl bg-[#1F1F1F] hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-gray-400 hover:text-rose-400 transition-all cursor-pointer z-30 shadow-sm group"
            title="Cancel and close (Esc)"
            aria-label="Cancel and close modal"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {/* Header Banner */}
          <div className="flex items-center gap-4 pb-6 border-b border-[#2D2D2D] shrink-0">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${
                passed
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-400'
                  : 'bg-amber-950/50 border-amber-500/50 text-amber-400'
              }`}
            >
              {passed ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {passed ? 'VALIDATED SUCCESSFULLY' : 'REASONING REFINEMENT REQUIRED'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                {passed ? 'Logic Approved!' : 'Logic Feedback & Analysis'}
              </h3>
            </div>
          </div>

          {/* Scrollable Body Content */}
          <div className="overflow-y-auto pr-1 my-4 space-y-4 flex-1">
            
            {/* Star Rating & Score */}
            {passed && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37]/15 to-transparent border border-[#D4AF37]/30 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-mono tracking-widest text-gray-400">Quality Rating</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= stars ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase font-mono tracking-widest text-gray-400">Score</p>
                  <p className="text-2xl font-extrabold text-[#D4AF37] font-display">{score}%</p>
                </div>
              </div>
            )}

            {/* Summary Text */}
            <p className="text-sm text-gray-200 font-sans leading-relaxed">
              {summary}
            </p>

            {/* AI Explain Why Section (Diagnostic Cause & Effect) */}
            {explainWhy && (
              <div className="p-4 rounded-2xl bg-[#181510] border border-amber-500/40 text-xs font-sans space-y-2.5 shadow-md">
                <div className="flex items-center justify-between text-[#D4AF37] font-mono font-bold uppercase tracking-wider text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-[#D4AF37]" />
                    AI Explain Why (Diagnostic Reasoning):
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Socratic Feedback
                  </span>
                </div>

                <div className="space-y-2 text-gray-300 font-sans text-xs">
                  <div className="p-2.5 rounded-xl bg-[#12100C] border border-amber-500/20">
                    <span className="text-amber-400 font-bold font-mono uppercase text-[10px] block mb-0.5">
                      ❌ What Was Skipped:
                    </span>
                    <p className="text-gray-200">{explainWhy.missing || 'Key intermediate steps were omitted.'}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#12100C] border border-amber-500/20">
                    <span className="text-amber-400 font-bold font-mono uppercase text-[10px] block mb-0.5">
                      ⚠️ Why This Causes Failure:
                    </span>
                    <p className="text-gray-200">{explainWhy.impact || 'Without intermediate storage, outputs cannot reference the calculation.'}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#12100C] border border-amber-500/20">
                    <span className="text-emerald-400 font-bold font-mono uppercase text-[10px] block mb-0.5">
                      💡 Pedagogical Guidance:
                    </span>
                    <p className="text-gray-200">{explainWhy.guidance || 'Add an explicit step declaring the result variable before printing.'}</p>
                  </div>
                </div>

                <p className="text-[10px] font-mono text-gray-400 italic pt-1 border-t border-amber-500/20">
                  🔒 Educational Policy: Still no complete solution code revealed. Refine your reasoning steps and submit again!
                </p>
              </div>
            )}

            {/* Step-by-Step Breakdown */}
            {feedback.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400">
                  Step-by-Step Logic Breakdown:
                </h4>
                <div className="space-y-2">
                  {feedback.map((item, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-3 ${
                        item.status === 'PASS'
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                          : item.status === 'WARN'
                          ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                          : 'bg-red-950/30 border-red-500/30 text-red-300'
                      }`}
                    >
                      <span className="font-bold shrink-0">[{item.step}]:</span>
                      <span>{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hints Section */}
            {hints.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#1C1A14] border border-[#D4AF37]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] font-mono">
                  <Lightbulb className="w-4 h-4" />
                  <span>Targeted Hints (Think & Refine):</span>
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-300 font-sans">
                  {hints.map((hint, idx) => (
                    <li key={idx}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#2D2D2D] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-[#1F1F1F] hover:bg-[#2A2A2A] text-gray-300 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              {passed ? 'Close Window' : 'Refine Logic'}
            </button>

            {passed && (
              <div className="flex items-center gap-2">
                {/* Logic Flow Button */}
                <button
                  onClick={() => {
                    onClose();
                    onGenerateFlowClick && onGenerateFlowClick();
                  }}
                  className="py-3 px-5 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-[#D4AF37] bg-gradient-to-r from-[#1E1E1E] to-[#121212] border border-[#D4AF37]/50 hover:border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all flex items-center gap-2"
                >
                  <GitCommit className="w-4 h-4 text-[#D4AF37]" />
                  <span>Logic Flow</span>
                </button>

                {/* Generate Code Button */}
                <button
                  onClick={() => {
                    onClose();
                    onGenerateCodeClick && onGenerateCodeClick();
                  }}
                  className="py-3 px-5 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Generate Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
