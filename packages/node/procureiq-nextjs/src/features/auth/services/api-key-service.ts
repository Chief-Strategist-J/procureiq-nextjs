import { ApiKeyItem } from '../types';

export type PrefixGenerator = () => string;
export type IdGenerator = () => string;

export class ApiKeyService {
  private static defaultInstance: ApiKeyService | null = null;

  constructor(
    private prefixGenerator: PrefixGenerator = () =>
      `piq_live_${Math.random().toString(36).substring(2, 6)}`,
    private idGenerator: IdGenerator = () => `key-${Date.now()}`
  ) {}

  public static getInstance(): ApiKeyService {
    if (!ApiKeyService.defaultInstance) {
      ApiKeyService.defaultInstance = new ApiKeyService();
    }
    return ApiKeyService.defaultInstance;
  }

  public createApiKey(existingKeys: ApiKeyItem[], name?: string): ApiKeyItem {
    const keyNumber = existingKeys.length + 1;
    return {
      id: this.idGenerator(),
      name: name || `API Access Key ${keyNumber}`,
      keyPrefix: this.prefixGenerator(),
      createdAt: new Date().toISOString().split('T')[0],
      lastUsedAt: 'Never',
    };
  }

  public revokeApiKey(existingKeys: ApiKeyItem[], id: string): ApiKeyItem[] {
    return existingKeys.filter((key) => key.id !== id);
  }
}
