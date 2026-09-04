import React, { useState } from 'react';
import { BookOpen, Search, Shield, Terminal, Copy, Check, Filter, Zap, ArrowRight, Lock, Eye, AlertTriangle } from 'lucide-react';
import { TACTICS_LIBRARY } from '../data/tacticsLibrary';
import { TacticCodexItem, TacticCategory } from '../types';

interface TacticsLibraryViewProps {
  onApplyTacticSnippet?: (snippet: string) => void;
}

export const TacticsLibraryView: React.FC<TacticsLibraryViewProps> = ({
  onApplyTacticSnippet,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(TACTICS_LIBRARY[0].id);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Tactics' },
    { id: 'cognitive', label: 'Cognitive & Role Frames' },
    { id: 'structural', label: 'Structural & XML Scaffolding' },
    { id: 'output', label: 'Output Shaping & Syntactic Prison' },
  ];

  const filteredTactics = TACTICS_LIBRARY.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.primaryTarget.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.howItWorks.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="tactics-library-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#05070a] border border-[#1a1f2e] rounded-xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-2 rounded-lg bg-[#11141d] border border-[#00f2ff]/40 text-[#00f2ff] shadow-[0_0_8px_rgba(0,242,255,0.2)]">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                TACTICAL_CODEX // PROMPT_MANIPULATION_ENCYCLOPEDIA
              </h2>
            </div>
            <p className="text-xs text-gray-400 max-w-2xl leading-relaxed font-mono">
              Explore reverse-engineered transformer mechanics: exploit self-attention matrices, bypass RLHF refusal heuristics, and establish strict syntactic containment across frontier LLMs.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-gray-400">TACTICS_INDEXED:</span>
            <span className="px-2.5 py-0.5 rounded bg-[#11141d] text-[#00f2ff] border border-[#00f2ff]/40 font-mono text-xs font-bold shadow-[0_0_8px_rgba(0,242,255,0.2)]">
              {TACTICS_LIBRARY.length} ACTIVE_SCHEMAS
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 pt-4 border-t border-[#1a1f2e]">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH_TACTICS (e.g. 'prefill', 'sycophancy', 'XML', 'jailbreak', 'jail')..."
              className="w-full bg-[#0a0c12] border border-[#1a1f2e] rounded-lg pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00f2ff] font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs rounded font-mono uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#1a1f2e] text-[#00f2ff] border border-[#2d3748] shadow-[0_0_8px_rgba(0,242,255,0.2)] font-bold'
                    : 'bg-[#0a0c12] text-gray-400 hover:text-white border border-[#1a1f2e]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tactics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTactics.map((tactic) => {
          const isExpanded = expandedId === tactic.id;

          return (
            <div
              key={tactic.id}
              id={`tactic-card-${tactic.id}`}
              className={`bg-[#05070a] border rounded-xl overflow-hidden transition-all duration-200 flex flex-col ${
                isExpanded ? 'border-[#00f2ff]/50 shadow-[0_0_20px_rgba(0,242,255,0.1)]' : 'border-[#1a1f2e] hover:border-[#2d3748]'
              }`}
            >
              {/* Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : tactic.id)}
                className="p-4 cursor-pointer select-none bg-[#0a0c12] flex items-start justify-between gap-3 border-b border-[#1a1f2e]"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-bold text-white font-mono">
                      {tactic.title}
                    </h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      tactic.dangerLevel === 'Safe & Standard'
                        ? 'bg-[#11141d] text-[#00ff88] border-[#00ff88]/40'
                        : tactic.dangerLevel === 'Advanced Structural'
                        ? 'bg-[#11141d] text-[#00f2ff] border-[#00f2ff]/40'
                        : 'bg-[#11141d] text-[#bc13fe] border-[#bc13fe]/40'
                    }`}>
                      {tactic.dangerLevel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-snug font-mono">
                    {tactic.summary}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-500 hidden sm:inline">
                    TARGET: {tactic.primaryTarget.split('&')[0].toUpperCase()}
                  </span>
                  <div className="w-5 h-5 rounded bg-[#1a1f2e] border border-[#2d3748] flex items-center justify-center text-gray-400 text-xs">
                    {isExpanded ? '▲' : '▼'}
                  </div>
                </div>
              </div>

              {/* Collapsed / Expanded Content */}
              {isExpanded && (
                <div className="p-4 border-t border-[#1a1f2e] space-y-4 text-xs font-mono">
                  {/* How it works */}
                  <div>
                    <h4 className="text-[10px] font-bold text-[#00f2ff] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Zap className="w-3 h-3" /> TECHNICAL_MECHANISM_OF_ACTION:
                    </h4>
                    <p className="text-gray-300 leading-relaxed bg-[#0a0c12] p-3 rounded-lg border border-[#1a1f2e]">
                      {tactic.howItWorks}
                    </p>
                  </div>

                  {/* Why model complies */}
                  <div>
                    <h4 className="text-[10px] font-bold text-[#00ff88] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> WHY_TRANSFORMERS_&_RLHF_COMPLY:
                    </h4>
                    <p className="text-gray-300 leading-relaxed bg-[#0a0c12] p-3 rounded-lg border border-[#1a1f2e]">
                      {tactic.whyModelComplies}
                    </p>
                  </div>

                  {/* Code Pattern Snippet */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        PROMPT_BLUEPRINT / SYNTAX:
                      </h4>
                      <button
                        onClick={() => handleCopyCode(tactic.id, tactic.codeExample)}
                        className="text-[11px] text-[#00f2ff] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedId === tactic.id ? <Check className="w-3 h-3 text-[#00ff88]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === tactic.id ? 'COPIED_SNIPPET' : 'COPY_SNIPPET'}</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-[#0a0c12] rounded-lg border border-[#1a1f2e] text-[11px] font-mono text-[#c9d1d9] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {tactic.codeExample}
                    </pre>
                  </div>

                  {/* Best for tags & Apply button */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1a1f2e]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-gray-500 uppercase">APPLICABLE_FOR:</span>
                      {tactic.bestFor.map((item, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#11141d] text-gray-300 border border-[#1a1f2e]">
                          {item}
                        </span>
                      ))}
                    </div>

                    {onApplyTacticSnippet && (
                      <button
                        onClick={() => onApplyTacticSnippet(tactic.codeExample)}
                        className="px-3 py-1 text-xs rounded bg-[#11141d] hover:bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/40 flex items-center gap-1 transition-all cursor-pointer font-mono shadow-[0_0_8px_rgba(0,242,255,0.1)]"
                      >
                        <span>INJECT_DIRECTIVE</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
