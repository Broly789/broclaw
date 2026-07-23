import { request } from '@umijs/max';
import type { BroclawConfig } from './data';

export async function getBroclawConfig(): Promise<{ data: BroclawConfig }> {
  return request('/api/broclaw/config');
}

export async function saveBroclawConfig(config: BroclawConfig): Promise<void> {
  return request('/api/broclaw/config', {
    method: 'POST',
    data: config,
  });
}
