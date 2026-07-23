import { API_ENDPOINTS } from '@/config/api-endpoints';
import { createResourceApi } from '@/shared/utils/resourceApi';

export interface Reminder {
  id: number;
  title: string;
  description?: string;
  dueAt: string;
  scheduledAt?: string;
  recurrence?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  contactPreference?: 'CALL' | 'SMS' | 'SLACK';
  assigneeName?: string;
  assigneeContact?: string;
  status: 'PENDING' | 'COMPLETED' | 'SNOOZED' | 'FAILED' | 'pending' | 'completed' | 'snoozed' | 'failed';
  snoozeCount?: number;
  createdAt?: string;
  userId?: number;
  message?: string;
  channel?: 'CALL' | 'SMS' | 'SLACK';
}

export const RemindersApi = createResourceApi<Reminder>({
  endpoints: API_ENDPOINTS.reminders as any,
  storageKey: 'procureiq_reminders',
  label: 'reminder',
  seed: [],
});
