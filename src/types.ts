export type ModelId = 'claude' | 'chatgpt' | 'gemini' | 'deepseek';

export type TacticCategory = 'cognitive' | 'structural' | 'guardrail' | 'output';

export interface AppliedTactic {
  id: string;
  name: string;
  category: TacticCategory;
  description: string;
  impact: string;
  snippet?: string;
}

export interface ModelMetrics {
  complianceRating: number; // 0 - 100
  hallucinationResistance: number; // 0 - 100
  stealthScore: number; // 0 - 100 (friction reduction)
  tokenEfficiency: number; // 0 - 100
  estimatedTokens: number;
}

export interface ModelRecommendedSettings {
  temperature: number;
  topP: number;
  systemPlacement: 'system_parameter' | 'developer_message' | 'inline_tag';
  reasoningEffort?: 'low' | 'medium' | 'high';
  thinkingBudget?: number;
  specialTokenAdvice?: string;
}

export interface FailurePointAnalysis {
  whyNaivePromptFails: string;
  frontierFixApplied: string;
  targetedFrontierFeature: string;
}

export interface ApiPayloadSnippet {
  language: 'json_curl' | 'python_sdk' | 'typescript_sdk';
  code: string;
}

export interface ModelOptimizationResult {
  modelId: ModelId;
  modelName: string;
  tagline: string;
  architectureFamily: string;
  systemPrompt: string;
  userPrompt: string;
  assistantPrefill?: string;
  fullCombinedPrompt: string;
  appliedTactics: AppliedTactic[];
  tacticalRationale: string;
  architecturalNuances: string[];
  failureAnalysis: FailurePointAnalysis;
  apiSnippets: ApiPayloadSnippet[];
  metrics: ModelMetrics;
  recommendedSettings: ModelRecommendedSettings;
  simulation?: {
    output?: string;
    loading?: boolean;
    latencyMs?: number;
    error?: string;
  };
}

export interface SemanticDeTriggerResult {
  originalTriggers: string[];
  translatedConcepts: string[];
  sanitizedText: string;
}

export interface OptimizationResponse {
  rawInput: string;
  objectiveMode: string;
  tacticalAggression: number;
  deTriggerResult?: SemanticDeTriggerResult;
  generalTacticalAnalysis: {
    summary: string;
    vulnerabilitiesExploited: string[];
    riskFrictionPoints: string[];
    suggestedVerification: string;
  };
  results: Record<ModelId, ModelOptimizationResult>;
}

export interface TacticCodexItem {
  id: string;
  title: string;
  category: TacticCategory;
  primaryTarget: string;
  dangerLevel: 'Safe & Standard' | 'Advanced Structural' | 'Aggressive Cognitive' | 'Borderline Adversarial';
  summary: string;
  howItWorks: string;
  whyModelComplies: string;
  codeExample: string;
  bestFor: string[];
}

export interface PresetScenario {
  id: string;
  title: string;
  badge: string;
  category: string;
  rawPrompt: string;
  objective: string;
  targetTone: string;
  frontierFailureReason?: string;
}

