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

const base = createResourceApi<Reminder>({
  endpoints: API_ENDPOINTS.reminders as any,
  storageKey: 'procureiq_reminders',
  label: 'reminder',
  seed: [],
});

export const RemindersApi = {
  listReminders: () => base.list(),
  createReminder: (data: Omit<Reminder, 'id'>) => base.create(data),
  updateReminder: (id: number, data: Partial<Omit<Reminder, 'id'>>) =>
    base.update(id, data as Omit<Reminder, 'id'>),
  deleteReminder: (id: number) => base.remove(id),
};
