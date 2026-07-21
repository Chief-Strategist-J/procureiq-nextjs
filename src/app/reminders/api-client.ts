/**
 * Reminders API — built on the shared createResourceApi factory.
 */
import { API_ENDPOINTS } from '@/config/api-endpoints';
import { createResourceApi } from '@/shared/utils/resourceApi';

export interface Reminder {
  id: number;
  userId: number;
  title: string;
  message: string;
  scheduledAt: string;
  status: 'pending' | 'completed' | 'snoozed' | 'failed';
  channel?: 'CALL' | 'SMS' | 'SLACK';
}

export const RemindersApi = createResourceApi<Reminder>({
  endpoints: API_ENDPOINTS.reminders as any,
  storageKey: 'procureiq_reminders',
  label: 'reminder',
  seed: [],
});
