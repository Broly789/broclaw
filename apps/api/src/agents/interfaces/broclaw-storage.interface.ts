export interface BroclawMeta {
  version: string;
  updatedAt: string;
}

export interface BroclawStorage {
  meta?: BroclawMeta;
  models?: BroclawModels;
  agents?: BroclawAgents;
  tools?: BroclawTools;
}

export interface BroclawModels {
  providers: Record<string, ProviderConfig>;
}

export interface ProviderConfig {
  baseUrl: string;
  apiKey?: string;
  api?: string;
  auth?: string;
  models: StoredModel[];
}

export interface StoredModel {
  id: string;
  name: string;
  temperature?: number;
  maxTokens?: number;
  contextWindow?: number;
  enabled: boolean;
}

export interface BroclawAgents {
  list: StoredAgent[];
  defaults?: AgentDefaults;
}

export interface StoredAgent {
  name: string;
  description?: string;
  model?: string;
  systemPrompt?: string;
  tools?: string[];
  enabled: boolean;
}

export interface AgentDefaults {
  systemPrompt?: string;
  maxConcurrent?: number;
}

export interface BroclawTools {
  custom: StoredTool[];
}

export interface StoredTool {
  name: string;
  description?: string;
  type: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}