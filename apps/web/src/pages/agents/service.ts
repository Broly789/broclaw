import { request } from '@umijs/max';
import type { BroclawConfig } from './data';

export async function getBroclawConfig(): Promise<{ data: BroclawConfig }> {
  return request('/api/agents/config');
}

export async function saveBroclawConfig(config: BroclawConfig): Promise<void> {
  return request('/api/agents/config', {
    method: 'POST',
    data: config,
  });
}
