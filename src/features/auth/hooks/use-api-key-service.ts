import { useState } from 'react';
import { ApiKeyItem } from '../types';
import { ApiKeyService } from '../services/api-key-service';

export function useApiKeyService(initialKeys: ApiKeyItem[] = []) {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(initialKeys);

  const handleCreateKey = (name?: string) => {
    const newKey = ApiKeyService.createApiKey(apiKeys, name);
    setApiKeys((prev) => [newKey, ...prev]);
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys((prev) => ApiKeyService.revokeApiKey(prev, id));
  };

  return {
    apiKeys,
    handleCreateKey,
    handleRevokeKey,
  };
}
