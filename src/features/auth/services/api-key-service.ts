import { ApiKeyItem } from '../types';

export class ApiKeyService {
  public static createApiKey(existingKeys: ApiKeyItem[], name?: string): ApiKeyItem {
    const keyNumber = existingKeys.length + 1;
    return {
      id: `key-${Date.now()}`,
      name: name || `API Access Key ${keyNumber}`,
      keyPrefix: `piq_live_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsedAt: 'Never',
    };
  }

  public static revokeApiKey(existingKeys: ApiKeyItem[], id: string): ApiKeyItem[] {
    return existingKeys.filter((key) => key.id !== id);
  }
}
