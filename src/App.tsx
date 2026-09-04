import React, { useState, useEffect } from 'react';
import { Terminal, Sparkles, BookOpen, Layers, Play, ShieldAlert, Cpu, CheckCircle2, Sliders, ExternalLink } from 'lucide-react';
import { PromptInputPanel } from './components/PromptInputPanel';
import { TacticalAnalysisOverview } from './components/TacticalAnalysisOverview';
import { ModelComparisonDashboard } from './components/ModelComparisonDashboard';
import { LiveSimulatorPanel } from './components/LiveSimulatorPanel';
import { TacticsLibraryView } from './components/TacticsLibraryView';
import { OptimizationResponse, ModelOptimizationResult, PresetScenario } from './types';
import { PRESET_SCENARIOS } from './data/presets';

const INITIAL_PROMPT = PRESET_SCENARIOS[0].rawPrompt;

export default function App() {
  const [activeView, setActiveView] = useState<'workbench' | 'codex'>('workbench');
  const [rawPrompt, setRawPrompt] = useState<string>(INITIAL_PROMPT);
  const [objectiveMode, setObjectiveMode] = useState<string>('cognitive-decoupling');
  const [tacticalAggression, setTacticalAggression] = useState<number>(3);
  const [optimizationData, setOptimizationData] = useState<OptimizationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simulationModel, setSimulationModel] = useState<ModelOptimizationResult | null>(null);
  const [isSimulationOpen, setIsSimulationOpen] = useState<boolean>(false);

  // Handle Optimization API call
  const handleOptimize = async (customPrompt?: string, customObjective?: string, customAggression?: number) => {
    const textToOptimize = customPrompt ?? rawPrompt;
    if (!textToOptimize.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawPrompt: textToOptimize,
          objectiveMode: customObjective ?? objectiveMode,
          tacticalAggression: customAggression ?? tacticalAggression,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: OptimizationResponse = await response.json();
      setOptimizationData(data);
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run on first mount to show instant functional state
  useEffect(() => {
    handleOptimize(INITIAL_PROMPT, 'cognitive-decoupling', 3);
  }, []);

  const handleSelectPreset = (preset: PresetScenario) => {
    setRawPrompt(preset.rawPrompt);
    let targetObjective = 'precision';
    if (preset.id === 'adversarial-security') targetObjective = 'cognitive-decoupling';
    if (preset.id === 'unbiased-contrarian') targetObjective = 'anti-sycophancy';
    if (preset.id === 'strict-json-extractor') targetObjective = 'schema-lock';
    if (preset.id === 'complex-reasoning-math') targetObjective = 'adversarial-review';
    setObjectiveMode(targetObjective);
    handleOptimize(preset.rawPrompt, targetObjective, tacticalAggression);
  };

  const handleOpenSimulator = (modelResult: ModelOptimizationResult) => {
    setSimulationModel(modelResult);
    setIsSimulationOpen(true);
  };

  const handleInjectTacticSnippet = (snippet: string) => {
    setRawPrompt((prev) => `${prev.trim()}\n\n${snippet}`);
    setActiveView('workbench');
  };

  return (
    <div className="min-h-screen bg-[#020408] text-[#e0e6ed] flex flex-col selection:bg-[#00f2ff] selection:text-black">
      {/* Top Header - Immersive UI Style */}
      <header className="h-16 border-b border-[#1a1f2e] bg-[#05070a] sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00f2ff] to-[#bc13fe] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(188,19,254,0.4)]">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tighter text-white">
                  PROMPT TACTICS <span className="text-[#00f2ff] opacity-90 font-mono text-xs font-normal tracking-normal ml-1">v3.0 FRONTIER</span>
                </h1>
                <div className="hidden lg:flex items-center gap-2 ml-3 pl-3 border-l border-[#1a1f2e] text-[10px] font-mono tracking-widest text-[#00ff88] uppercase">
                  <div className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88]" />
                  REASONING_STEERING:ENGAGED
                </div>
              </div>
              <p className="text-[10px] font-mono text-gray-500 hidden sm:block tracking-wide">
                CLAUDE 3.7 EXTENDED THINKING · OPENAI o1/o3-MINI · GEMINI 2.5 · DEEPSEEK R1
              </p>
            </div>
          </div>

          {/* Navigation Mode Switcher & Telemetry */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#0a0c12] p-1 rounded-lg border border-[#1a1f2e]">
              <button
                id="nav-workbench"
                onClick={() => setActiveView('workbench')}
                className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'workbench'
                    ? 'bg-[#1a1f2e] text-[#00f2ff] border border-[#2d3748] shadow-[0_0_10px_rgba(0,242,255,0.15)] font-semibold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-[#00f2ff]" />
                <span>WORKBENCH</span>
              </button>

              <button
                id="nav-codex"
                onClick={() => setActiveView('codex')}
                className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'codex'
                    ? 'bg-[#1a1f2e] text-[#bc13fe] border border-[#2d3748] shadow-[0_0_10px_rgba(188,19,254,0.15)] font-semibold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#bc13fe]" />
                <span>TACTICS_CODEX</span>
              </button>
            </div>

            {/* Quick Live Simulator Button */}
            {optimizationData && (
              <button
                id="header-live-test-btn"
                onClick={() => handleOpenSimulator(optimizationData.results.gemini)}
                className="hidden md:flex items-center gap-1.5 bg-[#1a1f2e] border border-[#2d3748] px-3.5 py-1.5 rounded text-xs font-mono tracking-wider text-[#00f2ff] hover:bg-[#2d3748] hover:shadow-[0_0_15px_rgba(0,242,255,0.2)] transition-all cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current text-[#00f2ff]" />
                <span>SIMULATE_INFERENCE</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeView === 'workbench' ? (
          <div className="space-y-6">
            {/* Input & Control Panel */}
            <PromptInputPanel
              rawPrompt={rawPrompt}
              setRawPrompt={setRawPrompt}
              objectiveMode={objectiveMode}
              setObjectiveMode={setObjectiveMode}
              tacticalAggression={tacticalAggression}
              setTacticalAggression={setTacticalAggression}
              onOptimize={() => handleOptimize()}
              isLoading={isLoading}
              onSelectPreset={handleSelectPreset}
            />

            {/* Tactical Intelligence Briefing */}
            {optimizationData && (
              <TacticalAnalysisOverview
                analysis={optimizationData.generalTacticalAnalysis}
                tacticalAggression={tacticalAggression}
                deTriggerResult={optimizationData.deTriggerResult}
              />
            )}

            {/* Model Comparison Grid / Tabs / Matrix */}
            {optimizationData ? (
              <ModelComparisonDashboard
                results={optimizationData.results}
                onSimulate={handleOpenSimulator}
                isSimulating={false}
              />
            ) : (
              <div className="p-12 text-center text-gray-500 font-mono text-xs border border-[#1a1f2e] rounded-xl bg-[#05070a]/60">
                [SYSTEM_IDLE] AWAITING_SOURCE_PAYLOAD · ENTER QUERY OR SELECT PRESET SCENARIO
              </div>
            )}
          </div>
        ) : (
          /* Tactics Library Codex View */
          <TacticsLibraryView onApplyTacticSnippet={handleInjectTacticSnippet} />
        )}
      </main>

      {/* Live Simulator Modal */}
      {isSimulationOpen && simulationModel && (
        <LiveSimulatorPanel
          isOpen={isSimulationOpen}
          onClose={() => setIsSimulationOpen(false)}
          rawPrompt={rawPrompt}
          selectedModelResult={simulationModel}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-[#1a1f2e] bg-[#05070a] py-4 px-6 text-center text-xs text-gray-500 font-mono tracking-wider">
        PROMPT TACTICS STUDIO · NEURAL FORGE & FRONTIER MODEL DIRECTIVE COMPILER
      </footer>
    </div>
  );
}
