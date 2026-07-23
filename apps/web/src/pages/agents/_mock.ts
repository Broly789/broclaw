import type { Request, Response } from 'express';

const mockConfig = {
  agents: [
    {
      name: '客服助手',
      description: '自动回复用户常见问题',
      model: 'gpt-4',
      systemPrompt: '你是一个友好的客服助手',
      tools: ['search_knowledge'],
      enabled: true,
    },
    {
      name: '代码审查员',
      description: '审查 Pull Request 代码质量',
      model: 'claude-3',
      systemPrompt: '你是一个资深代码审查员',
      tools: ['run_linter'],
      enabled: false,
    },
  ],
  models: [
    {
      name: 'GPT-4',
      provider: 'openai',
      apiKey: '',
      baseUrl: 'https://api.openai.com/v1',
      modelName: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
      enabled: true,
    },
    {
      name: 'Claude 3',
      provider: 'anthropic',
      apiKey: '',
      baseUrl: 'https://api.anthropic.com/v1',
      modelName: 'claude-3-opus-20240229',
      temperature: 0.3,
      maxTokens: 4096,
      enabled: false,
    },
  ],
  tools: [
    {
      name: 'search_knowledge',
      description: '搜索知识库',
      type: 'function',
      config: { engine: 'internal' },
      enabled: true,
    },
    {
      name: 'run_linter',
      description: '运行代码检查',
      type: 'function',
      config: { linter: 'biome' },
      enabled: true,
    },
    {
      name: 'code_interpreter',
      description: '代码解释器',
      type: 'function',
      config: {},
      enabled: false,
    },
  ],
};

function getConfig(_req: Request, res: Response) {
  return res.json({ data: mockConfig });
}

function mergeArray(original: any[], incoming: any[], key: string) {
  const map = new Map(original.map(item => [item[key], item]));
  for (const item of incoming) {
    map.set(item[key], item);
  }
  return Array.from(map.values());
}

function saveConfig(req: Request, res: Response) {
  const body = req.body;
  if (body.agents) {
    mockConfig.agents = mergeArray(mockConfig.agents, body.agents, 'name');
  }
  if (body.models) {
    mockConfig.models = mergeArray(mockConfig.models, body.models, 'name');
  }
  if (body.tools) {
    mockConfig.tools = mergeArray(mockConfig.tools, body.tools, 'name');
  }
  return res.json({ success: true });
}

export default {
  'GET  /api/broclaw/config': getConfig,
  'POST /api/broclaw/config': saveConfig,
};
