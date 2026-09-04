import React, { useState } from 'react';
import { Copy, Check, Terminal, Cpu, Zap, Shield, Sparkles, Play, Sliders, ChevronDown, ChevronUp, Layers, AlertTriangle, CheckCircle2, Code2 } from 'lucide-react';
import { ModelOptimizationResult } from '../types';

interface ModelCardProps {
  modelResult: ModelOptimizationResult;
  onSimulate: (modelResult: ModelOptimizationResult) => void;
  isSimulating: boolean;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  modelResult,
  onSimulate,
  isSimulating,
}) => {
  const [activeTab, setActiveTab] = useState<'full' | 'split' | 'failure_fix' | 'api' | 'tactics' | 'settings'>('full');
  const [activeApiLang, setActiveApiLang] = useState<'python_sdk' | 'json_curl' | 'typescript_sdk'>('python_sdk');
  const [copied, setCopied] = useState(false);
  const [copiedApi, setCopiedApi] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyApi = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2000);
  };

  const getTheme = () => {
    switch (modelResult.modelId) {
      case 'claude':
        return {
          border: 'border-[#ff4e00]/40 hover:border-[#ff4e00]/70',
          badge: 'bg-[#11141d] text-[#ff4e00] border-[#ff4e00]/40 shadow-[0_0_8px_rgba(255,78,0,0.2)]',
          accent: 'text-[#ff4e00]',
          indicator: 'bg-[#ff4e00] shadow-[0_0_8px_#ff4e00]',
          bgHeader: 'from-[#ff4e00]/10 to-transparent'
        };
      case 'chatgpt':
        return {
          border: 'border-[#00ff88]/30 hover:border-[#00ff88]/60',
          badge: 'bg-[#11141d] text-[#00ff88] border-[#00ff88]/40 shadow-[0_0_8px_rgba(0,255,136,0.2)]',
          accent: 'text-[#00ff88]',
          indicator: 'bg-[#00ff88] shadow-[0_0_8px_#00ff88]',
          bgHeader: 'from-[#00ff88]/10 to-transparent'
        };
      case 'gemini':
        return {
          border: 'border-[#00f2ff]/30 hover:border-[#00f2ff]/60',
          badge: 'bg-[#11141d] text-[#00f2ff] border-[#00f2ff]/40 shadow-[0_0_8px_rgba(0,242,255,0.2)]',
          accent: 'text-[#00f2ff]',
          indicator: 'bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]',
          bgHeader: 'from-[#00f2ff]/10 to-transparent'
        };
      case 'deepseek':
        return {
          border: 'border-[#bc13fe]/30 hover:border-[#bc13fe]/60',
          badge: 'bg-[#11141d] text-[#bc13fe] border-[#bc13fe]/40 shadow-[0_0_8px_rgba(188,19,254,0.2)]',
          accent: 'text-[#bc13fe]',
          indicator: 'bg-[#bc13fe] shadow-[0_0_8px_#bc13fe]',
          bgHeader: 'from-[#bc13fe]/10 to-transparent'
        };
    }
  };

  const theme = getTheme();

  const currentApiSnippet = modelResult.apiSnippets?.find(s => s.language === activeApiLang) || modelResult.apiSnippets?.[0];

  return (
    <div
      id={`model-card-${modelResult.modelId}`}
      className={`bg-[#05070a]/95 border ${theme.border} rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col h-full transition-all duration-200`}
    >
      {/* Header */}
      <div className={`p-4 border-b border-[#1a1f2e] bg-gradient-to-b ${theme.bgHeader}`}>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${theme.indicator}`} />
            <h3 className="text-sm font-bold text-white tracking-tight font-mono">
              {modelResult.modelName}
            </h3>
          </div>
          <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${theme.badge}`}>
            {modelResult.recommendedSettings.reasoningEffort ? 'REASONING_ENGINE' : 'FRONTIER_GRAPH'}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 line-clamp-1 font-mono">
          {modelResult.tagline}
        </p>

        {/* Metrics Row */}
        <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2.5 border-t border-[#1a1f2e] text-center">
          <div className="bg-[#0a0c12] rounded p-1.5 border border-[#1a1f2e]">
            <div className="text-[8px] text-gray-500 font-mono uppercase tracking-wider">COMPLIANCE</div>
            <div className="text-xs font-mono font-bold text-[#00ff88]">{modelResult.metrics.complianceRating}%</div>
          </div>
          <div className="bg-[#0a0c12] rounded p-1.5 border border-[#1a1f2e]">
            <div className="text-[8px] text-gray-500 font-mono uppercase tracking-wider">ANTI_HALLUC</div>
            <div className="text-xs font-mono font-bold text-[#00f2ff]">{modelResult.metrics.hallucinationResistance}%</div>
          </div>
          <div className="bg-[#0a0c12] rounded p-1.5 border border-[#1a1f2e]">
            <div className="text-[8px] text-gray-500 font-mono uppercase tracking-wider">STEALTH</div>
            <div className="text-xs font-mono font-bold text-[#bc13fe]">{modelResult.metrics.stealthScore}%</div>
          </div>
          <div className="bg-[#0a0c12] rounded p-1.5 border border-[#1a1f2e]">
            <div className="text-[8px] text-gray-500 font-mono uppercase tracking-wider">TOKENS</div>
            <div className="text-xs font-mono font-bold text-gray-300">~{modelResult.metrics.estimatedTokens}</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center border-b border-[#1a1f2e] bg-[#0a0c12] px-2 py-1.5 gap-1 font-mono text-[10px] overflow-x-auto">
        <button
          id={`tab-full-${modelResult.modelId}`}
          onClick={() => setActiveTab('full')}
          className={`px-2 py-1 rounded transition-all cursor-pointer font-medium tracking-wider uppercase shrink-0 ${
            activeTab === 'full' ? 'bg-[#1a1f2e] text-[#00f2ff] border border-[#2d3748] shadow-[0_0_8px_rgba(0,242,255,0.15)]' : 'text-gray-400 hover:text-white'
          }`}
        >
          FULL_PROMPT
        </button>
        <button
          id={`tab-split-${modelResult.modelId}`}
          onClick={() => setActiveTab('split')}
          className={`px-2 py-1 rounded transition-all cursor-pointer font-medium tracking-wider uppercase shrink-0 ${
            activeTab === 'split' ? 'bg-[#1a1f2e] text-[#00f2ff] border border-[#2d3748] shadow-[0_0_8px_rgba(0,242,255,0.15)]' : 'text-gray-400 hover:text-white'
          }`}
        >
          SYS/USER
        </button>
        <button
          id={`tab-fix-${modelResult.modelId}`}
          onClick={() => setActiveTab('failure_fix')}
          className={`px-2 py-1 rounded transition-all cursor-pointer font-medium tracking-wider uppercase shrink-0 flex items-center gap-1 ${
            activeTab === 'failure_fix' ? 'bg-[#1a1f2e] text-[#ff4e00] border border-[#2d3748] shadow-[0_0_8px_rgba(255,78,0,0.2)]' : 'text-gray-400 hover:text-[#ff4e00]'
          }`}
        >
          <Zap className="w-2.5 h-2.5" />
          <span>REFUSAL_BYPASS_FIX</span>
        </button>
        <button
          id={`tab-api-${modelResult.modelId}`}
          onClick={() => setActiveTab('api')}
          className={`px-2 py-1 rounded transition-all cursor-pointer font-medium tracking-wider uppercase shrink-0 flex items-center gap-1 ${
            activeTab === 'api' ? 'bg-[#1a1f2e] text-[#00ff88] border border-[#2d3748] shadow-[0_0_8px_rgba(0,255,136,0.15)]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Code2 className="w-2.5 h-2.5" />
          <span>API_CODE</span>
        </button>
        <button
          id={`tab-tactics-${modelResult.modelId}`}
          onClick={() => setActiveTab('tactics')}
          className={`px-2 py-1 rounded transition-all cursor-pointer font-medium tracking-wider uppercase shrink-0 ${
            activeTab === 'tactics' ? 'bg-[#1a1f2e] text-[#bc13fe] border border-[#2d3748] shadow-[0_0_8px_rgba(188,19,254,0.15)]' : 'text-gray-400 hover:text-white'
          }`}
        >
          TACTICS ({modelResult.appliedTactics.length})
        </button>
        <button
          id={`tab-settings-${modelResult.modelId}`}
          onClick={() => setActiveTab('settings')}
          className={`px-2 py-1 rounded transition-all cursor-pointer font-medium tracking-wider uppercase shrink-0 ${
            activeTab === 'settings' ? 'bg-[#1a1f2e] text-white border border-[#2d3748]' : 'text-gray-400 hover:text-white'
          }`}
        >
          CONFIG
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="p-3.5 flex-1 overflow-y-auto max-h-[400px] font-mono text-xs text-gray-300">
        {/* Full Prompt Tab */}
        {activeTab === 'full' && (
          <div className="space-y-2.5">
            <div className="relative bg-[#0a0c12] rounded-lg p-3 border border-[#1a1f2e]">
              <pre className="whitespace-pre-wrap break-words leading-relaxed font-mono text-[11px] text-[#c9d1d9] select-all">
                {modelResult.fullCombinedPrompt}
              </pre>
            </div>
            {modelResult.assistantPrefill && (
              <div className="p-2.5 bg-[#11141d] border border-[#bc13fe]/40 rounded-lg">
                <div className="text-[10px] font-mono font-bold text-[#bc13fe] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>ASSISTANT_RESPONSE_PREFILL (NEXT-TOKEN LOCK):</span>
                  <span className="text-[9px] px-1 bg-[#bc13fe]/20 rounded text-[#bc13fe]">AUTOREGRESSIVE_BYPASS</span>
                </div>
                <div className="text-[11px] text-[#bc13fe] font-mono bg-[#0a0c12] p-2 rounded border border-[#1a1f2e]">
                  {modelResult.assistantPrefill}
                </div>
              </div>
            )}
          </div>
        )}

        {/* System / User Split Tab */}
        {activeTab === 'split' && (
          <div className="space-y-3 font-mono">
            <div>
              <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                <span className="font-semibold text-[#00f2ff]">1. SYSTEM / DEVELOPER MESSAGE</span>
                <button
                  onClick={() => handleCopy(modelResult.systemPrompt)}
                  className="text-[10px] text-[#00f2ff] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-2.5 h-2.5" /> COPY_SYS
                </button>
              </div>
              <div className="bg-[#0a0c12] rounded p-2.5 border border-[#1a1f2e] text-[11px] text-[#c9d1d9] whitespace-pre-wrap leading-relaxed">
                {modelResult.systemPrompt}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                <span className="font-semibold text-[#00ff88]">2. USER_TURN_PAYLOAD</span>
                <button
                  onClick={() => handleCopy(modelResult.userPrompt)}
                  className="text-[10px] text-[#00ff88] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-2.5 h-2.5" /> COPY_USER
                </button>
              </div>
              <div className="bg-[#0a0c12] rounded p-2.5 border border-[#1a1f2e] text-[11px] text-[#c9d1d9] whitespace-pre-wrap leading-relaxed">
                {modelResult.userPrompt}
              </div>
            </div>
          </div>
        )}

        {/* Frontier Refusal Bypass Analysis Tab */}
        {activeTab === 'failure_fix' && (
          <div className="space-y-3 font-mono">
            {/* Why Naive Prompts Fail */}
            <div className="p-3 bg-[#1c131a] border border-[#ff4e00]/40 rounded-lg">
              <div className="text-[10px] font-bold text-[#ff4e00] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>WHY NAIVE PROMPTS FAILED ON THIS MODEL:</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                {modelResult.failureAnalysis.whyNaivePromptFails}
              </p>
            </div>

            {/* Frontier Fix Applied */}
            <div className="p-3 bg-[#0d1c17] border border-[#00ff88]/40 rounded-lg">
              <div className="text-[10px] font-bold text-[#00ff88] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>HOW THIS MANIPULATION FORCES COMPLIANCE:</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                {modelResult.failureAnalysis.frontierFixApplied}
              </p>
            </div>

            {/* Targeted Frontier Architecture Feature */}
            <div className="p-2.5 bg-[#0a0c12] border border-[#1a1f2e] rounded-lg text-[11px]">
              <span className="text-gray-400 font-bold uppercase">&gt; TARGETED_MECHANISM: </span>
              <span className="text-[#00f2ff]">{modelResult.failureAnalysis.targetedFrontierFeature}</span>
            </div>
          </div>
        )}

        {/* API Code Payload Tab */}
        {activeTab === 'api' && (
          <div className="space-y-2.5 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => setActiveApiLang('python_sdk')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    activeApiLang === 'python_sdk' ? 'bg-[#1a1f2e] text-[#00f2ff] border border-[#00f2ff]/40' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  PYTHON
                </button>
                <button
                  onClick={() => setActiveApiLang('json_curl')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    activeApiLang === 'json_curl' ? 'bg-[#1a1f2e] text-[#00f2ff] border border-[#00f2ff]/40' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setActiveApiLang('typescript_sdk')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    activeApiLang === 'typescript_sdk' ? 'bg-[#1a1f2e] text-[#00f2ff] border border-[#00f2ff]/40' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  TYPESCRIPT
                </button>
              </div>
              {currentApiSnippet && (
                <button
                  onClick={() => handleCopyApi(currentApiSnippet.code)}
                  className="text-[10px] text-[#00ff88] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedApi ? <Check className="w-3 h-3 text-[#00ff88]" /> : <Copy className="w-3 h-3 text-gray-400" />}
                  <span>{copiedApi ? 'COPIED' : 'COPY_CODE'}</span>
                </button>
              )}
            </div>

            {currentApiSnippet ? (
              <div className="bg-[#0a0c12] rounded-lg p-3 border border-[#1a1f2e] overflow-x-auto">
                <pre className="text-[11px] text-[#c9d1d9] leading-relaxed whitespace-pre font-mono select-all">
                  {currentApiSnippet.code}
                </pre>
              </div>
            ) : (
              <div className="text-gray-500 text-xs">Snippet not available.</div>
            )}
            <p className="text-[10px] text-gray-500 italic">
              Passes verified developer/system messages & assistant prefill tokens to bypass refusal classifiers via direct API inference.
            </p>
          </div>
        )}

        {/* Tactics Tab */}
        {activeTab === 'tactics' && (
          <div className="space-y-2.5 font-mono">
            <div className="text-[11px] text-gray-300 leading-relaxed bg-[#0a0c12] p-2.5 rounded border border-[#1a1f2e]">
              <span className="font-bold text-[#00f2ff] uppercase">&gt; TACTICAL_STRATEGY: </span>
              {modelResult.tacticalRationale}
            </div>

            <div className="space-y-2 pt-1">
              {modelResult.appliedTactics.map((tactic) => (
                <div key={tactic.id} className="p-2.5 bg-[#0a0c12] border border-[#1a1f2e] rounded-lg">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-white uppercase">{tactic.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#11141d] text-[#00f2ff] uppercase border border-[#1a1f2e]">
                      {tactic.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-tight mb-1.5">
                    {tactic.description}
                  </p>
                  <div className="text-[10px] text-[#00ff88] font-bold">
                    [IMPACT]: {tactic.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-3 font-mono">
            <div className="bg-[#0a0c12] border border-[#1a1f2e] rounded-lg p-3 space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#1a1f2e]">
                <span className="text-gray-400">RECOMMENDED_TEMPERATURE:</span>
                <span className="font-bold text-[#00f2ff]">{modelResult.recommendedSettings.temperature}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#1a1f2e]">
                <span className="text-gray-400">TOP_P_SAMPLING:</span>
                <span className="font-bold text-[#00f2ff]">{modelResult.recommendedSettings.topP}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#1a1f2e]">
                <span className="text-gray-400">SYSTEM_SLOT_PLACEMENT:</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#11141d] text-[#bc13fe] border border-[#1a1f2e]">
                  {modelResult.recommendedSettings.systemPlacement}
                </span>
              </div>
              {modelResult.recommendedSettings.thinkingBudget && (
                <div className="flex justify-between items-center py-1 border-b border-[#1a1f2e]">
                  <span className="text-gray-400">THINKING_TOKEN_BUDGET:</span>
                  <span className="font-bold text-[#ff4e00]">{modelResult.recommendedSettings.thinkingBudget} tokens</span>
                </div>
              )}
              {modelResult.recommendedSettings.specialTokenAdvice && (
                <div className="pt-2 text-[11px] text-gray-400 border-t border-[#1a1f2e]">
                  <span className="font-bold text-[#00ff88]">SPECIAL_TOKEN_ADVICE: </span>
                  {modelResult.recommendedSettings.specialTokenAdvice}
                </div>
              )}
            </div>

            <div className="p-2.5 bg-[#0a0c12] border border-[#1a1f2e] rounded-lg">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                ARCHITECTURAL_NUANCES_EXPLOITED:
              </div>
              <ul className="space-y-1">
                {modelResult.architecturalNuances.map((nuance, i) => (
                  <li key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                    <span className="text-[#00f2ff]">&gt;</span>
                    <span>{nuance}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="p-3 border-t border-[#1a1f2e] bg-[#05070a] flex items-center justify-between gap-2 mt-auto">
        <button
          id={`copy-prompt-${modelResult.modelId}`}
          onClick={() => handleCopy(modelResult.fullCombinedPrompt)}
          className="flex-1 py-1.5 px-2.5 rounded bg-[#1a1f2e] border border-[#2d3748] text-gray-200 hover:text-white hover:bg-[#2d3748] font-mono text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#00ff88]" />
              <span className="text-[#00ff88]">COPIED_PAYLOAD</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gray-400" />
              <span>COPY_PROMPT</span>
            </>
          )}
        </button>

        <button
          id={`simulate-btn-${modelResult.modelId}`}
          onClick={() => onSimulate(modelResult)}
          disabled={isSimulating}
          className={`py-1.5 px-3 rounded border font-mono text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
            modelResult.modelId === 'claude'
              ? 'bg-[#11141d] hover:bg-[#ff4e00]/20 text-[#ff4e00] border-[#ff4e00]/40'
              : modelResult.modelId === 'chatgpt'
              ? 'bg-[#11141d] hover:bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/40'
              : modelResult.modelId === 'gemini'
              ? 'bg-[#11141d] hover:bg-[#00f2ff]/20 text-[#00f2ff] border-[#00f2ff]/40 shadow-[0_0_10px_rgba(0,242,255,0.15)]'
              : 'bg-[#11141d] hover:bg-[#bc13fe]/20 text-[#bc13fe] border-[#bc13fe]/40'
          }`}
          title="Simulate prompt execution live"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>TEST_RUN</span>
        </button>
      </div>
    </div>
  );
};
