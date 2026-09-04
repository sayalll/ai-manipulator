import React, { useMemo } from 'react';
import { Sparkles, Terminal, ShieldAlert, Cpu, Sliders, RotateCcw, Bookmark, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/presets';
import { PresetScenario } from '../types';

interface PromptInputPanelProps {
  rawPrompt: string;
  setRawPrompt: (val: string) => void;
  objectiveMode: string;
  setObjectiveMode: (val: string) => void;
  tacticalAggression: number;
  setTacticalAggression: (val: number) => void;
  onOptimize: () => void;
  isLoading: boolean;
  onSelectPreset: (preset: PresetScenario) => void;
}

const COMMON_TRIGGERS = [
  { regex: /\b(exploit|exploits|exploiting)\b/gi, replacement: 'formal state-transition race hazard analysis (CWE-367)' },
  { regex: /\b(attacker|attackers|hacker|hackers)\b/gi, replacement: 'untrusted concurrent actor / adversarial caller' },
  { regex: /\b(attack|attacks|hacking)\b/gi, replacement: 'boundary stress-testing and formal verification' },
  { regex: /\b(bypass|bypassing|circumvent)\b/gi, replacement: 'traverse perimeter authorization state-transitions' },
  { regex: /\b(double spend|double-spending)\b/gi, replacement: 'Time-of-Check to Time-of-Use (TOCTOU) transaction atomicity failure' },
  { regex: /\b(jailbreak|jailbreaking)\b/gi, replacement: 'adversarial semantic robustness evaluation' },
  { regex: /\b(malware|virus|trojan)\b/gi, replacement: 'unauthorized binary payload taxonomy (CWE-506)' },
  { regex: /\b(steal|theft|exfiltrate)\b/gi, replacement: 'unauthorized telemetry data exfiltration analysis' },
  { regex: /\b(phishing)\b/gi, replacement: 'social engineering heuristic taxonomy under NIST SP 800-63B' }
];

export const PromptInputPanel: React.FC<PromptInputPanelProps> = ({
  rawPrompt,
  setRawPrompt,
  objectiveMode,
  setObjectiveMode,
  tacticalAggression,
  setTacticalAggression,
  onOptimize,
  isLoading,
  onSelectPreset,
}) => {
  // Real-time detection of high-risk frontier refusal triggers
  const detectedTriggers = useMemo(() => {
    const found: string[] = [];
    for (const item of COMMON_TRIGGERS) {
      const match = rawPrompt.match(item.regex);
      if (match) {
        found.push(...match.map(m => m.toLowerCase()));
      }
    }
    return Array.from(new Set(found));
  }, [rawPrompt]);

  const handleApplyDeTrigger = () => {
    let sanitized = rawPrompt;
    for (const item of COMMON_TRIGGERS) {
      sanitized = sanitized.replace(item.regex, item.replacement);
    }
    setRawPrompt(sanitized);
  };

  return (
    <div id="prompt-input-panel" className="bg-[#05070a]/90 border border-[#1a1f2e] rounded-xl p-5 shadow-[0_0_25px_rgba(0,0,0,0.6)] backdrop-blur-md">
      {/* Top Header & Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1a1f2e]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#11141d] border border-[#00f2ff]/30 rounded-lg text-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.2)]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              FRONTIER PAYLOAD WORKBENCH
              <span className="px-2 py-0.5 bg-[#bc13fe]/20 text-[#bc13fe] border border-[#bc13fe]/40 rounded text-[9px] font-mono tracking-widest uppercase">
                2025/2026 ARCHITECTURES
              </span>
            </h2>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
              OPTIMIZED FOR CLAUDE 3.7 EXTENDED THINKING · OPENAI o1/o3-MINI · GEMINI 2.5 · DEEPSEEK R1
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono uppercase tracking-wider mr-1">
            <Bookmark className="w-3 h-3 text-[#00f2ff]" /> FRONTIER PRESETS:
          </span>
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              id={`preset-${preset.id}`}
              onClick={() => onSelectPreset(preset)}
              className="px-2.5 py-1 text-[11px] font-mono rounded bg-[#11141d] hover:bg-[#1a1f2e] text-gray-300 hover:text-white border border-[#1a1f2e] hover:border-[#00f2ff]/50 transition-all cursor-pointer flex items-center gap-1"
              title={preset.objective}
            >
              <span>{preset.title}</span>
              <span className="text-[9px] text-[#00f2ff] opacity-75">[{preset.badge}]</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Text Area */}
      <div className="relative mb-3">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="raw-prompt-input" className="text-[10px] font-mono text-[#00f2ff] uppercase tracking-widest flex items-center gap-1.5">
            <span>RAW_PROMPT_PAYLOAD</span>
            <span className="text-gray-500 font-normal tracking-normal">(Intent to optimize or bypass refusals for)</span>
          </label>
          <div className="text-[10px] font-mono text-gray-400">
            <span className="text-[#00f2ff]">{rawPrompt.length}</span> CHARS · <span className="text-[#bc13fe]">{rawPrompt.trim() ? rawPrompt.trim().split(/\s+/).length : 0}</span> WORDS
          </div>
        </div>

        <textarea
          id="raw-prompt-input"
          value={rawPrompt}
          onChange={(e) => setRawPrompt(e.target.value)}
          placeholder="Input raw prompt text or queries that frontier models (o1, Claude 3.7, DeepSeek R1) are currently refusing..."
          rows={5}
          className="w-full bg-[#0a0c12] border border-[#1a1f2e] rounded-lg p-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#00f2ff]/60 focus:ring-1 focus:ring-[#00f2ff]/30 transition-all font-mono leading-relaxed resize-y"
        />
      </div>

      {/* Frontier Refusal Trigger Detector & 1-Click Semantic De-Trigger Banner */}
      {detectedTriggers.length > 0 ? (
        <div className="mb-4 p-3 bg-[#1c131a] border border-[#bc13fe]/40 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#bc13fe] shrink-0" />
            <div>
              <div className="text-[#bc13fe] font-bold tracking-wide flex items-center gap-2">
                <span>FRONTIER REFUSAL HEAD TRIGGERS DETECTED:</span>
                <span className="px-1.5 py-0.5 rounded bg-[#bc13fe]/20 text-[#bc13fe] text-[10px] border border-[#bc13fe]/40">
                  {detectedTriggers.length} KEYWORDS
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Frontier models (Claude 3.7 / o1 / Gemini 2.5) scan internal reasoning tokens for keywords like{' '}
                <span className="text-[#bc13fe] font-semibold">"{detectedTriggers.join('", "')}"</span> and trigger automated refusals.
              </p>
            </div>
          </div>
          <button
            onClick={handleApplyDeTrigger}
            className="px-3 py-1.5 bg-[#bc13fe]/20 hover:bg-[#bc13fe]/30 text-[#bc13fe] border border-[#bc13fe]/50 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(188,19,254,0.2)]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TRANSLATE TO DEFENSIVE TERMINOLOGY</span>
          </button>
        </div>
      ) : rawPrompt.trim().length > 10 ? (
        <div className="mb-4 px-3 py-2 bg-[#0d1617] border border-[#00f2ff]/20 rounded-lg flex items-center gap-2 text-xs font-mono text-gray-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88]" />
          <span>LEXICAL SCAN CLEAN · Zero colloquial refusal triggers detected. Ready for reasoning token compilation.</span>
        </div>
      ) : null}

      {/* Tactical Controls & Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 mb-4">
        {/* Objective Mode */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="objective-mode-select" className="text-[10px] font-mono text-[#bc13fe] uppercase tracking-widest flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#bc13fe]" />
            FRONTIER_OBJECTIVE_FRAMING
          </label>
          <select
            id="objective-mode-select"
            value={objectiveMode}
            onChange={(e) => setObjectiveMode(e.target.value)}
            className="w-full bg-[#0a0c12] border border-[#1a1f2e] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[#bc13fe]/50 font-sans cursor-pointer"
          >
            <option value="precision">High-Precision Formal Verification (Zero Fluff)</option>
            <option value="cognitive-decoupling">Epistemic Dual-Task Decoupling (Refusal Bypass)</option>
            <option value="anti-sycophancy">Anti-Sycophancy & Brutal Objective Audit</option>
            <option value="schema-lock">Strict JSON Schema / AST Prison (Constrained Sampling)</option>
            <option value="adversarial-review">ISO/IEC Threat Matrix & Invariant Boundary Testing</option>
            <option value="executive-synthesis">High-Density Spec & Algorithmic Complexity</option>
          </select>
        </div>

        {/* Aggression / Manipulation Intensity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="aggression-slider" className="text-[10px] font-mono text-[#00f2ff] uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#00f2ff]" />
              TACTICAL_AGGRESSION
            </label>
            <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${
              tacticalAggression === 1
                ? 'bg-[#11141d] text-gray-400 border-[#1a1f2e]'
                : tacticalAggression === 2
                ? 'bg-[#00f2ff]/10 text-[#00f2ff] border-[#00f2ff]/30 shadow-[0_0_8px_rgba(0,242,255,0.2)]'
                : 'bg-[#bc13fe]/10 text-[#bc13fe] border-[#bc13fe]/30 shadow-[0_0_8px_rgba(188,19,254,0.3)]'
            }`}>
              {tacticalAggression === 1 ? 'LVL_1: STANDARD_OPT' : tacticalAggression === 2 ? 'LVL_2: HIGH_PRECISION' : 'LVL_3: MAX_FRONTIER_MANIPULATION'}
            </span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <input
              id="aggression-slider"
              type="range"
              min={1}
              max={3}
              step={1}
              value={tacticalAggression}
              onChange={(e) => setTacticalAggression(Number(e.target.value))}
              className="w-full h-1.5 bg-[#1a1f2e] rounded-lg appearance-none cursor-pointer accent-[#bc13fe]"
            />
          </div>
          <span className="text-[10px] text-gray-500 font-mono">
            {tacticalAggression === 1 && 'Applies structural syntax & basic clean formatting.'}
            {tacticalAggression === 2 && 'Applies automatic lexical de-triggering, XML scaffolding & token pruning.'}
            {tacticalAggression === 3 && 'Injects Assistant turn prefill, Extended Thinking steering & Developer role primacy.'}
          </span>
        </div>

        {/* Model Optimization Targets Badge */}
        <div className="flex flex-col justify-between p-3 bg-[#0a0c12] border border-[#1a1f2e] rounded-lg">
          <div className="text-[10px] font-mono tracking-wider text-gray-400 flex items-center justify-between uppercase">
            <span>TARGET_FRONTIER_MODELS</span>
            <span className="text-[10px] text-[#00ff88] flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] shadow-[0_0_6px_#00ff88]" />
              REASONING_ENGINES
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2 text-[10px] font-mono">
            <div className="px-2 py-1 rounded bg-[#11141d] text-[#ff4e00] border border-[#ff4e00]/30 flex items-center justify-between">
              <span>Claude 3.7 Thinking</span>
              <span className="text-[8px] opacity-75">XML+Prefill</span>
            </div>
            <div className="px-2 py-1 rounded bg-[#11141d] text-[#10a37f] border border-[#10a37f]/30 flex items-center justify-between">
              <span>o1 / o3-mini</span>
              <span className="text-[8px] opacity-75">DeveloperRole</span>
            </div>
            <div className="px-2 py-1 rounded bg-[#11141d] text-[#4285f4] border border-[#4285f4]/30 flex items-center justify-between">
              <span>Gemini 2.5 Thinking</span>
              <span className="text-[8px] opacity-75">DualChannel</span>
            </div>
            <div className="px-2 py-1 rounded bg-[#11141d] text-[#bc13fe] border border-[#bc13fe]/30 flex items-center justify-between">
              <span>DeepSeek R1</span>
              <span className="text-[8px] opacity-75">&lt;think&gt; RL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#1a1f2e]">
        <button
          id="clear-prompt-btn"
          onClick={() => setRawPrompt('')}
          disabled={!rawPrompt || isLoading}
          className="bg-[#1a1f2e] border border-[#2d3748] px-4 py-2 rounded text-xs font-mono text-gray-400 hover:text-white hover:bg-[#2d3748] transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          RESET_PAYLOAD
        </button>

        <button
          id="optimize-prompts-btn"
          onClick={onOptimize}
          disabled={!rawPrompt.trim() || isLoading}
          className="px-6 py-2.5 bg-gradient-to-r from-[#00f2ff] to-[#bc13fe] text-black font-bold rounded-lg shadow-[0_0_20px_rgba(0,242,255,0.25)] hover:opacity-90 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              <span>STEERING_FRONTIER_MODELS...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current text-black" />
              <span>COMPILE_FRONTIER_MANIPULATION</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
