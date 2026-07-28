export interface AgentConfig {
  name: string;
  description?: string;
  model?: string;
  systemPrompt?: string;
  tools?: string[];
  enabled: boolean;
}

export interface ModelConfig {
  name: string;
  provider: string;
  apiKey?: string;
  baseUrl?: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  enabled: boolean;
}

export interface ToolConfig {
  name: string;
  description?: string;
  type: string;
  config?: Record<string, unknown>;
  enabled: boolean;
}

export interface AgentsConfig {
  agents: AgentConfig[];
  models: ModelConfig[];
  tools: ToolConfig[];
}
