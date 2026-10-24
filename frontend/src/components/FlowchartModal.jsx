import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, ArrowDown, Play, X, Sparkles, Copy, Check } from 'lucide-react';

export default function FlowchartModal({ isOpen, onClose, flowData, problemTitle }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedAscii, setCopiedAscii] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !flowData) return null;

  const nodes = flowData.nodes || [];

  // Step-by-step execution simulator
  const handleAutoRun = () => {
    setIsSimulating(true);
    setActiveStep(0);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= nodes.length) {
        clearInterval(interval);
        setIsSimulating(false);
      } else {
        setActiveStep(current);
      }
    }, 850);
  };

  // Generate ASCII Flowchart text representation
  const asciiRepresentation = nodes
    .map((n) => {
      if (n.type === 'START' || n.type === 'END') return `(  ${n.label.toUpperCase()}  )`;
      if (n.type === 'INPUT' || n.type === 'OUTPUT') return `/  ${n.label}  /`;
      if (n.type === 'DECISION') return `<  ${n.label}  >`;
      return `[  ${n.label}  ]`;
    })
    .join('\n         │\n         ▼\n');

  const handleCopyAscii = () => {
    navigator.clipboard.writeText(asciiRepresentation);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  // Standard ISO Flowchart Shapes rendering
  const renderFlowchartNode = (node, index, isActive) => {
    const activeGlow = isActive
      ? 'ring-4 ring-[#D4AF37] shadow-[0_0_35px_rgba(212,175,55,0.8)] scale-105 z-20 font-extrabold'
      : 'opacity-90 hover:opacity-100 hover:scale-[1.02]';

    switch (node.type) {
      // 1. TERMINATOR (Start / End) -> Stadium / Oval Pill Shape
      case 'START':
        return (
          <div
            onClick={() => setActiveStep(index)}
            className={`cursor-pointer px-10 py-3.5 rounded-full border-2 border-emerald-400 bg-emerald-950/70 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider text-center min-w-[240px] max-w-sm transition-all duration-300 shadow-[0_0_20px_rgba(52,211,153,0.3)] ${activeGlow}`}
          >
            ( {node.label} )
          </div>
        );

      case 'END':
        return (
          <div
            onClick={() => setActiveStep(index)}
            className={`cursor-pointer px-10 py-3.5 rounded-full border-2 border-rose-400 bg-rose-950/70 text-rose-300 font-mono text-xs font-bold uppercase tracking-wider text-center min-w-[240px] max-w-sm transition-all duration-300 shadow-[0_0_20px_rgba(244,63,94,0.3)] ${activeGlow}`}
          >
            ( {node.label} )
          </div>
        );

      // 2. INPUT / OUTPUT (Data) -> Parallelogram (Skewed Box)
      case 'INPUT':
      case 'OUTPUT':
        return (
          <div
            onClick={() => setActiveStep(index)}
            className={`cursor-pointer transform -skew-x-12 px-8 py-3.5 border-2 text-center min-w-[250px] max-w-md transition-all duration-300 ${
              node.type === 'INPUT'
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                : 'bg-indigo-950/80 border-indigo-400 text-indigo-200 shadow-[0_0_15px_rgba(129,140,248,0.25)]'
            } ${activeGlow}`}
          >
            {/* Unskew text for perfect readability */}
            <div className="transform skew-x-12 flex items-center justify-center gap-2 font-mono text-xs font-bold">
              <span className="text-[10px] opacity-70">[{node.type}]:</span>
              <span>{node.label}</span>
            </div>
          </div>
        );

      // 3. DECISION (Condition / Loop Check) -> Rhombus / Diamond Badge
      case 'DECISION':
        return (
          <div
            onClick={() => setActiveStep(index)}
            className={`cursor-pointer px-8 py-4 border-2 border-amber-400 bg-amber-950/90 text-amber-200 font-mono text-xs font-bold text-center min-w-[250px] max-w-md rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] ${activeGlow}`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 uppercase font-mono">
                ◆ DECISION
              </span>
              <span>{node.label}</span>
            </div>
          </div>
        );

      // 4. PROCESS / CALCULATION -> Rectangle Box
      default:
        return (
          <div
            onClick={() => setActiveStep(index)}
            className={`cursor-pointer px-8 py-3.5 border-2 border-[#D4AF37] bg-[#1A1810] text-[#F5E6AB] font-mono text-xs font-bold text-center min-w-[250px] max-w-md rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.25)] ${activeGlow}`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] opacity-60">■ PROCESS:</span>
              <span>{node.label}</span>
            </div>
          </div>
        );
    }
  };


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
          className="relative w-full max-w-3xl bg-[#141414] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-luxury text-left overflow-hidden flex flex-col max-h-[90vh] cursor-default"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#2D2D2D]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <GitCommit className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Standard ISO Flowchart Visualizer
                </span>
                <h3 className="text-xl font-bold font-display text-white">
                  Flowchart: {problemTitle || 'Algorithm Execution Path'}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-[#1F1F1F] hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-gray-400 hover:text-rose-400 transition-all cursor-pointer shadow-sm group"
              title="Cancel and close (Esc)"
              aria-label="Cancel and close modal"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          {/* Standard Flowchart Shapes Legend Bar */}
          <div className="my-3 p-3 rounded-2xl bg-[#0E0E0E] border border-[#2D2D2D] flex flex-wrap items-center justify-around gap-3 text-[11px] font-mono text-gray-300 select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-2.5 rounded-full bg-emerald-500/40 border border-emerald-400 inline-block" />
              <strong className="text-emerald-300">Oval:</strong> Start / End
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-2.5 transform -skew-x-12 bg-cyan-500/40 border border-cyan-400 inline-block" />
              <strong className="text-cyan-300">Parallelogram:</strong> Input / Output
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-2.5 bg-[#D4AF37]/40 border border-[#D4AF37] inline-block" />
              <strong className="text-[#D4AF37]">Rectangle:</strong> Process
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rotate-45 bg-amber-500/40 border border-amber-400 inline-block" />
              <strong className="text-amber-300">Diamond:</strong> Decision
            </span>
          </div>

          {/* Flow Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-2xl bg-[#1A1A1A] border border-[#2D2D2D]">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
              <span>Step {activeStep + 1} of {nodes.length}:</span>
              <strong className="text-[#D4AF37] font-bold">
                {nodes[activeStep]?.label || 'Execution Active'}
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoRun}
                disabled={isSimulating}
                className="py-1.5 px-3.5 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isSimulating ? 'Simulating...' : 'Simulate Flow'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyAscii}
                className="py-1.5 px-3 rounded-xl bg-[#222222] border border-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 transition-all"
              >
                {copiedAscii ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAscii ? 'Copied ASCII' : 'Copy ASCII'}</span>
              </button>
            </div>
          </div>

          {/* Interactive ISO Shapes Flowchart Canvas */}
          <div className="flex-1 bg-[#070707] border border-[#2D2D2D] rounded-2xl p-6 overflow-y-auto flex flex-col items-center justify-start space-y-4 font-mono select-none">
            {nodes.map((node, index) => {
              const isActive = activeStep === index;
              return (
                <React.Fragment key={index}>
                  {/* Standard ISO Flowchart Node Shape */}
                  {renderFlowchartNode(node, index, isActive)}

                  {/* Flow Arrow Connector */}
                  {index < nodes.length - 1 && (
                    <div className="flex flex-col items-center my-0.5">
                      <div
                        className={`w-0.5 h-5 transition-colors ${
                          activeStep > index ? 'bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]' : 'bg-gray-700'
                        }`}
                      />
                      <ArrowDown
                        className={`w-4 h-4 -mt-1 transition-colors ${
                          activeStep > index ? 'text-[#D4AF37]' : 'text-gray-600'
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="mt-4 pt-3 border-t border-[#2D2D2D] flex items-center justify-between text-xs font-mono text-gray-400">
            <span>ISO 5807 Standard Algorithm Flowchart Model</span>
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218]"
            >
              Close Visualizer
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
