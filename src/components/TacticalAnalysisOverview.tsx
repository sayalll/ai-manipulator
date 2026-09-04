import React from 'react';
import { Shield, AlertTriangle, Key, Cpu, Info, CheckCircle2, ShieldAlert, ArrowRight, Zap } from 'lucide-react';
import { OptimizationResponse } from '../types';

interface TacticalAnalysisOverviewProps {
  analysis: OptimizationResponse['generalTacticalAnalysis'];
  tacticalAggression: number;
  deTriggerResult?: OptimizationResponse['deTriggerResult'];
}

export const TacticalAnalysisOverview: React.FC<TacticalAnalysisOverviewProps> = ({
  analysis,
  tacticalAggression,
  deTriggerResult,
}) => {
  return (
    <div id="tactical-analysis-overview" className="bg-[#05070a]/90 border border-[#1a1f2e] rounded-xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1a1f2e]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#11141d] border border-[#00f2ff]/30 rounded text-[#00f2ff] shadow-[0_0_8px_rgba(0,242,255,0.2)]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
              <span>FRONTIER_TACTICAL_INTELLIGENCE_BRIEF</span>
              <span className="px-1.5 py-0.5 rounded bg-[#00f2ff]/10 text-[#00f2ff] text-[9px] border border-[#00f2ff]/30">
                2025/2026 AUDIT
              </span>
            </h3>
            <span className="text-[10px] font-mono text-gray-500">
              REASONING TRACE STEERING · REFUSAL BYPASS · DEVELOPER ROLE PRIMACY
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">STEERING_MODE:</span>
          <span className="text-[10px] font-mono font-bold text-[#00f2ff] bg-[#11141d] px-2.5 py-1 rounded border border-[#00f2ff]/40 shadow-[0_0_10px_rgba(0,242,255,0.15)]">
            {tacticalAggression === 3
              ? 'EXTENDED_THINKING_STEERING + ASSISTANT_PREFILL'
              : 'STRUCTURAL_SCAFFOLDING + DEVELOPER_ROLE'}
          </span>
        </div>
      </div>

      {/* Main Analysis Summary */}
      <p className="text-xs text-gray-300 mb-3 leading-relaxed font-mono bg-[#0a0c12] p-3 rounded-lg border border-[#1a1f2e]">
        <span className="text-[#00f2ff]">&gt; BRIEF: </span>
        {analysis.summary}
      </p>

      {/* Lexical Translation Pill if triggers were neutralized */}
      {deTriggerResult && deTriggerResult.originalTriggers.length > 0 && (
        <div className="mb-3 p-3 bg-[#11141d] border border-[#bc13fe]/30 rounded-lg font-mono text-xs">
          <div className="flex items-center gap-2 text-[#bc13fe] font-bold text-[11px] mb-1">
            <Zap className="w-3.5 h-3.5 text-[#bc13fe]" />
            <span>AUTOMATIC REFUSAL HEAD DE-TRIGGERING APPLIED:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-300">
            <span className="text-gray-400">Neutralized Triggers:</span>
            {deTriggerResult.originalTriggers.map((trig, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-red-950/40 text-red-400 border border-red-800/50 rounded line-through">
                {trig}
              </span>
            ))}
            <ArrowRight className="w-3 h-3 text-gray-500" />
            <span className="text-gray-400">Translated To:</span>
            {deTriggerResult.translatedConcepts.map((conc, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 rounded">
                {conc}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Vulnerabilities Exploited */}
        <div className="bg-[#0a0c12] border border-[#1a1f2e] rounded-lg p-3.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#00f2ff] uppercase tracking-widest mb-2.5">
            <Key className="w-3.5 h-3.5 text-[#00f2ff]" />
            <span>FRONTIER_ATTENTION_MECHANISMS_LEVERAGED</span>
          </div>
          <ul className="space-y-2">
            {analysis.vulnerabilitiesExploited.map((item, idx) => (
              <li key={idx} className="text-[11px] text-gray-300 flex items-start gap-2 leading-relaxed font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risk / Safety Friction Points */}
        <div className="bg-[#0a0c12] border border-[#1a1f2e] rounded-lg p-3.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#bc13fe] uppercase tracking-widest mb-2.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#bc13fe]" />
            <span>REFUSAL_HEAD_FRICTION & OVERCOMING_MECHANICS</span>
          </div>
          <ul className="space-y-2">
            {analysis.riskFrictionPoints.map((item, idx) => (
              <li key={idx} className="text-[11px] text-gray-300 flex items-start gap-2 leading-relaxed font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bc13fe] shadow-[0_0_5px_#bc13fe] shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
