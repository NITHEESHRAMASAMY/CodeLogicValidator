import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLogic } from '../context/LogicContext';
import { useGamification } from '../context/GamificationContext';
import { PROBLEMS_DATA, SUPPORTED_LANGUAGES } from '../data/problemsData';
import LogicEditor from '../components/LogicEditor';
import EvaluationModal from '../components/EvaluationModal';
import CodeViewer from '../components/CodeViewer';
import FlowchartModal from '../components/FlowchartModal';
import ThreeCanvas from '../components/ThreeCanvas';
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Play,
  Send,
  Code2,
  GitCommit,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  Globe
} from 'lucide-react';

export default function ProblemDetailPage() {
  const { id } = useParams();
  const { completedProblems, selectedLanguage, setSelectedLanguage, evaluateLogic, generateCode, generateFlowchart } = useLogic();
  const { submissions, recordSubmission } = useGamification();

  const problem = PROBLEMS_DATA.find((p) => p.id === id) || PROBLEMS_DATA[0];
  const isSolved = completedProblems.includes(problem.id);

  const [logicText, setLogicText] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [showEvalModal, setShowEvalModal] = useState(false);
  
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [codeResult, setCodeResult] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const [isGeneratingFlow, setIsGeneratingFlow] = useState(false);
  const [flowResult, setFlowResult] = useState(null);
  const [showFlowModal, setShowFlowModal] = useState(false);

  const [isLogicValidated, setIsLogicValidated] = useState(isSolved);

  const handleEvaluate = async () => {
    if (!logicText.trim()) return;
    setIsEvaluating(true);
    const result = await evaluateLogic(problem.id, logicText);
    setIsEvaluating(false);

    setEvalResult(result);
    setShowEvalModal(true);

    if (result.passed) {
      setIsLogicValidated(true);
    }

    // Count previous attempts for this specific problem to assign Attempt #
    const prevAttempts = submissions.filter((s) => s.problemId === problem.id).length;
    const attemptNumber = prevAttempts + 1;

    // Record EVERY attempt (Attempt #1, Attempt #2, Attempt #3, Attempt #4) in history!
    recordSubmission({
      problemId: problem.id,
      problemTitle: problem.title,
      attemptNumber: attemptNumber,
      logicText: logicText,
      passed: result.passed,
      stars: result.stars,
      score: result.score,
      summary: result.summary,
      explainWhy: result.explainWhy,
      feedback: result.feedback || [],
      hints: result.hints || []
    });
  };

  const handleGenerateCode = async () => {
    setIsGeneratingCode(true);
    const result = await generateCode(problem.id, logicText, selectedLanguage);
    setIsGeneratingCode(false);

    setCodeResult(result);
    setShowCodeModal(true);
  };

  const handleGenerateFlow = async () => {
    setIsGeneratingFlow(true);
    const result = await generateFlowchart(problem.id, logicText);
    setIsGeneratingFlow(false);

    setFlowResult(result);
    setShowFlowModal(true);
  };

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
    <div className="relative min-h-[calc(100vh-4rem)] p-3 sm:p-6">
      <ThreeCanvas />

      <div className="relative z-10 max-w-7xl mx-auto space-y-4">
        
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 glass-panel rounded-2xl px-5 py-3 border border-[#2D2D2D]">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl bg-[#181818] hover:bg-[#252525] border border-[#2D2D2D] text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#D4AF37]">#{problem.number}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border font-semibold ${getDifficultyBadge(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                {isSolved && (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Solved
                  </span>
                )}
              </div>
              <h1 className="text-lg font-bold font-display text-white">{problem.title}</h1>
            </div>
          </div>

          {/* Language Preference Display Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#141414] px-3 py-1.5 rounded-xl border border-[#2D2D2D]">
              <Globe className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-mono text-gray-400">Target Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-xs font-mono text-[#D4AF37] font-bold outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-[#141414] text-white">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Workspace Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Problem Specifications (5/12) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-[#2D2D2D] space-y-5 max-h-[78vh] overflow-y-auto pr-3">
              
              {/* Problem Description */}
              <div>
                <h3 className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] mb-2">
                  Problem Specification
                </h3>
                <div className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans space-y-2">
                  <p>{problem.description}</p>
                </div>
              </div>

              {/* Input / Output Formats */}
              <div className="space-y-3 pt-3 border-t border-[#2D2D2D]">
                <div>
                  <h4 className="text-xs font-mono font-semibold text-gray-300 uppercase">Input Format:</h4>
                  <p className="text-xs font-mono text-gray-400 mt-1 bg-[#121212] p-2.5 rounded-xl border border-white/5">
                    {problem.inputFormat}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-semibold text-gray-300 uppercase">Output Format:</h4>
                  <p className="text-xs font-mono text-gray-400 mt-1 bg-[#121212] p-2.5 rounded-xl border border-white/5">
                    {problem.outputFormat}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-semibold text-gray-300 uppercase">Constraints:</h4>
                  <p className="text-xs font-mono text-[#D4AF37] mt-1 bg-[#121212] p-2.5 rounded-xl border border-white/5">
                    {problem.constraints}
                  </p>
                </div>
              </div>

              {/* Sample Test Cases */}
              <div className="pt-3 border-t border-[#2D2D2D] space-y-3">
                <h4 className="text-xs font-mono font-semibold text-gray-300 uppercase">Sample Test Cases:</h4>
                {problem.sampleCases.map((sample, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#101010] border border-[#2D2D2D] text-xs font-mono space-y-1">
                    <div className="text-gray-400">Input: <span className="text-white">{sample.input}</span></div>
                    <div className="text-gray-400">Output: <span className="text-[#D4AF37] font-bold">{sample.output}</span></div>
                  </div>
                ))}
              </div>

              {/* Hints Accordion */}
              <div className="pt-3 border-t border-[#2D2D2D]">
                <button
                  type="button"
                  onClick={() => setShowHints(!showHints)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#161616] hover:bg-[#1F1F1F] border border-[#2D2D2D] text-xs font-mono text-[#D4AF37] transition-colors"
                >
                  <span className="flex items-center gap-2 font-bold">
                    <Lightbulb className="w-4 h-4" />
                    Problem Hints & Guidelines ({problem.hints.length})
                  </span>
                  {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showHints && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 p-3 rounded-xl bg-[#121212] border border-white/5 space-y-2 text-xs text-gray-300 font-sans"
                  >
                    {problem.hints.map((hint, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="font-mono text-[#D4AF37]">{i + 1}.</span>
                        <span>{hint}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Logic Editor & Action Bar (7/12) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Structured Logic Editor Component */}
            <LogicEditor
              value={logicText}
              onChange={setLogicText}
              onClear={() => setLogicText('')}
            />

            {/* Action Bar */}
            <div className="glass-panel rounded-2xl p-4 border border-[#2D2D2D] flex flex-wrap items-center justify-between gap-3 shadow-lg">
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !logicText.trim()}
                  className="py-3 px-4 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-white bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2D2D2D] hover:border-[#D4AF37] transition-all flex items-center gap-2 disabled:opacity-40"
                >
                  <Play className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Run Check</span>
                </button>

                <button
                  type="button"
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !logicText.trim()}
                  className="py-3 px-5 rounded-xl font-display text-xs uppercase font-bold tracking-widest text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-[0.99] transition-all flex items-center gap-2 disabled:opacity-40"
                >
                  {isEvaluating ? (
                    <span className="animate-pulse">Evaluating Logic...</span>
                  ) : (
                    <>
                      <span>Submit Logic</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Unlocked Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Logic Flow Button */}
                <button
                  type="button"
                  onClick={handleGenerateFlow}
                  disabled={!isLogicValidated || isGeneratingFlow}
                  className={`py-3 px-4 rounded-xl font-display text-xs uppercase font-bold tracking-wider flex items-center gap-2 transition-all ${
                    isLogicValidated
                      ? 'bg-gradient-to-r from-[#1E1E1E] to-[#121212] text-[#D4AF37] border border-[#D4AF37]/50 hover:border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'bg-[#141414] text-gray-600 border border-[#2D2D2D] cursor-not-allowed'
                  }`}
                  title={isLogicValidated ? 'Generate visual flowchart of validated logic' : 'Unlock by successfully validating logic first'}
                >
                  <GitCommit className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isGeneratingFlow ? 'Building Flow...' : 'Logic Flow'}</span>
                </button>

                {/* Generate Code Button */}
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  disabled={!isLogicValidated || isGeneratingCode}
                  className={`py-3 px-5 rounded-xl font-display text-xs uppercase font-bold tracking-wider flex items-center gap-2 transition-all ${
                    isLogicValidated
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-[#141414] text-gray-600 border border-[#2D2D2D] cursor-not-allowed'
                  }`}
                  title={isLogicValidated ? 'Convert validated logic into source code' : 'Unlock by successfully validating logic first'}
                >
                  <Code2 className="w-4 h-4" />
                  <span>{isGeneratingCode ? 'Generating...' : `Generate ${selectedLanguage.toUpperCase()} Code`}</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* AI Evaluation Feedback Modal */}
      <EvaluationModal
        isOpen={showCodeModal || showFlowModal ? false : showEvalModal}
        onClose={() => setShowEvalModal(false)}
        result={evalResult}
        onGenerateCodeClick={handleGenerateCode}
        onGenerateFlowClick={handleGenerateFlow}
      />

      {/* Logic Flow Visualizer Modal */}
      <FlowchartModal
        isOpen={showFlowModal}
        onClose={() => setShowFlowModal(false)}
        flowData={flowResult}
        problemTitle={problem.title}
      />

      {/* Code Generation Viewer Modal */}
      <CodeViewer
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        codeData={codeResult}
        language={selectedLanguage}
      />

    </div>
  );
}
