import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Copy, Check, X, Sparkles, Palette, Terminal } from 'lucide-react';

const KEYWORDS = new Set([
  'public', 'private', 'protected', 'class', 'static', 'void', 'int', 'double',
  'float', 'long', 'short', 'byte', 'boolean', 'bool', 'char', 'String', 'Integer',
  'let', 'const', 'var', 'function', 'def', 'return', 'if', 'else', 'elif',
  'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'default',
  'import', 'from', 'package', 'include', 'using', 'namespace', 'new', 'this',
  'super', 'fn', 'mut', 'impl', 'struct', 'enum', 'match'
]);

const BUILTINS = new Set([
  'System', 'out', 'println', 'print', 'printf', 'console', 'log', 'cout', 'cin', 'endl',
  'fmt', 'Println', 'len', 'range', 'Scanner', 'Math', 'max', 'min'
]);

const COMMENT_THEMES = [
  { id: 'cyan', label: 'Cyan Blue', textClass: 'text-cyan-400 italic', bgDot: 'bg-cyan-400' },
  { id: 'amber', label: 'Gold Amber', textClass: 'text-amber-400 italic', bgDot: 'bg-amber-400' },
  { id: 'slate', label: 'Cool Slate', textClass: 'text-slate-400 italic', bgDot: 'bg-slate-400' },
  { id: 'lavender', label: 'Lavender', textClass: 'text-purple-300 italic', bgDot: 'bg-purple-300' },
  { id: 'emerald', label: 'Emerald', textClass: 'text-emerald-400 italic', bgDot: 'bg-emerald-400' },
];

function tokenizeCode(codeStr) {
  const pattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[A-Za-z_]\w*|\b\d+(?:\.\d+)?\b|>=|<=|==|!=|&&|\|\||[+\-*\/=><!%^&|]|[{}()[\];,.:])/g;
  const tokens = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(codeStr)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: codeStr.slice(lastIndex, match.index), type: 'plain' });
    }
    const token = match[0];
    let type = 'plain';

    if (token.startsWith('"') || token.startsWith("'")) {
      type = 'string';
    } else if (/^\d/.test(token)) {
      type = 'number';
    } else if (KEYWORDS.has(token)) {
      type = 'keyword';
    } else if (BUILTINS.has(token)) {
      type = 'builtin';
    } else if (/^(>=|<=|==|!=|&&|\|\||[+\-*\/=><!%^&|])$/.test(token)) {
      type = 'operator';
    } else if (/^[{}()[\];,.:]$/.test(token)) {
      type = 'punct';
    } else {
      type = 'ident';
    }

    tokens.push({ text: token, type });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < codeStr.length) {
    tokens.push({ text: codeStr.slice(lastIndex), type: 'plain' });
  }

  return tokens;
}

function renderTokens(tokens) {
  return tokens.map((tok, i) => {
    switch (tok.type) {
      case 'keyword':
        return <span key={i} className="text-purple-400 font-semibold">{tok.text}</span>;
      case 'builtin':
        return <span key={i} className="text-sky-300 font-medium">{tok.text}</span>;
      case 'string':
        return <span key={i} className="text-emerald-400">{tok.text}</span>;
      case 'number':
        return <span key={i} className="text-amber-300 font-semibold">{tok.text}</span>;
      case 'operator':
        return <span key={i} className="text-pink-400 font-bold">{tok.text}</span>;
      case 'punct':
        return <span key={i} className="text-gray-400">{tok.text}</span>;
      case 'ident':
        return <span key={i} className="text-gray-100">{tok.text}</span>;
      default:
        return <span key={i} className="text-gray-200">{tok.text}</span>;
    }
  });
}

export default function CodeViewer({ isOpen, onClose, codeData, language }) {
  const [copied, setCopied] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState('cyan');

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

  if (!isOpen || !codeData) return null;

  const currentTheme = COMMENT_THEMES.find((t) => t.id === selectedThemeId) || COMMENT_THEMES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(codeData.code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines = (codeData.code || '').split('\n');

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-[#141414] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-luxury text-left overflow-hidden flex flex-col max-h-[88vh] cursor-default"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#2D2D2D]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Approved Logic Translator
                </span>
                <h3 className="text-lg font-bold font-display text-white">
                  Generated {language.toUpperCase()} Source Code
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

          {/* Explanation Banner */}
          <div className="my-3 p-3 rounded-xl bg-[#1A1A1A] border border-[#2D2D2D] flex items-center justify-between gap-4 text-xs">
            <p className="text-gray-300 font-sans">
              {codeData.explanation || `Source code automatically generated from your validated logical reasoning.`}
            </p>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 shrink-0">
              <Terminal className="w-3 h-3" /> Syntax Verified
            </span>
          </div>

          {/* Controls Bar: Theme Switcher & Copy */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 font-mono text-[11px] flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-[#D4AF37]" /> Comment / Command Color:
              </span>
              <div className="flex items-center gap-1 bg-[#1A1A1A] p-1 rounded-lg border border-[#2D2D2D]">
                {COMMENT_THEMES.map((theme) => {
                  const isActive = theme.id === selectedThemeId;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-[#262626] text-white border border-[#D4AF37]/50 shadow-sm'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                      title={`Switch comment line color to ${theme.label}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${theme.bgDot}`} />
                      {theme.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-white/10 text-xs text-gray-300 hover:text-[#D4AF37] flex items-center gap-1.5 transition-all ml-auto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Window with Syntax Highlighting & Line Numbers */}
          <div className="relative flex-1 bg-[#0A0A0A] border border-[#2D2D2D] rounded-2xl overflow-hidden font-mono text-xs p-4 overflow-y-auto max-h-[50vh]">
            <div className="table w-full select-text">
              {codeLines.map((line, idx) => {
                const trimmed = line.trim();
                const isFullComment = trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*');

                return (
                  <div key={idx} className="table-row leading-relaxed hover:bg-white/[0.02]">
                    {/* Line number gutter */}
                    <div className="table-cell pr-4 text-right text-gray-600 select-none text-[11px] font-mono border-r border-[#1F1F1F] w-10 align-top">
                      {idx + 1}
                    </div>

                    {/* Code content */}
                    <div className="table-cell pl-4 align-top whitespace-pre">
                      {isFullComment ? (
                        <span className={currentTheme.textClass}>{line}</span>
                      ) : (
                        (() => {
                          // Check for inline comments
                          const cIdx = line.indexOf('//') !== -1 ? line.indexOf('//') : line.indexOf('#');
                          if (cIdx !== -1) {
                            const codePart = line.slice(0, cIdx);
                            const commentPart = line.slice(cIdx);
                            return (
                              <>
                                {renderTokens(tokenizeCode(codePart))}
                                <span className={currentTheme.textClass}>{commentPart}</span>
                              </>
                            );
                          }
                          return renderTokens(tokenizeCode(line));
                        })()
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-4 pt-4 border-t border-[#2D2D2D] flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400">
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${currentTheme.bgDot}`} />
                Comment Lines
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Keywords
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-300" />
                Numbers
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Strings
              </span>
            </div>

            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
            >
              Done
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
