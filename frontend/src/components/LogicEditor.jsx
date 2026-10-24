import React from 'react';
import { Trash2, FileCode, Sparkles } from 'lucide-react';

export default function LogicEditor({ value, onChange, onClear }) {
  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 1);
  
  // Generate line numbers matching actual lines (minimum 15 for aesthetics)
  const totalDisplayLines = Math.max(lineCount, 15);
  const lineNumbers = Array.from({ length: totalDisplayLines }, (_, i) => i + 1);

  // 24px line height (leading-6) + 32px padding (py-4)
  const editorHeight = Math.max(totalDisplayLines * 24 + 32, 340);

  const insertSnippet = (snippet) => {
    const newValue = value ? `${value}\n${snippet}` : snippet;
    onChange(newValue);
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] rounded-2xl border border-[#2D2D2D] overflow-hidden shadow-inner">
      
      {/* Editor Header Toolbar */}
      <div className="bg-[#181818] border-b border-[#2D2D2D] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none shrink-0">
        
        {/* Left Snippet Shortcut Helper Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Snippets:
          </span>
          <button
            type="button"
            onClick={() => insertSnippet('Declare variable A as integer = 0')}
            className="px-2.5 py-1 rounded-lg bg-[#222222] hover:bg-[#2A2A2A] border border-white/5 text-[11px] font-mono text-gray-300 hover:text-[#D4AF37] transition-colors"
          >
            + Var
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('Loop while counter < limit do:')}
            className="px-2.5 py-1 rounded-lg bg-[#222222] hover:bg-[#2A2A2A] border border-white/5 text-[11px] font-mono text-gray-300 hover:text-[#D4AF37] transition-colors"
          >
            + Loop
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('If condition is true then:')}
            className="px-2.5 py-1 rounded-lg bg-[#222222] hover:bg-[#2A2A2A] border border-white/5 text-[11px] font-mono text-gray-300 hover:text-[#D4AF37] transition-colors"
          >
            + If/Else
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
          <span>{lineCount} Lines</span>
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded-md hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
            title="Clear Editor"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Unified Single Scroll Container (Line Numbers & Code move together) */}
      <div className="flex-1 flex font-mono text-sm overflow-auto max-h-[460px] min-h-[340px] relative bg-[#121212]">
        
        {/* Line Numbers Column - Attached at exact same Y offsets */}
        <div
          className="py-4 px-3 bg-[#0E0E0E] text-gray-600 text-right select-none border-r border-[#2D2D2D]/60 w-12 shrink-0 sticky left-0 z-10"
          style={{ height: `${editorHeight}px` }}
        >
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6 h-6">
              {num}
            </div>
          ))}
        </div>

        {/* Textarea - Expands vertically inside the scrolling container */}
        <textarea
          wrap="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter structured natural-language reasoning or pseudocode...
Example:
1. Declare integer variable sum = 0
2. Loop through each number in input list:
   - Add current number to sum
3. Output the result sum`}
          className="flex-1 py-4 px-4 bg-transparent text-gray-100 placeholder:text-gray-600 outline-none resize-none leading-6 font-mono focus:ring-0 shadow-none border-none whitespace-pre overflow-hidden"
          style={{ height: `${editorHeight}px`, minWidth: 'calc(100% - 3rem)' }}
          spellCheck={false}
        />
      </div>

      {/* Editor Footer Status */}
      <div className="bg-[#0E0E0E] border-t border-[#2D2D2D]/60 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-gray-400 select-none shrink-0">
        <span className="text-[#D4AF37] flex items-center gap-1.5">
          <FileCode className="w-3.5 h-3.5" />
          Mode: Structured Logic / Natural Language Reasoning
        </span>
        <span>Unified Line Number Scroll • LLM Evaluated</span>
      </div>

    </div>
  );
}
