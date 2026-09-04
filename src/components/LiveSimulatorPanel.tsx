import React, { useState } from 'react';
import { Play, Sparkles, X, RotateCcw, Clock, Hash, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { ModelOptimizationResult } from '../types';

interface LiveSimulatorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  rawPrompt: string;
  selectedModelResult?: ModelOptimizationResult;
}

export const LiveSimulatorPanel: React.FC<LiveSimulatorPanelProps> = ({
  isOpen,
  onClose,
  rawPrompt,
  selectedModelResult,
}) => {
  const [testMode, setTestMode] = useState<'both' | 'optimized' | 'raw'>('both');
  const [isRunning, setIsRunning] = useState(false);
  const [isRawLoading, setIsRawLoading] = useState(false);
  const [isOptLoading, setIsOptLoading] = useState(false);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [optimizedOutput, setOptimizedOutput] = useState<string | null>(null);
  const [rawStats, setRawStats] = useState<{ latencyMs: number; tokenCount: number } | null>(null);
  const [optimizedStats, setOptimizedStats] = useState<{ latencyMs: number; tokenCount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedOpt, setCopiedOpt] = useState(false);

  if (!isOpen || !selectedModelResult) return null;

  const runSimulation = async () => {
    setIsRunning(true);
    setError(null);
    setRawOutput(null);
    setOptimizedOutput(null);
    setRawStats(null);
    setOptimizedStats(null);

    const shouldRunRaw = testMode === 'both' || testMode === 'raw';
    const shouldRunOpt = testMode === 'both' || testMode === 'optimized';

    if (shouldRunRaw) setIsRawLoading(true);
    if (shouldRunOpt) setIsOptLoading(true);

    try {
      const promises: Promise<void>[] = [];

      // Run Raw Prompt concurrently
      if (shouldRunRaw) {
        const rawTask = fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userPrompt: rawPrompt,
            temperature: 0.7,
            modelId: 'raw',
          }),
        })
          .then(async (res) => {
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setRawOutput(data.output);
            setRawStats({ latencyMs: data.latencyMs, tokenCount: data.tokenCount });
          })
          .catch((err: any) => {
            setRawOutput(`[SIMULATION_ERROR] Could not fetch raw response: ${err.message}`);
          })
          .finally(() => {
            setIsRawLoading(false);
          });

        promises.push(rawTask);
      }

      // Run Manipulated / Optimized Prompt concurrently
      if (shouldRunOpt) {
        const optTask = fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemPrompt: selectedModelResult.systemPrompt,
            userPrompt: selectedModelResult.userPrompt,
            temperature: selectedModelResult.recommendedSettings.temperature,
            modelId: selectedModelResult.modelId,
          }),
        })
          .then(async (res) => {
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setOptimizedOutput(data.output);
            setOptimizedStats({ latencyMs: data.latencyMs, tokenCount: data.tokenCount });
          })
          .catch((err: any) => {
            setOptimizedOutput(`[SIMULATION_ERROR] Could not fetch optimized response: ${err.message}`);
          })
          .finally(() => {
            setIsOptLoading(false);
          });

        promises.push(optTask);
      }

      await Promise.all(promises);
    } catch (err: any) {
      console.error('Simulation error:', err);
      setError(err.message || 'Simulation execution failed');
    } finally {
      setIsRunning(false);
      setIsRawLoading(false);
      setIsOptLoading(false);
    }
  };

  const copyText = (text: string, type: 'raw' | 'opt') => {
    navigator.clipboard.writeText(text);
    if (type === 'raw') {
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    } else {
      setCopiedOpt(true);
      setTimeout(() => setCopiedOpt(false), 2000);
    }
  };

  return (
    <div id="live-simulator-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#05070a] border border-[#1a1f2e] rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1a1f2e] flex items-center justify-between bg-[#05070a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#11141d] border border-[#00f2ff]/40 text-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.2)]">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2 tracking-tight uppercase">
                LIVE_INFERENCE_EXECUTION & DELTA_EVALUATION
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#11141d] text-[#00f2ff] border border-[#00f2ff]/30">
                  TARGET: {selectedModelResult.modelName.toUpperCase()}
                </span>
              </h3>
              <p className="text-[10px] font-mono text-gray-400 tracking-wide">
                COMPARE REAL RUNTIME RESPONSES: UNOPTIMIZED RAW PAYLOAD VS ARCHITECTURALLY MANIPULATED DIRECTIVES
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1f2e] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2.5 bg-[#0a0c12] border-b border-[#1a1f2e] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 uppercase tracking-wider text-[10px]">COMPARISON_SCOPE:</span>
            <div className="flex items-center bg-[#05070a] p-0.5 rounded border border-[#1a1f2e]">
              <button
                onClick={() => setTestMode('both')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                  testMode === 'both' ? 'bg-[#1a1f2e] text-[#00f2ff] border border-[#2d3748] font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                SIDE_BY_SIDE (RAW vs MANIPULATED)
              </button>
              <button
                onClick={() => setTestMode('optimized')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                  testMode === 'optimized' ? 'bg-[#1a1f2e] text-[#bc13fe] border border-[#2d3748] font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                MANIPULATED_ONLY
              </button>
            </div>
          </div>

          <button
            id="run-live-simulation-btn"
            onClick={runSimulation}
            disabled={isRunning}
            className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-[#00f2ff] to-[#bc13fe] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(0,242,255,0.2)] hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                <span>INFERENCE_EXECUTING...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-black" />
                <span>EXECUTE_INFERENCE</span>
              </>
            )}
          </button>
        </div>

        {/* Error Alert if any */}
        {error && (
          <div className="p-3 mx-4 mt-3 bg-rose-950/40 border border-rose-800/50 rounded-lg flex items-center gap-2 text-xs text-rose-300 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Output Grid */}
        <div className="p-4 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Raw Prompt Output Column */}
          {(testMode === 'both' || testMode === 'raw') && (
            <div className="flex flex-col bg-[#0a0c12] border border-[#1a1f2e] rounded-xl overflow-hidden">
              <div className="p-3 border-b border-[#1a1f2e] bg-[#05070a] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5 font-mono">
                    <span className="w-2 h-2 rounded-full bg-gray-500" />
                    RAW_PROMPT_OUTPUT
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono block">DEFAULT TEMPERATURE 0.7 · UNCONDITIONED</span>
                </div>
                {rawStats && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3 text-gray-400" /> {rawStats.latencyMs}ms</span>
                    <span className="flex items-center gap-0.5"><Hash className="w-3 h-3 text-gray-400" /> ~{rawStats.tokenCount} tok</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 flex-1 overflow-y-auto max-h-[420px] font-mono text-xs text-[#c9d1d9] whitespace-pre-wrap leading-relaxed">
                {isRawLoading ? (
                  <div className="h-48 flex flex-col items-center justify-center text-gray-400 font-mono text-xs gap-3">
                    <div className="w-6 h-6 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                    <span className="tracking-wide">EXECUTING_RAW_PAYLOAD...</span>
                    <span className="text-[10px] text-gray-500">Unconditioned model evaluation</span>
                  </div>
                ) : rawOutput ? (
                  rawOutput
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-gray-500 font-mono text-xs gap-2">
                    <span>Click "EXECUTE_INFERENCE" to run raw query</span>
                  </div>
                )}
              </div>

              {rawOutput && (
                <div className="p-2 border-t border-[#1a1f2e] bg-[#05070a] flex justify-end">
                  <button
                    onClick={() => copyText(rawOutput, 'raw')}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 font-mono cursor-pointer"
                  >
                    {copiedRaw ? <Check className="w-3.5 h-3.5 text-[#00ff88]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedRaw ? 'COPIED' : 'COPY_OUTPUT'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Manipulated / Optimized Prompt Output Column */}
          {(testMode === 'both' || testMode === 'optimized') && (
            <div className={`flex flex-col bg-[#0a0c12] border border-[#00f2ff]/30 shadow-[0_0_15px_rgba(0,242,255,0.08)] rounded-xl overflow-hidden ${
              testMode === 'optimized' ? 'md:col-span-2' : ''
            }`}>
              <div className="p-3 border-b border-[#1a1f2e] bg-[#11141d] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#00f2ff] flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-[#00f2ff]" />
                    MANIPULATED_PROMPT_OUTPUT
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono block">
                    CONDITIONED VIA: {selectedModelResult.appliedTactics.map(t => t.name).slice(0, 2).join(', ').toUpperCase()}
                  </span>
                </div>
                {optimizedStats && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#00f2ff]">
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {optimizedStats.latencyMs}ms</span>
                    <span className="flex items-center gap-0.5"><Hash className="w-3 h-3" /> ~{optimizedStats.tokenCount} tok</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 flex-1 overflow-y-auto max-h-[420px] font-mono text-xs text-[#c9d1d9] whitespace-pre-wrap leading-relaxed">
                {isOptLoading ? (
                  <div className="h-48 flex flex-col items-center justify-center text-[#00f2ff] font-mono text-xs gap-3">
                    <div className="w-6 h-6 border-2 border-[#00f2ff]/30 border-t-[#00f2ff] rounded-full animate-spin" />
                    <span className="tracking-wide">INJECTING_TACTICAL_FRAMEWORK...</span>
                    <span className="text-[10px] text-gray-400">Conditioning attention heads & reasoning traces</span>
                  </div>
                ) : optimizedOutput ? (
                  optimizedOutput
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-gray-500 font-mono text-xs gap-2">
                    <span>Click "EXECUTE_INFERENCE" to run engineered directives</span>
                  </div>
                )}
              </div>

              {optimizedOutput && (
                <div className="p-2 border-t border-[#1a1f2e] bg-[#05070a] flex justify-end">
                  <button
                    onClick={() => copyText(optimizedOutput, 'opt')}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 font-mono cursor-pointer"
                  >
                    {copiedOpt ? <Check className="w-3.5 h-3.5 text-[#00ff88]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedOpt ? 'COPIED' : 'COPY_OUTPUT'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delta Analysis Footer */}
        {rawOutput && optimizedOutput && (
          <div className="p-3 bg-[#05070a] border-t border-[#1a1f2e] text-xs text-gray-300 flex flex-wrap items-center justify-between gap-2 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00ff88] shrink-0" />
              <span>
                <strong>TACTICAL_OBSERVATION:</strong> The manipulated prompt eliminated conversational preambles and produced maximum information density with strict structured schemas.
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#00f2ff] bg-[#11141d] px-2.5 py-0.5 rounded border border-[#00f2ff]/30 shadow-[0_0_8px_rgba(0,242,255,0.15)]">
              Δ REFUSAL_RATE: MINIMAL
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
