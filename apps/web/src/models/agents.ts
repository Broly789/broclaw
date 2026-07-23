import { message } from 'antd';
import { useCallback, useState } from 'react';
import type {
  AgentConfig,
  BroclawConfig,
  ModelConfig,
  ToolConfig,
} from '@/pages/agents/data';
import { getBroclawConfig, saveBroclawConfig } from '@/pages/agents/service';

export interface AgentsModel {
  config: BroclawConfig;
  loading: boolean;
  saving: boolean;
  fetchConfig: () => Promise<void>;
  updateAgents: (agents: AgentConfig[]) => void;
  updateModels: (models: ModelConfig[]) => void;
  updateTools: (tools: ToolConfig[]) => void;
  persist: () => Promise<void>;
}

export default function useAgentsModel(): AgentsModel {
  const [config, setConfig] = useState<BroclawConfig>({
    agents: [],
    models: [],
    tools: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBroclawConfig();
      if (res.data) setConfig(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAgents = useCallback((agents: AgentConfig[]) => {
    setConfig((prev) => ({ ...prev, agents }));
  }, []);

  const updateModels = useCallback((models: ModelConfig[]) => {
    setConfig((prev) => ({ ...prev, models }));
  }, []);

  const updateTools = useCallback((tools: ToolConfig[]) => {
    setConfig((prev) => ({ ...prev, tools }));
  }, []);

  const persist = useCallback(async () => {
    setSaving(true);
    try {
      await saveBroclawConfig(config);
      message.success('保存成功');
    } catch {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  }, [config]);

  return {
    config,
    loading,
    saving,
    fetchConfig,
    updateAgents,
    updateModels,
    updateTools,
    persist,
  };
}
