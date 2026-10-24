import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { PROBLEMS_DATA } from '../data/problemsData';
import ThreeCanvas from '../components/ThreeCanvas';
import {
  HelpCircle,
  MessageSquare,
  Sparkles,
  Send,
  BookOpen,
  Lightbulb,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ChevronRight
} from 'lucide-react';

export default function DoubtClarificationPage() {
  const { user } = useAuth();
  const [selectedProblemId, setSelectedProblemId] = useState('prob-101');
  const [doubtCategory, setDoubtCategory] = useState('Algorithm Concept');
  const [questionText, setQuestionText] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // Chat conversation history state
  const [chatHistory, setChatHistory] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello ${user?.fullName?.split(' ')[0] || 'Logician'}! 👋 I am your Socratic AI Logic Mentor. Ask me any conceptual doubt about variables, loops, recursion, or algorithm design.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const presetQuestions = [
    'Why do I need a result variable before outputting a sum?',
    'How do I prevent infinite loops in while condition checks?',
    'What is the difference between pass-by-value and pass-by-reference in logic?',
    'How do I formulate pseudocode for two-pointer array reversal?'
  ];

  const handleAskDoubt = (textToSend) => {
    const text = textToSend || questionText;
    if (!text.trim()) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMsg]);
    if (!textToSend) setQuestionText('');
    setIsAsking(true);

    // AI Response Generation (Socratic Doubt Resolution Engine)
    setTimeout(() => {
      let aiReply = '';
      const lower = text.toLowerCase();

      if (lower.includes('result') || lower.includes('sum') || lower.includes('variable')) {
        aiReply = `Great question! In algorithm formulation, variables act as named memory containers.

1. **Why it matters:** When you compute an operation (like A + B), CPU registers calculate the value instantly.
2. **Storage Step:** Without storing that value in a designated variable (e.g., \`result = A + B\`), the program cannot reference or output it in subsequent steps.
3. **Best Practice:** Always declare your variables explicitly before performing operations!`;
      } else if (lower.includes('loop') || lower.includes('infinite')) {
        aiReply = `Loops require 3 essential components to terminate safely:

1. **Initialization:** Set an initial loop counter (e.g., \`i = 0\`).
2. **Termination Condition:** Define a valid boundary (e.g., \`while i < N\`).
3. **State Update:** Update your counter inside the loop body (e.g., \`increment i by 1\`). If you forget step 3, the condition stays true forever!`;
      } else if (lower.includes('pointer') || lower.includes('reversal') || lower.includes('array')) {
        aiReply = `Two-pointer logic operates by placing pointers at opposite ends of data structures:

- Pointer 1 starts at index 0 (Left).
- Pointer 2 starts at index N-1 (Right).
- Loop condition: \`while Left < Right\` -> Swap elements at Left and Right, then move Left rightward and Right leftward.`;
      } else {
        aiReply = `I understand your doubt about: "${text}".

Here is how to think through it logically:
1. **Break Down the Goal:** Identify what inputs you have and what output is expected.
2. **Track Data State:** Ensure every intermediate calculation is saved into a named variable.
3. **Verify Boundary Conditions:** Check edge cases (e.g. 0, negative numbers, or empty lists).

Feel free to refine your logic steps in the problem editor!`;
      }

      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory((prev) => [...prev, aiMsg]);
      setIsAsking(false);
    }, 1000);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      <ThreeCanvas />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-luxury">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-950/50 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-mono font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" /> AI Logic Mentor
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                Doubt Clarification Portal
              </h1>
              <p className="text-xs text-gray-400 font-sans mt-1">
                Get instant Socratic conceptual guidance and algorithm reasoning assistance without spoiling solution code.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-[#141414] border border-[#2D2D2D] text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Hint-Only Safeguard Active
            </span>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Topic & Problem Selector + Quick Suggestions (4/12) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Category & Problem Context */}
            <div className="glass-panel rounded-3xl p-5 border border-[#2D2D2D] space-y-4 shadow-xl">
              <h3 className="text-xs uppercase font-mono tracking-wider text-[#D4AF37] font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Context & Topic Settings
              </h3>

              {/* Problem Selector */}
              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">Problem Context:</label>
                <select
                  value={selectedProblemId}
                  onChange={(e) => setSelectedProblemId(e.target.value)}
                  className="w-full bg-[#141414] text-xs font-mono text-white p-3 rounded-xl border border-[#2D2D2D] outline-none focus:border-[#D4AF37] transition-all cursor-pointer"
                >
                  {PROBLEMS_DATA.map((prob) => (
                    <option key={prob.id} value={prob.id}>
                      #{prob.number} {prob.title} ({prob.difficulty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Doubt Category */}
              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">Doubt Category:</label>
                <select
                  value={doubtCategory}
                  onChange={(e) => setDoubtCategory(e.target.value)}
                  className="w-full bg-[#141414] text-xs font-mono text-white p-3 rounded-xl border border-[#2D2D2D] outline-none focus:border-[#D4AF37] transition-all cursor-pointer"
                >
                  <option value="Algorithm Concept">Algorithm Concept</option>
                  <option value="Variable Scope & Storage">Variable Scope & Storage</option>
                  <option value="Loop & Condition Logic">Loop & Condition Logic</option>
                  <option value="Time & Space Complexity">Time & Space Complexity</option>
                  <option value="General Logic Formulation">General Logic Formulation</option>
                </select>
              </div>
            </div>

            {/* Recommended Prompts */}
            <div className="glass-panel rounded-3xl p-5 border border-[#2D2D2D] space-y-3 shadow-xl">
              <h3 className="text-xs uppercase font-mono tracking-wider text-[#D4AF37] font-bold flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Frequently Asked Doubts
              </h3>

              <div className="space-y-2">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAskDoubt(q)}
                    className="w-full text-left p-3 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#2D2D2D] hover:border-[#D4AF37]/50 text-xs font-sans text-gray-300 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span>{q}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#D4AF37] shrink-0" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: AI Doubt Chat Window (8/12) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="glass-panel rounded-3xl border border-[#2D2D2D] flex flex-col h-[650px] shadow-2xl overflow-hidden">
              
              {/* Chat Window Header */}
              <div className="bg-[#181818] border-b border-[#2D2D2D] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E1E1E] to-[#0F0F0F] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-display text-white">Socratic Doubt Assistant</h3>
                    <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online • Ready to clarify logic
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setChatHistory([chatHistory[0]])}
                  className="p-2 rounded-xl bg-[#141414] hover:bg-red-500/10 border border-[#2D2D2D] text-gray-400 hover:text-red-400 transition-colors"
                  title="Clear Chat History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Conversation Scroll Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans bg-[#0E0E0E]">
                {chatHistory.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 ${
                      msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar Icon */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs border ${
                        msg.sender === 'user'
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                          : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-400'
                      }`}
                    >
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] text-black font-semibold rounded-tr-none'
                          : 'bg-[#181818] border border-[#2D2D2D] text-gray-200 rounded-tl-none whitespace-pre-wrap font-sans'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[9px] font-mono mt-1.5 block text-right ${
                          msg.sender === 'user' ? 'text-black/70' : 'text-gray-500'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {isAsking && (
                  <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                    <div className="w-8 h-8 rounded-xl bg-emerald-950/50 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <p className="animate-pulse">Analyzing logic doubt & preparing Socratic explanation...</p>
                  </div>
                )}
              </div>

              {/* Question Input Footer */}
              <div className="p-4 bg-[#141414] border-t border-[#2D2D2D]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskDoubt();
                  }}
                  className="flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Type your logic doubt here (e.g. Why is a loop variable needed?)..."
                    className="flex-1 bg-[#1A1A1A] text-xs font-mono text-white p-3.5 rounded-xl border border-[#2D2D2D] outline-none focus:border-[#D4AF37] transition-all placeholder:text-gray-600"
                  />

                  <button
                    type="submit"
                    disabled={isAsking || !questionText.trim()}
                    className="py-3.5 px-6 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2 disabled:opacity-40 shrink-0"
                  >
                    <span>Ask Doubt</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
