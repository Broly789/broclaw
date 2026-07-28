import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type {
  AgentConfig,
  AgentsConfig,
  ModelConfig,
  ToolConfig,
} from './interfaces/agents-config.interface';
import type {
  BroclawStorage,
  ProviderConfig,
  StoredAgent,
} from './interfaces/broclaw-storage.interface';

const STORAGE_VERSION = '0.1.0';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);
  private readonly filePath: string;

  constructor() {
    const dir = join(homedir(), '.broclaw');
    mkdirSync(dir, { recursive: true });
    this.filePath = join(dir, 'broclaw.json');
  }

  getConfig(): AgentsConfig {
    const storage = this.readStorage();
    return this.toFlat(storage);
  }

  saveConfig(partial: Partial<AgentsConfig>): AgentsConfig {
    const storage = this.readStorage();

    if (partial.models !== undefined) {
      storage.models = {
        providers: this.groupModelsByProvider(partial.models),
      };
    }
    if (partial.agents !== undefined) {
      storage.agents = {
        list: this.toStoredAgents(partial.agents, storage.models?.providers),
        defaults: storage.agents?.defaults,
      };
    }
    if (partial.tools !== undefined) {
      storage.tools = {
        custom: partial.tools.map((t) => ({
          name: t.name,
          description: t.description,
          type: t.type,
          enabled: t.enabled,
          config: t.config,
        })),
      };
    }

    storage.meta = {
      version: STORAGE_VERSION,
      updatedAt: new Date().toISOString(),
    };
    this.writeStorage(storage);
    return this.toFlat(storage);
  }

  private readStorage(): BroclawStorage {
    try {
      if (!existsSync(this.filePath)) {
        this.logger.warn('broclaw.json not found, initializing with defaults');
        return this.defaultStorage();
      }
      const raw = readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw) as BroclawStorage;
      return this.ensureSections(parsed);
    } catch (err) {
      this.logger.error('Failed to read broclaw.json', err);
      return this.defaultStorage();
    }
  }

  private writeStorage(storage: BroclawStorage): void {
    try {
      writeFileSync(this.filePath, JSON.stringify(storage, null, 2), 'utf-8');
    } catch (err) {
      this.logger.error('Failed to write broclaw.json', err);
      throw new InternalServerErrorException('Failed to save configuration');
    }
  }

  private defaultStorage(): BroclawStorage {
    return {
      meta: { version: STORAGE_VERSION, updatedAt: new Date().toISOString() },
      models: { providers: {} },
      agents: { list: [] },
      tools: { custom: [] },
    };
  }

  private ensureSections(storage: BroclawStorage): BroclawStorage {
    if (!storage.models) storage.models = { providers: {} };
    if (!storage.models.providers) storage.models.providers = {};
    if (!storage.agents) storage.agents = { list: [] };
    if (!storage.agents.list) storage.agents.list = [];
    if (!storage.tools) storage.tools = { custom: [] };
    if (!storage.tools.custom) storage.tools.custom = [];
    return storage;
  }

  private toFlat(storage: BroclawStorage): AgentsConfig {
    const models: ModelConfig[] = [];
    if (storage.models?.providers) {
      for (const [providerName, provider] of Object.entries(
        storage.models.providers,
      )) {
        for (const m of provider.models) {
          models.push({
            name: m.name,
            provider: providerName,
            apiKey: provider.apiKey,
            baseUrl: provider.baseUrl,
            modelName: m.id,
            temperature: m.temperature,
            maxTokens: m.maxTokens,
            enabled: m.enabled,
          });
        }
      }
    }

    const agents: AgentConfig[] = (storage.agents?.list ?? []).map((a) => ({
      name: a.name,
      description: a.description,
      model: a.model?.includes('/') ? a.model.split('/')[1] : a.model,
      systemPrompt: a.systemPrompt,
      tools: a.tools,
      enabled: a.enabled,
    }));

    const tools: ToolConfig[] = (storage.tools?.custom ?? []).map((t) => ({
      name: t.name,
      description: t.description,
      type: t.type,
      config: t.config,
      enabled: t.enabled,
    }));

    return { agents, models, tools };
  }

  private groupModelsByProvider(
    flat: ModelConfig[],
  ): Record<string, ProviderConfig> {
    const providers: Record<string, ProviderConfig> = {};
    for (const m of flat) {
      const key = m.provider || 'default';
      if (!providers[key]) {
        providers[key] = {
          baseUrl: m.baseUrl ?? '',
          apiKey: m.apiKey ?? '',
          api: 'openai-completions',
          models: [],
        };
      }
      providers[key].models.push({
        id: m.modelName || m.name,
        name: m.name,
        temperature: m.temperature,
        maxTokens: m.maxTokens,
        enabled: m.enabled,
      });
    }
    return providers;
  }

  private toStoredAgents(
    flat: AgentConfig[],
    providers?: Record<string, ProviderConfig>,
  ): StoredAgent[] {
    return flat.map((a) => ({
      name: a.name,
      description: a.description,
      model: this.resolveModelRef(a.model, providers),
      systemPrompt: a.systemPrompt,
      tools: a.tools,
      enabled: a.enabled,
    }));
  }

  private resolveModelRef(
    modelName: string | undefined,
    providers?: Record<string, ProviderConfig>,
  ): string | undefined {
    if (!modelName) return undefined;
    if (modelName.includes('/')) return modelName;
    if (!providers) return modelName;
    for (const [providerName, provider] of Object.entries(providers)) {
      if (provider.models.some((m) => m.id === modelName)) {
        return `${providerName}/${modelName}`;
      }
    }
    return modelName;
  }
}
