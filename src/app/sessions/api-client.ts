import { createResourceApi } from '@/shared/utils/resourceApi';
import { Session } from '@/features/sessions/sessionsSlice';

export const sessionsApi = createResourceApi<Session>({
  endpoints: {
    list: '/api/sessions',
    create: '/api/sessions',
    update: (id: string) => `/api/sessions/${id}`,
    delete: (id: string) => `/api/sessions/${id}`,
  },
  storageKey: 'procureiq_sessions',
  label: 'Sessions',
});
