/**
 * Campaigns API — built on the shared createResourceApi factory.
 */
import { API_ENDPOINTS } from '@/config/api-endpoints';
import { createResourceApi } from '@/shared/utils/resourceApi';

export interface Campaign {
  id: number;
  orgId: number;
  name: string;
  status: string;
}

export interface Recipient {
  id: number;
  accountId: number;
  name: string;
  email?: string;
  phone?: string;
}

export interface CampaignSchedule {
  id: number;
  orgId?: number;
  campaignId?: number;
  contactId?: number;
  scheduledAt: string;
  status?: string;
}

const campaignsBase = createResourceApi<Campaign>({
  endpoints: API_ENDPOINTS.campaigns as any,
  storageKey: 'piq_campaigns',
  label: 'campaign',
  seed: [
    { id: 1, orgId: 1, name: 'Q3 Vendor Outreach', status: 'active' },
    { id: 2, orgId: 1, name: 'Contract Renewal Wave', status: 'draft' },
  ],
});

const recipientsBase = createResourceApi<Recipient>({
  endpoints: API_ENDPOINTS.campaigns.recipients as any,
  storageKey: 'piq_recipients',
  label: 'recipient',
  seed: [
    { id: 1, accountId: 1, name: 'Acme Corp', email: 'vendor@acme.com', phone: '+1-555-0101' },
    { id: 2, accountId: 1, name: 'BuildPro LLC', email: 'hello@buildpro.com' },
  ],
});

const schedulesBase = createResourceApi<CampaignSchedule>({
  endpoints: API_ENDPOINTS.campaigns.schedules as any,
  storageKey: 'piq_schedules',
  label: 'schedule',
  seed: [],
});

export const CampaignsApi = {
  listCampaigns: () => campaignsBase.list(),
  createCampaign: (data: Omit<Campaign, 'id'>) => campaignsBase.create(data),
  updateCampaign: (id: number, data: Omit<Campaign, 'id'>) => campaignsBase.update(id, data),
  deleteCampaign: (id: number) => campaignsBase.remove(id),

  listRecipients: () => recipientsBase.list(),
  createRecipient: (data: Omit<Recipient, 'id'>) => recipientsBase.create(data),
  updateRecipient: (id: number, data: Omit<Recipient, 'id'>) => recipientsBase.update(id, data),
  deleteRecipient: (id: number) => recipientsBase.remove(id),

  listSchedules: () => schedulesBase.list(),
  createSchedule: (data: Omit<CampaignSchedule, 'id'>) => schedulesBase.create(data),
  updateSchedule: (id: number, data: Omit<CampaignSchedule, 'id'>) => schedulesBase.update(id, data),
  deleteSchedule: (id: number) => schedulesBase.remove(id),
};
