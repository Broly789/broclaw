import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AgentConfigSchema = z.object({
  name: z.string().min(1, '请输入 Agent 名称'),
  description: z.string().optional(),
  model: z.string().optional(),
  systemPrompt: z.string().optional(),
  tools: z.array(z.string()).optional(),
  enabled: z.boolean(),
});

export const ModelConfigSchema = z.object({
  name: z.string().min(1),
  provider: z.string().min(1),
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  modelName: z.string().optional(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
  enabled: z.boolean(),
});

export const ToolConfigSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.string().min(1),
  config: z.record(z.string(), z.unknown()).optional(),
  enabled: z.boolean(),
});

export const SaveConfigSchema = z.object({
  agents: z.array(AgentConfigSchema).optional(),
  models: z.array(ModelConfigSchema).optional(),
  tools: z.array(ToolConfigSchema).optional(),
});

export class AgentConfigDto extends createZodDto(AgentConfigSchema) {}
export class ModelConfigDto extends createZodDto(ModelConfigSchema) {}
export class ToolConfigDto extends createZodDto(ToolConfigSchema) {}
export class SaveConfigDto extends createZodDto(SaveConfigSchema) {}