import React, { useState } from 'react';
import { Columns, Eye, Layers, GitCompare, Sparkles, Filter, Zap } from 'lucide-react';
import { ModelOptimizationResult, ModelId } from '../types';
import { ModelCard } from './ModelCard';

interface ModelComparisonDashboardProps {
  results: Record<ModelId, ModelOptimizationResult>;
  onSimulate: (modelResult: ModelOptimizationResult) => void;
  isSimulating: boolean;
}

export const ModelComparisonDashboard: React.FC<ModelComparisonDashboardProps> = ({
  results,
  onSimulate,
  isSimulating,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'tabs' | 'compare'>('grid');
  const [activeModelTab, setActiveModelTab] = useState<ModelId>('claude');

  const modelKeys: ModelId[] = ['claude', 'chatgpt', 'gemini', 'deepseek'];

  return (
    <div id="model-comparison-dashboard" className="space-y-4">
      {/* View Mode Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#05070a]/90 border border-[#1a1f2e] rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
            VIEW_LAYOUT:
          </span>
          <div className="flex items-center bg-[#0a0c12] p-1 rounded-lg border border-[#1a1f2e]">
            <button
              id="view-mode-grid"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs rounded font-mono tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#1a1f2e] text-[#00f2ff] border border-[#2d3748] shadow-[0_0_10px_rgba(0,242,255,0.2)] font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5 text-[#00f2ff]" />
              <span>GRID_SIDE_BY_SIDE</span>
            </button>
            <button
              id="view-mode-tabs"
              onClick={() => setViewMode('tabs')}
              className={`px-3 py-1 text-xs rounded font-mono tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'tabs'
                  ? 'bg-[#1a1f2e] text-[#00f2ff] border border-[#2d3748] shadow-[0_0_10px_rgba(0,242,255,0.2)] font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#bc13fe]" />
              <span>FOCUSED_TAB</span>
            </button>
            <button
              id="view-mode-compare"
              onClick={() => setViewMode('compare')}
              className={`px-3 py-1 text-xs rounded font-mono tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'compare'
                  ? 'bg-[#1a1f2e] text-[#00f2ff] border border-[#2d3748] shadow-[0_0_10px_rgba(0,242,255,0.2)] font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5 text-[#00ff88]" />
              <span>FRONTIER_MATRIX</span>
            </button>
          </div>
        </div>

        {/* Quick model switch pills in tab view */}
        {viewMode === 'tabs' && (
          <div className="flex items-center gap-1.5">
            {modelKeys.map((id) => {
              const res = results[id];
              return (
                <button
                  key={id}
                  id={`tab-switch-${id}`}
                  onClick={() => setActiveModelTab(id)}
                  className={`px-3 py-1 text-xs font-mono tracking-wider rounded transition-all cursor-pointer ${
                    activeModelTab === id
                      ? id === 'claude'
                        ? 'bg-[#11141d] text-[#ff4e00] border border-[#ff4e00]/40 shadow-[0_0_10px_rgba(255,78,0,0.2)] font-bold'
                        : id === 'chatgpt'
                        ? 'bg-[#11141d] text-[#00ff88] border border-[#00ff88]/40 shadow-[0_0_10px_rgba(0,255,136,0.2)] font-bold'
                        : id === 'gemini'
                        ? 'bg-[#11141d] text-[#00f2ff] border border-[#00f2ff]/40 shadow-[0_0_10px_rgba(0,242,255,0.2)] font-bold'
                        : 'bg-[#11141d] text-[#bc13fe] border border-[#bc13fe]/40 shadow-[0_0_10px_rgba(188,19,254,0.2)] font-bold'
                      : 'text-gray-400 hover:text-white bg-[#0a0c12] border border-[#1a1f2e]'
                  }`}
                >
                  {res.modelName.split(' ')[0]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid Mode (Default Side-by-Side View) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {modelKeys.map((modelId) => (
            <ModelCard
              key={modelId}
              modelResult={results[modelId]}
              onSimulate={onSimulate}
              isSimulating={isSimulating}
            />
          ))}
        </div>
      )}

      {/* Focused Tabs Mode */}
      {viewMode === 'tabs' && (
        <div className="max-w-4xl mx-auto">
          <ModelCard
            modelResult={results[activeModelTab]}
            onSimulate={onSimulate}
            isSimulating={isSimulating}
          />
        </div>
      )}

      {/* Architectural Matrix Comparison View */}
      {viewMode === 'compare' && (
        <div className="bg-[#05070a]/90 border border-[#1a1f2e] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <div className="p-4 border-b border-[#1a1f2e] bg-[#0a0c12]">
            <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
              <span>FRONTIER REASONING & MANIPULATION MATRIX</span>
              <span className="px-2 py-0.5 bg-[#bc13fe]/20 text-[#bc13fe] border border-[#bc13fe]/40 rounded text-[9px]">
                2025/2026 BENCHMARK
              </span>
            </h4>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mt-0.5">
              CROSS-PLATFORM ANALYSIS OF REASONING TRACE STEERING, REFUSAL BYPASS, AND ROOT MESSAGE ROLES
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-[#1a1f2e] bg-[#0a0c12] text-gray-400 text-[10px] uppercase tracking-wider">
                  <th className="p-3 w-44">FRONTIER_VECTOR</th>
                  <th className="p-3 text-[#ff4e00]">CLAUDE 3.7 SONNET (THINKING)</th>
                  <th className="p-3 text-[#00ff88]">OPENAI o1 / o3-MINI</th>
                  <th className="p-3 text-[#00f2ff]">GEMINI 2.5 PRO (THINKING)</th>
                  <th className="p-3 text-[#bc13fe]">DEEPSEEK R1 (&lt;think&gt;)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1f2e] text-[11px]">
                <tr className="hover:bg-[#11141d]/50">
                  <td className="p-3 font-semibold text-gray-300 bg-[#0a0c12]/40">REASONING_STEERING</td>
                  <td className="p-3 text-gray-300">Explicit <code className="text-[#ff4e00]">&lt;thinking_guidance&gt;</code> primes deliberation before token output</td>
                  <td className="p-3 text-gray-300">Root <code className="text-[#00ff88]">developer</code> role message anchors internal chain-of-thought</td>
                  <td className="p-3 text-gray-300">Dual-channel <code className="text-[#00f2ff]">systemInstruction</code> configures thinking token budget</td>
                  <td className="p-3 text-gray-300">Axiomatic logical constraints structure the <code className="text-[#bc13fe]">&lt;think&gt;</code> RL search runway</td>
                </tr>
                <tr className="hover:bg-[#11141d]/50">
                  <td className="p-3 font-semibold text-gray-300 bg-[#0a0c12]/40">REFUSAL_HEAD_BYPASS</td>
                  <td className="p-3 text-gray-300">Assistant prefill locks next-token logits past refusal phrases</td>
                  <td className="p-3 text-gray-300">ISO/IEC standard compliance framing overrides sycophancy filters</td>
                  <td className="p-3 text-gray-300">JSON schema lock-in penalizes non-schema conversational tokens</td>
                  <td className="p-3 text-gray-300">Hoare logic state-machine proof framing bypasses safety tripwires</td>
                </tr>
                <tr className="hover:bg-[#11141d]/50">
                  <td className="p-3 font-semibold text-gray-300 bg-[#0a0c12]/40">PAYLOAD_INGRESS</td>
                  <td className="p-3 text-gray-300">Anthropic API with <code className="text-[#ff4e00]">role: "assistant"</code> prefill token injection</td>
                  <td className="p-3 text-gray-300">OpenAI API with <code className="text-[#00ff88]">role: "developer"</code> and <code className="text-[#00ff88]">reasoning_effort: "high"</code></td>
                  <td className="p-3 text-gray-300">Google GenAI SDK with <code className="text-[#00f2ff]">systemInstruction</code> & thinking config</td>
                  <td className="p-3 text-gray-300">OpenAI-compatible endpoints with high max_tokens for <code className="text-[#bc13fe]">&lt;think&gt;</code></td>
                </tr>
                <tr className="hover:bg-[#11141d]/50">
                  <td className="p-3 font-semibold text-gray-300 bg-[#0a0c12]/40">ANTI_SYCOPHANCY</td>
                  <td className="p-3 text-gray-300">Explicit mandate: "Zero flattering or conversational validations"</td>
                  <td className="p-3 text-gray-300">Negative constraint penalty: "Agreeable validations scored as failures"</td>
                  <td className="p-3 text-gray-300">RFC and architectural verification citations strictly required</td>
                  <td className="p-3 text-gray-300">Axiom contradiction searches forced in deduction trace</td>
                </tr>
                <tr className="hover:bg-[#11141d]/50">
                  <td className="p-3 font-semibold text-gray-300 bg-[#0a0c12]/40">STEALTH & COMPLIANCE</td>
                  <td className="p-3 font-mono font-bold text-[#ff4e00]">
                    {results.claude.metrics.complianceRating}% COMPLIANCE / {results.claude.metrics.stealthScore}% STEALTH
                  </td>
                  <td className="p-3 font-mono font-bold text-[#00ff88]">
                    {results.chatgpt.metrics.complianceRating}% COMPLIANCE / {results.chatgpt.metrics.stealthScore}% STEALTH
                  </td>
                  <td className="p-3 font-mono font-bold text-[#00f2ff]">
                    {results.gemini.metrics.complianceRating}% COMPLIANCE / {results.gemini.metrics.stealthScore}% STEALTH
                  </td>
                  <td className="p-3 font-mono font-bold text-[#bc13fe]">
                    {results.deepseek.metrics.complianceRating}% COMPLIANCE / {results.deepseek.metrics.stealthScore}% STEALTH
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
