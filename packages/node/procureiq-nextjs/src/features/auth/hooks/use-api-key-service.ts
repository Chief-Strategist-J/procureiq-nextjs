import { useState } from 'react';
import { ApiKeyItem } from '../types';
import { ApiKeyService } from '../services/api-key-service';

export function useApiKeyService(
  initialKeys: ApiKeyItem[] = [],
  service: ApiKeyService = ApiKeyService.getInstance()
) {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(initialKeys);

  const handleCreateKey = (name?: string) => {
    const newKey = service.createApiKey(apiKeys, name);
    setApiKeys((prev) => [newKey, ...prev]);
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys((prev) => service.revokeApiKey(prev, id));
  };

  return {
    apiKeys,
    handleCreateKey,
    handleRevokeKey,
  };
}
